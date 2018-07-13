import Vue from 'vue';
import Vuex from 'vuex';
import firebase from 'firebase/app';
import router from '@/router';
import merge from 'deepmerge';

Vue.use(Vuex);

export const store = new Vuex.Store({
    state:{
        user:null,
        userIsAuthenticated:false,
        entityListeners:null,
        currentEntity:null,
        currentPrimaryRelativeCaregivers:false,
        newSubEntityMeta:{}, // Set by parent prior to creating a subentity to reference the parent object
        forceLocalFirebaseListenerCommit:false, // used to override skipping local write when a new subentity is created (because its created with an object that its sending)
    },
    mutations:{
        setUserIsAuthenticated(state, replace){
            state.userIsAuthenticated = replace;
        },
        setUser(state, replace){
            state.user = replace;
        },
        setForceLocalFirebaseListenerCommit(state,replacement){
            state.forceLocalFirebaseListenerCommit = replacement;
        },
        // Receives {ParentId:'', ParentType:''} OR {}
        setNewSubEntityMeta(state,newSubEntityMetaReplacement){
            state.forceLocalFirebaseListenerCommit = true;
            state.newSubEntityMeta=newSubEntityMetaReplacement;
        },
        // Initialize an Entity
        // Receives: entityContainer{collectionId:'',docContainer:{id: '', data:{} } }
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
                        if(key == 'NestedCollections'){
                            state.currentEntity[entityPropertyContainer.collectionId].data[key] = merge( state.currentEntity[entityPropertyContainer.collectionId].data[key], entityPropertyContainer.propertiesObject[key]);
                        }
                        else{
                            state.currentEntity[entityPropertyContainer.collectionId].data[key] = entityPropertyContainer.propertiesObject[key];
                        }
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
                    else if(true || context.state.forceLocalFirebaseListenerCommit || !doc.metadata.hasPendingWrites){
                        if(context.state.forceLocalFirebaseListenerCommit) context.commit('setForceLocalFirebaseListenerCommit',false);

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
                let newSubEntityMetaLocal = {};

                // Determine and set the new add to include parent meta properties if this is a sub/nested entity
                if(context.state.newSubEntityMeta.hasOwnProperty('ParentId')){ // the newSubEntityMeta object is not empty therefore its a sub entity
                    newSubEntityMetaLocal = Object.assign({},context.state.newSubEntityMeta); // copy the newSubEntityMeta locally (removing the reference)
                    context.commit('setNewSubEntityMeta',{}); // reset the storage newSubEntityMeta now (rather than in .then) in case the addtion fails; that way there won't be a parent ref hanging out for a later add which could be a top level    
                }

                firebase.firestore().collection(collectionId).add(newSubEntityMetaLocal)
                .then(function(docRef) {    
                    // Determine and set the parent to know about the sub/nested entity
                    if(newSubEntityMetaLocal.hasOwnProperty('ParentId')){ // the newSubEntityMeta object is not empty therefore its a sub entity
                        let NestedCollections = {};  // holds an array of child entities
                        NestedCollections[collectionId] =  [docRef.id];
                        context.dispatch('update_currentEntity_byEntityPropertyContainer', {
                            collectionId: newSubEntityMetaLocal.ParentType,
                            propertiesObject:{
                                NestedCollections:NestedCollections,
                            }
                        });
                    }
                    context.dispatch('getEntity_ByEntityContainer', {docId:docRef.id,collectionId:collectionId,});
                    console.log('router.replace /add: ' + router.currentRoute.fullPath.replace(/add/, "") + docRef.id);
                    router.replace(router.currentRoute.fullPath.replace(/add/, "") + docRef.id);
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