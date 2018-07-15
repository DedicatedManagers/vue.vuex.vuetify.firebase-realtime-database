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
    getters:{
        // Receives fieldValueCollectionContainer: {docId:'', collectionId:'', fieldName:''}
        getCurrentEntityFieldValue: (state) => (fieldValueCollectionContainer) => {
            if (!store.state.currentEntity) return "";
            if (!store.state.currentEntity[fieldValueCollectionContainer.collectionId]) return "";
            if (!store.state.currentEntity[fieldValueCollectionContainer.collectionId][fieldValueCollectionContainer.docId]) return "";
            if (!store.state.currentEntity[fieldValueCollectionContainer.collectionId][fieldValueCollectionContainer.docId].data) return "";
            if (!store.state.currentEntity[fieldValueCollectionContainer.collectionId][fieldValueCollectionContainer.docId].data[fieldValueCollectionContainer.fieldName]) return "";
            return store.state.currentEntity[fieldValueCollectionContainer.collectionId][fieldValueCollectionContainer.docId].data[fieldValueCollectionContainer.fieldName];
        }
    },
    mutations:{
        setUserIsAuthenticated(state, replace){
            state.userIsAuthenticated = replace;
        },
        setUser(state, replace){
            state.user = replace;
        },
        deleteAllCurrentEntitesAndListeners(state){
            // Clear out the currentEntity
            state.currentEntity = null;
            // Cler out the entityListeners by executing them, which closes them
            if(typeof state.entityListeners === 'object'){
                for (let entityListenerGroup in state.entityListeners) {
                    if(typeof entityListenerGroup === 'object'){
                        for (let entityListener in entityListenerGroup){
                            if(typeof entityListener === 'function'){
                                entityListener();
                            }
                        }
                    }
                }
                state.entityListeners = null;
            }           
            console.log('end deleteAllCurrentEntitesAndListeners context.state.entityListeners: ' + JSON.stringify(state.entityListeners))
        },
        // Initialize an Entity
        // Receives: docEntityContainer{docId:'', collectionId:'',docContainer:{id: '', data:{} } }
        initialize_currentEntity_byDocEntityContainer(state, docEntityContainer){
            if(!state.currentEntity) state.currentEntity={}; // initialize the holder if its not yet initialized
            if(!state.currentEntity[docEntityContainer.collectionId]) Vue.set(state.currentEntity, docEntityContainer.collectionId, {}); // Vue.set is requred when adding property to an object to make it reactive
            // set the data
            Vue.set(state.currentEntity[docEntityContainer.collectionId], docEntityContainer.docId, docEntityContainer.docContainer); // Vue.set is requred when adding property to an object to make it reactive
        },
        // Receives: entityPropertyContainer{ docId:'',collectionId:'',propertiesObject:{prop:val,[prop2:val2]} }
        mutate_currentEntity_byEntityPropertyContainer(state, entityPropertyContainer){
            // If this is the first property being added on the Entity, the entity type / collectionId property won't be set yet
            if(!state.currentEntity[entityPropertyContainer.collectionId]) Vue.set(state.currentEntity, entityPropertyContainer.collectionId, {});
            // If this is the first property being added on the Entity, the entity type / collectionId property won't be set yet
            if(!state.currentEntity[entityPropertyContainer.collectionId][entityPropertyContainer.docId]) Vue.set(state.currentEntity[entityPropertyContainer.collectionId], entityPropertyContainer.docId, {});
            // If this is the first property being added on the Entity, the entity type / collectionId property won't be set yet - set it and its data property
            if(!state.currentEntity[entityPropertyContainer.collectionId][entityPropertyContainer.docId]) Vue.set(state.currentEntity[entityPropertyContainer.collectionId], entityPropertyContainer.docId, {data:{}});

            
            // Loop through the key/value pairs sent in the properties object and set them on the collection
            for (var key in entityPropertyContainer.propertiesObject) {
                if (entityPropertyContainer.propertiesObject.hasOwnProperty(key)) { // only look at key's we set, not any javascript object helper keys on the object
                    // If thisis the first time we've set this property on the entity, add the property using Vue.set so that its reactive
                    if(!state.currentEntity[entityPropertyContainer.collectionId][entityPropertyContainer.docId].data.hasOwnProperty(key)){
                        Vue.set(state.currentEntity[entityPropertyContainer.collectionId][entityPropertyContainer.docId].data, key, entityPropertyContainer.propertiesObject[key]);
                    }
                    else{
                        if(key == 'NestedCollections'){
                            state.currentEntity[entityPropertyContainer.collectionId][entityPropertyContainer.docId].data[key] = merge( state.currentEntity[entityPropertyContainer.collectionId][entityPropertyContainer.docId].data[key], entityPropertyContainer.propertiesObject[key]);
                        }
                        else{
                            state.currentEntity[entityPropertyContainer.collectionId][entityPropertyContainer.docId].data[key] = entityPropertyContainer.propertiesObject[key];
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
            console.log('store action getEntity_ByEntityContainer. Object received: ' + JSON.stringify(entityContainer));
            // Initialize the listeners array if not initialized yet
            if(!context.state.entityListeners) context.state.entityListeners={};
            if(!context.state.entityListeners[entityContainer.collectionId]) context.state.entityListeners[entityContainer.collectionId]={};
            
            // If there is already a listener for this collection, unsubscribe it
            if(typeof context.state.entityListeners[entityContainer.collectionId][entityContainer.docId] === 'function') context.state.entityListeners[entityContainer.collectionId][entityContainer.docId]();

            // Remove any old info so it is not shown prior to async call returning info
            context.commit('initialize_currentEntity_byDocEntityContainer', {docId:entityContainer.docId,collectionId:entityContainer.collectionId,docContainer:null,});

            // Create New
            if(entityContainer.docId == "add"){
                context.dispatch('fcommit_Entity_byCollectionContainer', {docId:entityContainer.docId, collectionId:entityContainer.collectionId});
            }
            // Get existing
            else{
                // Set up the new query & listener
                context.state.entityListeners[entityContainer.collectionId][entityContainer.docId] = firebase.firestore().collection(entityContainer.collectionId).doc(entityContainer.docId).onSnapshot(function(doc){
                    if(!doc.exists){
                        context.commit('initialize_currentEntity_byDocEntityContainer', {docId:entityContainer.docId,collectionId:entityContainer.collectionId,docContainer:null,});
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
                        context.commit('initialize_currentEntity_byDocEntityContainer', {
                            docId:entityContainer.docId,
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
        // Receives: entityPropertyContainer{ docId:'',collectionId:'',propertiesObject:{prop:val,[prop2:val2]} }
        update_currentEntity_byEntityPropertyContainer(context, entityPropertyContainer){
            context.commit('mutate_currentEntity_byEntityPropertyContainer', entityPropertyContainer);
            context.dispatch('fcommit_Entity_byCollectionContainer', {docId:entityPropertyContainer.docId,collectionId:entityPropertyContainer.collectionId});
        },
        // Commit changes to firebase
        // Receives collectionContainer: {docId:'', collectionId:''}
        fcommit_Entity_byCollectionContainer(context, collectionContainer){
            // Updating an entry
            if( context.state.currentEntity &&
                context.state.currentEntity[collectionContainer.collectionId] && 
                context.state.currentEntity[collectionContainer.collectionId][collectionContainer.docId] && 
                context.state.currentEntity[collectionContainer.collectionId][collectionContainer.docId].hasOwnProperty('id') && 
                context.state.currentEntity[collectionContainer.collectionId][collectionContainer.docId].id){
                firebase.firestore().collection(collectionContainer.collectionId).doc(context.state.currentEntity[collectionContainer.collectionId][collectionContainer.docId].id).update(context.state.currentEntity[collectionContainer.collectionId][collectionContainer.docId].data)
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
                if(found && found[3] == collectionContainer.collectionId){  // sanity check that the url matches the entity we are creating
                    if(found[1] && found[2]){ // Parent Entity Type & CollectionId were found
                        // the entity being created is a subentity/child of a parent entity
                        newSubEntityMetaLocal = {
                            ParentType:found[1],
                            ParentCollectionId:found[2], 
                        }
                        console.log('created newSubEntityMetaLocal:' + JSON.stringify(newSubEntityMetaLocal));

                    }    
                }

                firebase.firestore().collection(collectionContainer.collectionId).add(newSubEntityMetaLocal)
                .then(function(docRef) {    
                    console.log('new entity has been created. docRef.id: ' + docRef.id);
                    // Determine and set the parent to know about the sub/nested entity
                    if(newSubEntityMetaLocal.hasOwnProperty('ParentCollectionId')){ // the newSubEntityMeta object is not empty therefore its a sub entity
                        let NestedCollections = {};  // holds an array of child entities
                        NestedCollections[collectionContainer.collectionId] =  [docRef.id];
                        context.dispatch('update_currentEntity_byEntityPropertyContainer', {
                            docId:newSubEntityMetaLocal.ParentCollectionId,
                            collectionId: newSubEntityMetaLocal.ParentType,
                            propertiesObject:{
                                NestedCollections:NestedCollections,
                            }
                        });
                    }
                    context.dispatch('getEntity_ByEntityContainer', {docId:docRef.id,collectionId:collectionContainer.collectionId,});
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