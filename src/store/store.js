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
            if (   !((((store.state.currentEntity||{})[fieldValueCollectionContainer.collectionId]||{})[fieldValueCollectionContainer.docId]||{}).data||{}).hasOwnProperty(fieldValueCollectionContainer.fieldName)    ) return "";
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
        
        // Delete Entity from currentEntity
        // Receives collectionContainer: {docId:'', collectionId:''}
        deleteEntityFromCurrentEntity(state, collectionContainer){
            if(   ((state.currentEntity||{})[collectionContainer.collectionId]||{}).hasOwnProperty(collectionContainer.docId)    ){   // if the entity exists
                delete state.currentEntity[collectionContainer.collectionId][collectionContainer.docId];  
                console.log('deleteEntityFromCurrentEntity - entity deleted! - received object: '+ JSON.stringify(collectionContainer));
            }
            else{
                console.log('deleteEntityFromCurrentEntity - entity not found!');
            }
        },

        // Delete listener from currentListeners
        // Receives collectionContainer: {docId:'', collectionId:''}
        deleteEntityFromEntityListeners(state, collectionContainer){
            if(  typeof ((state.entityListeners||{})[collectionContainer.collectionId]||{})[collectionContainer.docId] === 'function'   ){  // if the listener exists & is a function
                state.entityListeners[collectionContainer.collectionId][collectionContainer.docId]();  // executing the function closes the listener
                delete state.entityListeners[collectionContainer.collectionId][collectionContainer.docId];  // remove the id property from the listeners
                console.log('deleteEntityFromEntityListeners - listener deleted! - received object: '+ JSON.stringify(collectionContainer));
            }
            else{
                console.log('deleteEntityFromEntityListeners - listener not found!');
            }
        },

        deleteAllCurrentEntitesAndListeners(state){
            console.log('deleteAllCurrentEntitesAndListeners');
            // Clear out the currentEntity
            state.currentEntity = null;
            // Cler out the entityListeners by executing them, which closes them
            if(typeof state.entityListeners === 'object'){
                for (let entityListenerGroup in state.entityListeners) {
                    if(typeof state.entityListeners[entityListenerGroup] === 'object'){
                        for (let entityListenerId in state.entityListeners[entityListenerGroup]){
                            if(typeof state.entityListeners[entityListenerGroup][entityListenerId] === 'function'){
                                state.entityListeners[entityListenerGroup][entityListenerId]();
                                delete state.entityListeners[entityListenerGroup][entityListenerId];
                            }
                        }
                    }
                }
                state.entityListeners = null;
            }           
        },
        // Initialize an Entity
        // Receives: docEntityContainer{docId:'', collectionId:'',docContainer:{id: '', data:{} } }
        initialize_currentEntity_byDocEntityContainer(state, docEntityContainer){
            console.log('initialize_currentEntity_byDocEntityContainer');
            if(!state.currentEntity) state.currentEntity={}; // initialize the holder if its not yet initialized
            if(!state.currentEntity[docEntityContainer.collectionId]) Vue.set(state.currentEntity, docEntityContainer.collectionId, {}); // initialize the entity type / collection holder if its not set yet
            // set the data
            Vue.set(state.currentEntity[docEntityContainer.collectionId], docEntityContainer.docId, docEntityContainer.docContainer);
        },
        // Receives: entityPropertyContainer{ docId:'',collectionId:'',propertiesObject:{prop:val,[prop2:val2]} }
        mutate_currentEntity_byEntityPropertyContainer(state, entityPropertyContainer){
            console.log('mutate_currentEntity_byEntityPropertyContainer');
            // if the the entity we are trying to set no longer exists - it was probably deleted at the database or on another real-time client
            if(  !(((state.currentEntity||{})[entityPropertyContainer.collectionId]||{})[entityPropertyContainer.docId]||{}).hasOwnProperty('data')   ){
                // TODO: handle this situation in a better way
                alert('Sorry, this Entity no longer exists.  Possibly it was deleted by someone else while you had it open.');
                console.log('mutate_currentEntity_byEntityPropertyContainer - entity no longer exists.   object passed in: ' + JSON.stringify(entityPropertyContainer));
            }
            else{
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

            }            
        },
        // removes a nested collection property from a 
        // receives object: parentChildEntityPropertyContainer{docId:parentDocId, collectionId:parentCollectionId, childDocId:collectionContainer.docId, childCollectionId:collectionContainer.collectionId})
        deleteNestedCollectionFromParent(state, parentChildEntityPropertyContainer){
            // check that the NestedCollections property for the child docId / entity id exists on the parent collectionId / entity type 
            if(typeof (((((state.currentEntity||{})[parentChildEntityPropertyContainer.collectionId]||{})[parentChildEntityPropertyContainer.docId]||{}).data||{}).NestedCollections||{})[parentChildEntityPropertyContainer.childCollectionId] === 'object'   ){
                delete state.currentEntity[parentChildEntityPropertyContainer.collectionId][parentChildEntityPropertyContainer.docId].data.NestedCollections[parentChildEntityPropertyContainer.childCollectionId][parentChildEntityPropertyContainer.childDocId]
            }
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
            // Create New
            if(entityContainer.docId == "add"){
                context.dispatch('fcreate_Entity_byCollectionContainer', {docId:entityContainer.docId, collectionId:entityContainer.collectionId});
            }
            // Get existing
            else{
                // Initialize the listeners array if not initialized yet
                if(!context.state.entityListeners) context.state.entityListeners={};
                if(!context.state.entityListeners[entityContainer.collectionId]) context.state.entityListeners[entityContainer.collectionId]={};
                
                // If there is already a listener for this collection, unsubscribe it
                if(typeof context.state.entityListeners[entityContainer.collectionId][entityContainer.docId] === 'function') context.state.entityListeners[entityContainer.collectionId][entityContainer.docId]();

                // Remove any old info so it is not shown prior to async call returning info
                // - Need to check if the info does already exist so that we don't create a currentEntity collection doc property on a request where the entity does not exist
                if(  ((context.state.currentEntity||{})[entityContainer.collectionId]||{}).hasOwnProperty(entityContainer.docId)  ){
                    context.commit('initialize_currentEntity_byDocEntityContainer', {docId:entityContainer.docId,collectionId:entityContainer.collectionId,docContainer:null,});
                }

                // Set up the new query & listener
                context.state.entityListeners[entityContainer.collectionId][entityContainer.docId] = firebase.firestore().collection(entityContainer.collectionId).doc(entityContainer.docId).onSnapshot(function(doc){
                    if(!doc.exists){
                        console.log('Listener for collectionId/docId: ' + entityContainer.collectionId + '/' + entityContainer.docId + ' called and the !doc.exists returned false.  This document does not exist! (invalid link or the document was deleted and the listener was not removed');

                        // Situations that lead to here
                        // 1) When sending to delete this document on the server - NOTE: this should no longer happen as the listener is to be deleted before the delete
                        // 2) When this document is deleted via the database of another real-time client
                        // 3) If the lookup for the entity/document is not found (ie a link for a deleted entity was used, or someone changed the id on the submitted link for the entity - thus the document is not found)

                        // if the document/entity exists locally, then this must be a delete from the server or via another real-time client
                        if(  ((context.state.currentEntity||{})[entityContainer.collectionId]||{}).hasOwnProperty(entityContainer.docId)  ){
                            // Therefore: Delete the entity & listener locally
                            context.dispatch('fdelete_Entity_byCollectionContainer', {docId:entityContainer.docId, collectionId:entityContainer.collectionId});
                            alert('The entity (or one of its child entities) has been deleted on the server.  You may need to reload the application by clicking refresh on your browser.');
                        }
                        // otherwise we must be trying to get a document that doesn't exist
                        else{
                            alert('The entity you are trying to retrieve does not exist.');  // TODO: Only works for parent object as ClientContainer loads the values based on the parent docId & gets recursively.  see related TODO note in RelatedChild.vue created function
                        }

                    }
                    // Always update - whether setting locally or receiving new data asynchronously from the firebase server. 
                    // - commits to firebase from our app will also call this listener and it got difficult to try and ingnore the listner when new entites were added 
                    // - if this becomes an issue look into setting some kind of flag passed when it should be ignored locally (as opposed to checking when it shouldn't be ignored)
                    else{

                        // look for nested collections on the loaded entity and load them if they aren't already loaded
                        console.log('nestedcollections');
                        let NestedCollections = doc.data()['NestedCollections']; 
                        if(typeof NestedCollections === 'object' ){ // the loaded entity has nested collections
                            for (let collectionId in NestedCollections) {
                                console.log('looping over NestedCollections.  collectionId: ', JSON.stringify(collectionId));
                                if ( NestedCollections.hasOwnProperty(collectionId) && typeof NestedCollections[collectionId]==='object' ) { // sanity check
                                    console.log('passed sanity check');
                                    for(let docId in NestedCollections[collectionId]){
                                        console.log('docId: ' + docId)
                                        console.log('typeof entity listener: ' + !(typeof ((context.state.entityListeners||{})[collectionId]||{})[docId]  === 'function')  );
                                        // Check Vuex store to see if there is a listener running on this sub-entity
                                        if( !(typeof ((context.state.entityListeners||{})[collectionId]||{})[docId]  === 'function')  ){
                                            // Listener not found - load the entity
                                            context.dispatch('getEntity_ByEntityContainer', {docId:docId,collectionId:collectionId})    
                                        }
                                        else{
                                            // Listener found
                                            console.log('getEntity_ByEntityContainer nested collection check - listener already established therefore the sub entity is already loaded. collectionId/docId:' + collectionId + docId);
                                        }
                                    }
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
        
        // Remove an entity from a parent's neste collection
        // receives object: parentChildEntityPropertyContainer{docId:parentDocId, collectionId:parentCollectionId, childDocId:collectionContainer.docId, childCollectionId:collectionContainer.collectionId})
        removeNestedCollectionFromParent(context, parentChildEntityPropertyContainer){
            console.log('removeNestedCollection - object received: ' + JSON.stringify(parentChildEntityPropertyContainer));

            // delete this child from the parent
            context.commit('deleteNestedCollectionFromParent', parentChildEntityPropertyContainer);
            // commit the parent
            context.dispatch('fcommit_Entity_byCollectionContainer', {docId:parentChildEntityPropertyContainer.docId, collectionId:parentChildEntityPropertyContainer.collectionId});
        },
        // add new entity to firebase
        // Receives collectionContainer: {docId:'', collectionId:''}
        fcreate_Entity_byCollectionContainer(context, collectionContainer){
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
                    let NestedCollections = {};  // holds an object of child entities by child entity type property
                    NestedCollections[collectionContainer.collectionId] = {};
                    NestedCollections[collectionContainer.collectionId][docRef.id] = 1;  // set the docId as a property of the collectionId object
                    context.dispatch('update_currentEntity_byEntityPropertyContainer', {
                        docId:newSubEntityMetaLocal.ParentCollectionId,
                        collectionId: newSubEntityMetaLocal.ParentType,
                        propertiesObject:{
                            NestedCollections:NestedCollections,
                        }
                    });
                }
                context.dispatch('getEntity_ByEntityContainer', {docId:docRef.id,collectionId:collectionContainer.collectionId,});  // rerouting to the same route - vue will not call the Created function on the component
                console.log('router.replace /add: ' + router.currentRoute.fullPath.replace(/add/, "") + docRef.id);
                router.replace(router.currentRoute.fullPath.replace(/add/, "") + docRef.id);
            })
            .catch(function(error) {
                console.error("Error writing document: ", error);
            });    

        },
        // Commit changes to firebase
        // Receives collectionContainer: {docId:'', collectionId:''}
        fcommit_Entity_byCollectionContainer(context, collectionContainer){
            console.log('fcommit_Entity_byCollectionContainer');
            
            // update if the entity still exists
            // - it's possible the entity has been deleted at the server or by another real-time client
            if( (((context.state.currentEntity||{})[collectionContainer.collectionId]||{})[collectionContainer.docId]||{}).hasOwnProperty('data') ){
                firebase.firestore().collection(collectionContainer.collectionId).doc(context.state.currentEntity[collectionContainer.collectionId][collectionContainer.docId].id).update(context.state.currentEntity[collectionContainer.collectionId][collectionContainer.docId].data)
                .then(function() {
                    //console.log("Document successfully written!");
                })
                .catch(function(error) {
                    console.error("Error writing document: ", error);
                });    
            }
            // the entity no longer exists
            else{
                console.log('fcommit_Entity_byCollectionContainer - entity no longer exists.  object passed: ' + JSON.stringify(collectionContainer));
            }
        },
        // Delete Entity / Firebase Document
        // Receives collectionContainer: {docId:'', collectionId:''[, route:{to:'', type:'<replace>'}]}
        fdelete_Entity_byCollectionContainer(context, collectionContainer){
            console.log('delete Entity. received object: ' + JSON.stringify(collectionContainer))

            // Find and call recursively to Delete Nested Collections
            let NestedCollections =  ((((context.state.currentEntity[collectionContainer.collectionId]||{})[collectionContainer.docId])||{}).data||{}).NestedCollections;  // NestedCollections exists || undefined
            if(  NestedCollections  ){ 
                for (let collectionId in NestedCollections) {
                    if ( NestedCollections.hasOwnProperty(collectionId) && typeof NestedCollections[collectionId] === 'object' ) { // sanity check
                        for(let docId in NestedCollections[collectionId]){
                            // Delete this nested collection entity
                            context.dispatch('fdelete_Entity_byCollectionContainer', {docId:docId, collectionId:collectionId});
                        }                        
                    }
                }
            }

            // If this is a child entity of another entity
            if(     
                ((((context.state.currentEntity||{})[collectionContainer.collectionId]||{})[collectionContainer.docId]||{}).data||{}).hasOwnProperty('ParentCollectionId') &&
                ((((context.state.currentEntity||{})[collectionContainer.collectionId]||{})[collectionContainer.docId]||{}).data||{}).hasOwnProperty('ParentType')
            ){
                let parentDocId = context.state.currentEntity[collectionContainer.collectionId][collectionContainer.docId].data.ParentCollectionId;
                let parentCollectionId = context.state.currentEntity[collectionContainer.collectionId][collectionContainer.docId].data.ParentType;
                console.log('sending dispatch to remove child from parent NestedCollections array.');
                context.dispatch('removeNestedCollectionFromParent', {docId:parentDocId, collectionId:parentCollectionId, childDocId:collectionContainer.docId, childCollectionId:collectionContainer.collectionId})
            }

            // Delete Entity from currentEntity
            context.commit('deleteEntityFromCurrentEntity', {docId:collectionContainer.docId, collectionId:collectionContainer.collectionId});

            // Delete listener from currentListeners
            context.commit('deleteEntityFromEntityListeners', {docId:collectionContainer.docId, collectionId:collectionContainer.collectionId});

            // Delete the Entity in the store
            // NOTE: it seems to be ok to delete a document that does not exist 
            firebase.firestore().collection(collectionContainer.collectionId).doc(collectionContainer.docId).delete()
                .then(function() {
                    if(collectionContainer.route && collectionContainer.route.to){
                        router.replace(collectionContainer.route.to);               
                    }
                })
                .catch(function(error) {
                    console.error("Error deleting document: ", error);
                }); 
        },

        getPrimaryRelativeCaregivers(context){
            console.log('getPrimaryRelativeCaregivers');
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