import Vue from 'vue';
import Vuex from 'vuex';
import firebase from 'firebase/app';
import router from '@/router';

Vue.use(Vuex);

export const store = new Vuex.Store({
    state:{
        user:null,
        userIsAuthenticated:false,
        entityListeners:null,
        currentEntity:null,
        currentPrimaryRelativeCaregivers:false,
    },
    mutations:{
        setUserIsAuthenticated(state, replace){
            state.userIsAuthenticated = replace;
        },
        setUser(state, replace){
            state.user = replace;
        },
        // Initialize an Entity
        // Receives: entityContainer{collectionId:'',docContainer:''}
        initialize_currentEntity_byEntityContainer(state, entityContainer){
            if(!state.currentEntity) state.currentEntity={}; // initialize the holder if its not yet initialized
            Vue.set(state.currentEntity, entityContainer.collectionId, entityContainer.docContainer); // Vue.set is requred when adding property to an object to make it reactive
        },
        // Receives: entityPropertyContainer{ collectionId:'',propertiesObject:{} }
        mutate_currentEntity_byEntityPropertyContainer(state, entityPropertyContainer){
            // If this is the first property being added on the Entity, the data property won't be set yet
            if(!state.currentEntity[entityPropertyContainer.collectionId]) Vue.set(state.currentEntity, entityPropertyContainer.collectionId, 'data');
            
            // Loop through the key/value pairs sent in the properties object and set them on the collection
            for (var key in entityPropertyContainer.propertiesObject) {
                if (entityPropertyContainer.propertiesObject.hasOwnProperty(key)) { // only look at key's we set, not any javascript object helper keys on the object
                    // If thisis the first time we've set this property on the entity, add the property using Vue.set so that its reactive
                    if(!state.currentEntity[entityPropertyContainer.collectionId].data.hasOwnProperty(key)){
                        Vue.set(state.currentEntity[entityPropertyContainer.collectionId].data, key, entityPropertyContainer.propertiesObject[key]);
                    }
                    else{
                        state.currentEntity[entityPropertyContainer.collectionId].data[key] = entityPropertyContainer.propertiesObject[key];
                    }
                }
            };
        },
    },
    actions:{
        login(context, credentials){
            firebase.auth().signInWithEmailAndPassword(credentials.username, credentials.password)
            .then(data=>{
                console.log('Logged in.');
                router.push('/dashboard');
            })
            .catch(e=>{
                console.log('Login failed: ', e);
                alert(e.message)
            });  
        },
        logout(context){
            firebase.auth().signOut()
            .then(data=>{
              console.log('Logged out.');
              router.push('/login');
            })
            .catch(e=>{
              console.log('Logout failed: ', e);
            });
        },
        // Retrieve an Entity data from firebase
        // Receives Object: entityContainer{docId:'',collectionId:''}
        getEntity_ByEntityContainer(context, entityContainer){
            // Initialize the listeners array if not initialized yet
            if(!context.state.entityListeners){
                context.state.entityListeners={};
            }
            // If there is already a listener for this collection, unsubscribe it
            if(context.state.entityListeners[entityContainer.collectionId]){
                context.state.entityListeners[entityContainer.collectionId]();
            }

            // Remove any old info so it is not shown prior to async call returning info
            context.commit('initialize_currentEntity_byEntityContainer', {collectionId:entityContainer.collectionId,docContainer:null,});

            // Create New
            if(entityContainer.docId == "add"){
                context.dispatch('fcommit_Entity_byCollectionId', entityContainer.collectionId);
                console.log('Creating new entity: ' + entityContainer.collectionId);
            }
            // Get existing
            else{
                // Set up the new query & listener
                context.state.entityListeners[entityContainer.collectionId] = firebase.firestore().collection(entityContainer.collectionId).doc(entityContainer.docId).onSnapshot(function(doc){
                    if(!doc.exists){
                        context.commit('initialize_currentEntity_byEntityContainer', {collectionId:entityContainer.collectionId,docContainer:null,});
                        console.log('listener doc does not exist');
                    }
                    // Only update if receiving new data from the firebase server. 
                    // - commits to firebase from our app will also call this listener and we can ignore since its just putting the data back where it came from
                    else if(!doc.metadata.hasPendingWrites){
                        context.commit('initialize_currentEntity_byEntityContainer', {
                            collectionId:entityContainer.collectionId,
                            docContainer:{
                                id: entityContainer.docId,
                                data: doc.data(),    
                            }
                        })
                    }
                });            
            }
        },
        // update the local and remote storage for the entity
        // Receives: entityPropertyContainer{ collectionId:'',propertiesObject:{} }
        update_currentEntity_byEntityPropertyContainer(context, entityPropertyContainer){
            context.commit('mutate_currentEntity_byEntityPropertyContainer', entityPropertyContainer);
            context.dispatch('fcommit_Entity_byCollectionId', entityPropertyContainer.collectionId);
        },
        // Commit changes to firebase
        fcommit_Entity_byCollectionId(context, collectionId){
            // Updating an entry
            if( context.state.currentEntity &&
                context.state.currentEntity[collectionId] && 
                context.state.currentEntity[collectionId].hasOwnProperty('id') && 
                context.state.currentEntity[collectionId].id){
                firebase.firestore().collection(collectionId).doc(context.state.currentEntity[collectionId].id).update(context.state.currentEntity[collectionId].data)
                .then(function() {
                    //console.log("Document successfully written!");
                })
                .catch(function(error) {
                    console.error("Error writing document: ", error);
                });    
            }
            // Creating a new entry
            else{
                console.log('creating new');
                firebase.firestore().collection(collectionId).add({})
                .then(function(docRef) {    
                    context.dispatch('getEntity_ByEntityContainer', {docId:docRef.id,collectionId:collectionId,});
                    //TODO: Remove hard coded redirects!
                    console.log('collectionId to be added');
                    console.log(collectionId);
                    if(collectionId=='RelatedChild')
                        router.replace('/child/' + docRef.id);
                    else if(collectionId=='PrimaryRelativeCaregiver'){
                        router.replace('/client/' + docRef.id);
                    }
                    else {
                        router.replace('/dashboard/');
                        console.log("ERROR #DKF343: Router redirect undefined for adding new collection");
                    }               
                })
                .catch(function(error) {
                    console.error("Error writing document: ", error);
                });    
            }
        },
        // Delete Client
        fdelete_Entity_byCollectionId(context, collectionId){
            firebase.firestore().collection(collectionId).doc(context.state.currentEntity[collectionId].id).delete()
                .then(function(docRef) {
                    router.replace('/dashboard');               
                })
                .catch(function(error) {
                    console.error("Error deleting document: ", error);
                }); 
        },

        getPrimaryRelativeCaregivers(context){
            firebase.firestore().collection('PrimaryRelativeCaregiver').get()
            .then(function(querySnapshot){
                let PrimaryRelativeCaregiverOBJ = {};
                querySnapshot.forEach(function(doc){
                    PrimaryRelativeCaregiverOBJ[doc.id] = doc.data();
                });
                context.state.currentPrimaryRelativeCaregivers=PrimaryRelativeCaregiverOBJ;
            })
            .catch(function(error) {
                console.error("Error retrieving clients: ", error);
            });
        },
    }
})