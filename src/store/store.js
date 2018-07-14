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
    },
    mutations:{
        setUserIsAuthenticated(state, replace){
            state.userIsAuthenticated = replace;
        },
        setUser(state, replace){
            state.user = replace;
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
            console.log('getEntity_ByEntityContainer');
            // Initialize the listeners array if not initialized yet
            if(!context.state.entityListeners) context.state.entityListeners={};
            if(!context.state.entityListeners[entityContainer.collectionId]) context.state.entityListeners[entityContainer.collectionId]={};
            
            // If there is already a listener for this collection, unsubscribe it
            if(typeof context.state.entityListeners[entityContainer.collectionId][entityContainer.docId] === 'function') context.state.entityListeners[entityContainer.collectionId][entityContainer.docId]();

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
                context.state.entityListeners[entityContainer.collectionId][entityContainer.docId] = firebase.firestore().collection(entityContainer.collectionId).doc(entityContainer.docId).onSnapshot(function(doc){
                    if(!doc.exists){
                        context.commit('initialize_currentEntity_byEntityContainer', {collectionId:entityContainer.collectionId,docContainer:null,});
                        console.log('listener doc does not exist');
                    }
                    // Always update - whether setting locally or receiving new data asynchronously from the firebase server. 
                    // - commits to firebase from our app will also call this listener and it got difficult to try and ingnore the listner when new entites were added 
                    // - if this becomes an issue look into setting some kind of flag passed when it should be ignored locally (as opposed to checking when it shouldn't be ignored)
                    else{
                        let NestedCollections = doc.data()['NestedCollections'];
                        if(typeof NestedCollections === 'object' ){
                            for (let collectionId in NestedCollections) {
                                if ( NestedCollections.hasOwnProperty(collectionId) && Array.isArray(NestedCollections[collectionId]) ) { // sanity check
                                    NestedCollections[collectionId].forEach( docId => {
                                        // Check Vuex store to see if there is a listener running on this sub-entity
                                        if( !(context.state.entityListeners[collectionId] && context.state.entityListeners[collectionId][docId]) ){
                                            // Listener not found - load the entity
                                            context.dispatch('getEntity_ByEntityContainer', {docId:docId,collectionId:collectionId})    
                                        }
                                    });                                    
                                }
                            }
                
                        }
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
                let newSubEntityMetaLocal = {}; // empty object means it's not a sub-entity

                // check the route to see whether or not we are creating a sub-entity. 
                // ie  /ParentEntityType/xxxParentCollectionIdxxx/NewChild--EntityType-aka-CollectionId/add
                // if we are creating a sub entity:
                // found[1] - Contains the Parent Entity Type
                // found[2] - Contains the Parent Entity CollectionId
                // found[3] - Contains the New Child Entity type, which should match the collectionId
                let found = router.currentRoute.fullPath.match(   /\/((?:[^\/]+?))\/((?:[^\/]+?))\/((?:[^\/]+?))\/add/   );  
                if(found && found[3] == collectionId){  // sanity check that the url matches the entity we are creating
                    if(found[1] && found[2]){ // Parent Entity Type & CollectionId were found
                        // the entity being created is a subentity/child of a parent entity
                        newSubEntityMetaLocal = {
                            ParentType:found[1],
                            ParentCollectionId:found[2], 
                        }

                    }    
                }

                firebase.firestore().collection(collectionId).add(newSubEntityMetaLocal)
                .then(function(docRef) {    

                    // Determine and set the parent to know about the sub/nested entity
                    if(newSubEntityMetaLocal.hasOwnProperty('ParentCollectionId')){ // the newSubEntityMeta object is not empty therefore its a sub entity
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
        // Delete Entity / Firebase Document
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
                console.error("Error retrieving collection: ", error);
            });
        },
    }
})