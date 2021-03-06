import Vue from 'vue';
import Vuex from 'vuex';
import firebase from 'firebase/app';
import router from '@/router';
import merge from 'deepmerge';
import debounce from 'debounce';

Vue.use(Vuex);


export const store = new Vuex.Store({
    state:{
        loadingIndicator:false, // each component needs to show/hide its output based on this indicator.  Can't show or hide at the <router-view /> level or the component <script> function's won't ever load (hence the app will stay in the "loading" state indefinitely) 
        user:null,
        userIsAuthenticated:false,
        entityListeners:null,
        currentEntity:null,
        fsearchEntities:null,
        fsearchListeners:null,
        entityDebouncers:null,
        localUpdateId:null,
    },
    getters:{
        // Receives fieldValueCollectionContainer: {docId:'', collectionId:'', fieldName:''}
        getCurrentEntityFieldValue: (state) => (fieldValueCollectionContainer) => {
            if (   !((((state.currentEntity||{})[fieldValueCollectionContainer.collectionId]||{})[fieldValueCollectionContainer.docId]||{}).data||{}).hasOwnProperty(fieldValueCollectionContainer.fieldName)    ) return "";
            return state.currentEntity[fieldValueCollectionContainer.collectionId][fieldValueCollectionContainer.docId].data[fieldValueCollectionContainer.fieldName];
        },
    },
    mutations:{
        setUserIsAuthenticated(state, replace){
            state.userIsAuthenticated = replace;
        },
        setUser(state, replace){
            state.user = replace;
        },

        setLoadingIndicator(state,replace){
            console.log('setLoadingIndicator: ' + replace);
            state.loadingIndicator = replace;
        },
        
        // set search configuration & results - used in conjunction with EntitySearch.vue
        setSearchEntity(state, searchObj){
            console.log('setSearchEntity - searchObj:', searchObj);
            if(!state.fsearchEntities) state.fsearchEntities = {};            
            Vue.set(state.fsearchEntities, searchObj.queryId, searchObj);
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
            // Clear out the entityDebouncers
            state.entityDebouncers = null;
        },
        // Initialize an Entity
        // Receives: docEntityContainer{docId:'', collectionId:'',docContainer:{id: '', data:{} } }
        initializeCurrentEntity(state, docEntityContainer){
            if(!state.currentEntity) state.currentEntity={}; // initialize the holder if its not yet initialized
            if(!state.currentEntity[docEntityContainer.collectionId]) Vue.set(state.currentEntity, docEntityContainer.collectionId, {}); // initialize the entity type / collection holder if its not set yet
            // set the data
            Vue.set(state.currentEntity[docEntityContainer.collectionId], docEntityContainer.docId, docEntityContainer.docContainer);
        },
        // Receives: entityPropertyContainer{ docId:'',collectionId:'',propertiesObject:{prop:val,[prop2:val2]} }
        mutateCurrentEntity(state, entityPropertyContainer){
            console.log('mutateCurrentEntity - object received: ' + JSON.stringify(entityPropertyContainer));
            // if the the entity we are trying to set no longer exists - it was probably deleted at the database or on another real-time client
            if(  !(((state.currentEntity||{})[entityPropertyContainer.collectionId]||{})[entityPropertyContainer.docId]||{}).hasOwnProperty('data')   ){
                // TODO: handle this situation in a better way
                alert('Sorry, this Entity no longer exists.  Possibly it was deleted by someone else while you had it open.');
                console.log('mutateCurrentEntity - entity no longer exists.   object passed in: ' + JSON.stringify(entityPropertyContainer));
            }
            else{
                // Add the propertiesObject if not defined
                // -- This could just be an update to change the modification time (ie a child entity had an update and called to update the parent with a new timestamp)
                if(  !entityPropertyContainer.hasOwnProperty('propertiesObject')  ) entityPropertyContainer.propertiesObject = {};
                
                // Add/adjust the LastUpdated
                entityPropertyContainer.propertiesObject['LastUpdated'] = firebase.firestore.FieldValue.serverTimestamp();
                entityPropertyContainer.propertiesObject['LastUpdatedUid'] = firebase.auth().currentUser.uid;

                // set a random id for this current instance to help alleviate timing issue with firestore listener callback (with timestamps enabled)
                if(!state.localUpdateId) state.localUpdateId = Math.floor(Math.random() * 1000); 
                entityPropertyContainer.propertiesObject['LocalUpdateId'] = state.localUpdateId;

                // Loop through the key/value pairs sent in the properties object and set them on the collection
                for (var key in entityPropertyContainer.propertiesObject) {
                    if (entityPropertyContainer.propertiesObject.hasOwnProperty(key)) { // only look at key's we set, not any javascript object helper keys on the object
                        // If this is the first time we've set this property on the entity, add the property using Vue.set so that its reactive
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
        // removes a NestedCollection item from an Entities list of NestedCollections 
        // receives object: parentChildEntityPropertyContainer{docId:parentDocId, collectionId:parentCollectionId, childDocId:collectionContainer.docId, childCollectionId:collectionContainer.collectionId})
        deleteNestedCollectionFromParent(state, parentChildEntityPropertyContainer){
            // check that the NestedCollections property for the child docId / entity id exists on the parent collectionId / entity type 
            if(typeof (((((state.currentEntity||{})[parentChildEntityPropertyContainer.collectionId]||{})[parentChildEntityPropertyContainer.docId]||{}).data||{}).NestedCollections||{})[parentChildEntityPropertyContainer.childCollectionId] === 'object'   ){
                delete state.currentEntity[parentChildEntityPropertyContainer.collectionId][parentChildEntityPropertyContainer.docId].data.NestedCollections[parentChildEntityPropertyContainer.childCollectionId][parentChildEntityPropertyContainer.childDocId]
                state.currentEntity[parentChildEntityPropertyContainer.collectionId][parentChildEntityPropertyContainer.docId].data['LastUpdated'] = firebase.firestore.FieldValue.serverTimestamp();            
                state.currentEntity[parentChildEntityPropertyContainer.collectionId][parentChildEntityPropertyContainer.docId].data['LastUpdatedUid'] = firebase.auth().currentUser.uid;
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
        getEntity(context, entityContainer){
            console.log('getEntity - Object received: ' + JSON.stringify(entityContainer));
            // Initialize the listeners array if not initialized yet
            if(!context.state.entityListeners) context.state.entityListeners={};
            if(!context.state.entityListeners[entityContainer.collectionId]) context.state.entityListeners[entityContainer.collectionId]={};
            
            // If there is already a listener for this collection, unsubscribe it
            if(typeof context.state.entityListeners[entityContainer.collectionId][entityContainer.docId] === 'function'){
                console.log('deleting listener');
                context.state.entityListeners[entityContainer.collectionId][entityContainer.docId]();
            }

            // Remove any old info so it is not shown prior to async call returning info
            // - Need to check if the info does already exist so that we don't create a currentEntity collection doc property on a request where the entity does not exist
            if(  ((context.state.currentEntity||{})[entityContainer.collectionId]||{}).hasOwnProperty(entityContainer.docId)  ){
                context.commit('initializeCurrentEntity', {docId:entityContainer.docId,collectionId:entityContainer.collectionId,docContainer:null,});
            }

            // Set up the new query & listener
            context.state.entityListeners[entityContainer.collectionId][entityContainer.docId] = firebase.firestore().collection(entityContainer.collectionId).doc(entityContainer.docId).onSnapshot(function(doc){
                console.log('EntityListener for: ' + entityContainer.collectionId + entityContainer.docId);
                console.log(doc.data());
                console.log(doc.metadata);
                if(!doc.exists){
                    console.log('Listener for collectionId/docId: ' + entityContainer.collectionId + '/' + entityContainer.docId + ' called and the !doc.exists returned false.  This document does not exist! (invalid link or the document was deleted and the listener was not removed');

                    // Situations that lead to here
                    // 1) When sending to delete this document on the server - NOTE: this should no longer happen as the listener is to be deleted before the delete
                    // 2) When this document is deleted via the database of another real-time client
                    // 3) If the lookup for the entity/document is not found (ie a link for a deleted entity was used, or someone changed the id on the submitted link for the entity - thus the document is not found)

                    // if the document/entity exists locally, then this must be a delete from the server or via another real-time client
                    if(  ((context.state.currentEntity||{})[entityContainer.collectionId]||{}).hasOwnProperty(entityContainer.docId)  ){
                        // Therefore: Delete the entity & listener locally
                        context.dispatch('fdeleteEntity', {docId:entityContainer.docId, collectionId:entityContainer.collectionId});
                        alert('The entity (or one of its child entities) has been deleted on the server.  You may need to reload the application by clicking refresh on your browser.');
                    }
                    // otherwise we must be trying to get a document that doesn't exist
                    else{
                        alert('The entity you are trying to retrieve does not exist.');  // TODO: Only works for parent object as ClientContainer loads the values based on the parent docId & gets recursively.  see related TODO note in KinshipChild.vue created function
                    }

                }
                else{
                    // look for nested collections on the loaded entity and load them if they aren't already loaded
                    let NestedCollections = doc.data()['NestedCollections']; 
                    if(typeof NestedCollections === 'object' ){ // the loaded entity has nested collections
                        for (let collectionId in NestedCollections) {
                            if ( NestedCollections.hasOwnProperty(collectionId) && typeof NestedCollections[collectionId]==='object' ) { // sanity check
                                for(let docId in NestedCollections[collectionId]){
//                                    console.log('getEntity checking nested collection - main function getEntity - Object received: ' + JSON.stringify(entityContainer));
                                    // Check Vuex store to see if there is a listener running on this sub-entity
                                    if( !(typeof ((context.state.entityListeners||{})[collectionId]||{})[docId]  === 'function')  ){
                                        // Listener not found - load the entity
//                                        console.log('getEntity nested collection check - listener not found.  calling getEntity - collectionId/docId:' + collectionId + docId);
                                        context.dispatch('getEntity', {docId:docId,collectionId:collectionId})    
                                    }
                                    else{
                                        // Listener found
//                                        console.log('getEntity nested collection check - listener already established therefore the sub entity is already loaded. collectionId/docId:' + collectionId + docId);
                                    }
                                }
                            }
                        }
            
                    }

                    // if its not a local update, then update the entity (otherwise it was already updated locally via updateCurrentEntity)
                    // Determine if changes should be updated locally
                    if( 
                        // if there is no LocalUpdateId on the local global storage for the entity, then we're initializing, so commit the changes locally
                        !((((context.state.currentEntity||{})[entityContainer.collectionId]||{})[entityContainer.docId]||{}).data||{}).hasOwnProperty('LocalUpdateId') 
                        || // OR
                        // If the LocalUpdateId has changed, its an update from somewhere else, so commit the changes locally
                        doc.data().LocalUpdateId != context.state.localUpdateId   
                        ){
                            console.log('listenter updating locally')
                            console.log(doc.data());
                            context.commit('initializeCurrentEntity', {
                            docId:entityContainer.docId,
                            collectionId:entityContainer.collectionId,
                            docContainer:{
                                    id: entityContainer.docId,
                                    data: doc.data(),    
                                }
                            })
    
                    }
                }
            });            
        },
        // update the local and remote storage for the entity
        // Receives: entityPropertyContainer{ docId:'',collectionId:'',propertiesObject:{prop:val,[prop2:val2]} }
        updateCurrentEntity(context, entityPropertyContainer){
            console.log('updateCurrentEntity - object received: ' + JSON.stringify(entityPropertyContainer));
            context.commit('mutateCurrentEntity', entityPropertyContainer);

            // Undebounced
            //context.dispatch('fcommitEntity', {docId:entityPropertyContainer.docId,collectionId:entityPropertyContainer.collectionId});

            // if the debouncer for this entity doesn't exist
            if ( typeof (((context.state||{}).entityDebouncers||{})[entityPropertyContainer.collectionId]||{})[entityPropertyContainer.docId] !== 'function' ){
                // initialize function holder for this specific entity if not initialized already
                if(context.state.entityDebouncers === null) context.state.entityDebouncers = {}; // initialize entityDebouncers if not already an object
                if(typeof context.state.entityDebouncers[entityPropertyContainer.collectionId] !== 'object') context.state.entityDebouncers[entityPropertyContainer.collectionId] = {}; // initialize entityDebouncers for this specific entity if not already an object

                // create the debounce function for this specific entity
                context.state.entityDebouncers[entityPropertyContainer.collectionId][entityPropertyContainer.docId] = debounce(  
                    function(ePC){
                        context.dispatch('fcommitEntity', {docId:ePC.docId,collectionId:ePC.collectionId});
                    }, 
                    500, 
                    false
                );
            }

            // call the debouncer
            context.state.entityDebouncers[entityPropertyContainer.collectionId][entityPropertyContainer.docId](entityPropertyContainer);
        },
        
        // Remove an entity from a parent's neste collection
        // receives parentChildEntityPropertyContainer{docId:parentDocId, collectionId:parentCollectionId, childDocId:collectionContainer.docId, childCollectionId:collectionContainer.collectionId})
        removeNestedCollectionFromParent(context, parentChildEntityPropertyContainer){
            console.log('removeNestedCollection - object received: ' + JSON.stringify(parentChildEntityPropertyContainer));

            // delete this child from the parent
            context.commit('deleteNestedCollectionFromParent', parentChildEntityPropertyContainer);
            // commit the parent
            context.dispatch('fcommitEntity', {docId:parentChildEntityPropertyContainer.docId, collectionId:parentChildEntityPropertyContainer.collectionId});
        },

        // add new entity to firebase
        // Receives entityConfigContainer: {entityConfig:{}, <subEntityCollectionId: ''>}
        fcreateEntity(context, entityConfigContainer){
            console.log('fcreateEntity - object received: ' , entityConfigContainer);

            // initialize the variable for meta info
            let newEntityMeta = {}; 

            // set the collection name / collectionId that the new entity is potentially being added to
            let newCollectionId = entityConfigContainer.entityConfig.collectionId;

            // create an entity config object for the new entity
            let newEntityConfig = entityConfigContainer.entityConfig;

            // create meta information for the new entity
            newEntityMeta['CreatedAt'] = firebase.firestore.FieldValue.serverTimestamp();
            newEntityMeta['CreatedAtUid'] = firebase.auth().currentUser.uid;

            // if this is a child entity, 
            if( entityConfigContainer.hasOwnProperty( 'subEntityCollectionId') ){
                //set its information about its parent 
                newEntityMeta.ParentType = entityConfigContainer.entityConfig.collectionId;
                newEntityMeta.ParentCollectionId = entityConfigContainer.entityConfig.docId;                    

                // update the collection name / collectionId for the new subEntity that is intended to be added
                newCollectionId = entityConfigContainer.subEntityCollectionId;

                // update the new entity config to be the child entity
                newEntityConfig = entityConfigContainer.entityConfig.subEntities[newCollectionId];
            }



            // add the new entity to the firestore
            return firebase.firestore().collection(newCollectionId).add(newEntityMeta)
            .then(function(docRef) {    
                console.log('firestore add call complete. new entity has been created. docRef.id: ' + docRef.id);

                // auto populate any date fields that are configured as such
                docRef.get().then(function (documentSnapshot){

                    // create the date from the CreatedAt server populated timestamp
                    let currentDate = documentSnapshot.get('CreatedAt').toDate();
                    let date = currentDate.getDate();
                    let month = currentDate.getMonth(); //Be careful! January is 0 not 1
                    let year = currentDate.getFullYear();
                    let dateString = year + "-" +(month + 1) + "-" + date;

                    // loop over the fields in the entity/form
                    for (let formField of newEntityConfig.formFields){
                        // if there is a date field that is to be auto populated
                        if (formField.fieldAutoFillDate){

                            // auto populate the field with server timestamp
                            let propertiesObject = {};
                            propertiesObject[formField.fieldName] = dateString;

                            // update the entity with the new date info
                            context.dispatch('fcommitRaw', {
                                docId:docRef.id,
                                collectionId: newEntityConfig.collectionId,
                                data:propertiesObject,
                            });
                        }                    
                    }
                })

                // if its a sub-entity, add the child information to the parent
                if(newEntityMeta.hasOwnProperty('ParentCollectionId')){ // the newSubEntityMeta object is a sub entity
                    let NestedCollections = {};  // holds an object of child entities by child entity type property
                    NestedCollections[newCollectionId] = {};
                    NestedCollections[newCollectionId][docRef.id] = 1;  // set the docId as a property of the collectionId object
                    context.dispatch('updateCurrentEntity', {
                        docId:newEntityMeta.ParentCollectionId,
                        collectionId: newEntityMeta.ParentType,
                        propertiesObject:{
                            NestedCollections:NestedCollections,
                        }
                    });
                }
                // It is not needed to load the new entity as it will get loaded either
                // 1) As part of recursive getEntity listener upon update to the parent
                // 2) If its the parent, it will get reloaded as a new entity on ClientContainer property watcher for the root entity ID
                return docRef.id;
            })
            .catch(function(error) {
                console.error("Error writing document: ", error);
            });  

        },
        // Commit raw data fields to firebase
        // Receives dataContainer: { docId:'', collectionId:'', data:{} }
        fcommitRaw(context, dataContainer){
            // NOTE: This function currently does not update the last modification time
            console.log('fcommitRaw ovject received: ', dataContainer);

            // Update the entity in the database/Firestore
            firebase.firestore().collection(dataContainer.collectionId).doc(dataContainer.docId).update(dataContainer.data)
            .then(function() {
                console.log("Document successfully written!");
            })
            .catch(function(error) {
                console.error("Error writing document: ", error);
            });  
        },
        // Commit changes to firebase
        // Receives collectionContainer: {docId:'', collectionId:''}
        fcommitEntity(context, collectionContainer){
            console.log('fcommitEntity object received: ' + JSON.stringify(collectionContainer));

            // update if the entity still exists
            // - it's possible the entity has been deleted at the server or by another real-time client
            if( (((context.state.currentEntity||{})[collectionContainer.collectionId]||{})[collectionContainer.docId]||{}).hasOwnProperty('data') ){
                let entityToCommit = context.state.currentEntity[collectionContainer.collectionId][collectionContainer.docId];

                // Update the entity in the database/Firestore
                firebase.firestore().collection(collectionContainer.collectionId).doc(entityToCommit.id).update(entityToCommit.data)
                .then(function() {
                    console.log("Document successfully written!");
                })
                .catch(function(error) {
                    console.error("Error writing document: ", error);
                });    

                // if the entity has a parent - update the parent's modification time (because an update to a child entity is an update to a parent entity)
                if(  entityToCommit.data.hasOwnProperty('ParentCollectionId') &&  entityToCommit.data.hasOwnProperty('ParentType')  ){
                    console.log("This entity has a parent.  Updating the parent's modification time by sending empty mutateCurrentEntity commit to the parent.");
                    let entityContainer = {docId: entityToCommit.data.ParentCollectionId, collectionId: entityToCommit.data.ParentType};
                    context.commit('mutateCurrentEntity',  entityContainer);
                    context.dispatch('fcommitEntity',  entityContainer);
                }
            }
            // the entity no longer exists
            else{
                console.log('fcommitEntity - entity no longer exists.  object passed: ' + JSON.stringify(collectionContainer));
            }
        },
        // Delete Entity / Firebase Document
        // Receives collectionContainer: {docId:'', collectionId:''[, route:{to:'', type:'<replace>'}, nestedDelete:true]}
        fdeleteEntity(context, collectionContainer){
            console.log('delete Entity - object received: ' + JSON.stringify(collectionContainer))

            // Find and call recursively to Delete Nested Collections
            let NestedCollections =  ((((context.state.currentEntity[collectionContainer.collectionId]||{})[collectionContainer.docId])||{}).data||{}).NestedCollections;  // NestedCollections exists || undefined
            if(  NestedCollections  ){ 
                for (let collectionId in NestedCollections) {
                    if ( NestedCollections.hasOwnProperty(collectionId) && typeof NestedCollections[collectionId] === 'object' ) { // sanity check
                        for(let docId in NestedCollections[collectionId]){
                            // Delete this nested collection entity
                            context.dispatch('fdeleteEntity', {docId:docId, collectionId:collectionId, nestedDelete:true});
                        }                        
                    }
                }
            }

            // If flow is within a recursive delete, the parent doesn't need to be updated as the parent will get deleted anyway
            // - Allowing the parent to get updated causes race condition with Cloud Function updates to Algolia that is adding parent back after its deleted because of the change from the child entity. 
            if(collectionContainer.nestedDelete != true){
                // If this is a child entity of another entity - remove its reference from its parent
                if(     
                    ((((context.state.currentEntity||{})[collectionContainer.collectionId]||{})[collectionContainer.docId]||{}).data||{}).hasOwnProperty('ParentCollectionId') &&
                    ((((context.state.currentEntity||{})[collectionContainer.collectionId]||{})[collectionContainer.docId]||{}).data||{}).hasOwnProperty('ParentType')
                ){
                    let parentDocId = context.state.currentEntity[collectionContainer.collectionId][collectionContainer.docId].data.ParentCollectionId;
                    let parentCollectionId = context.state.currentEntity[collectionContainer.collectionId][collectionContainer.docId].data.ParentType;
                    console.log('sending dispatch to remove child from parent NestedCollections array.');
                    context.dispatch('removeNestedCollectionFromParent', {docId:parentDocId, collectionId:parentCollectionId, childDocId:collectionContainer.docId, childCollectionId:collectionContainer.collectionId})
                }
            }

            // Delete Entity from currentEntity
            context.commit('deleteEntityFromCurrentEntity', {docId:collectionContainer.docId, collectionId:collectionContainer.collectionId});

            // Delete listener from currentListeners
            context.commit('deleteEntityFromEntityListeners', {docId:collectionContainer.docId, collectionId:collectionContainer.collectionId});

            // Delete the Entity in the store
            // NOTE: it seems to be ok to delete a document that does not exist (called by firebase listner when receiving notice of a deleted entity - all the other actions within this function needs to happen locally)
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

        getRootEntityRecent(context, searchParams){
            console.log('getRootEntityRecent');
            console.log(context.state.fsearchEntities);

            // initialize listener holder if not already initialized
            if(!context.state.fsearchListeners) context.state.fsearchListeners = {};

            // If we've already got a listener for this queryId, execute it to remove it
            if(typeof context.state.fsearchListeners[searchParams.queryId] == 'function'){
                context.state.fsearchListeners[searchParams.queryId]();
            }

            // Start the query
            let baseQuery = firebase.firestore().collection(searchParams.collectionId);

            // Set "orderBy, if defined
            if(searchParams.orderBy){
                for (let orderByObj of searchParams.orderBy){
                    // if the call is to paginate backward
                    if(searchParams.paginateDirection == 'backward'){
                        // reverse the query from the configured orderBy (trick to query backward)
                        baseQuery = baseQuery.orderBy(orderByObj.fieldPath, orderByObj.directionStr=='desc'?'asc':'desc');   // reverse the ordering                 
                    }
                    else{
                        // the call is to paginate forward or its an initial call (no tricks - just set the orderBy according to the configuration)
                        baseQuery = baseQuery.orderBy(orderByObj.fieldPath, orderByObj.directionStr=='desc'?'desc':'asc');
                    }
                }
            }
            // Set "where", if defined
            // Expects and array of "where" objects
            if(searchParams.where){
                for (let whereObj of searchParams.where){
                    baseQuery = baseQuery.where(whereObj.fieldName, whereObj.testOperator, whereObj.testVal);
                }
            }

            // If the call is to paginate in the forward direction 
            if(searchParams.paginateDirection == 'forward'){
                // Get the query cursor that was saved as the marker for the forward search starting point
                //  then set the query to start after that cursor point
                let lastRootEntity = context.state.fsearchEntities[searchParams.queryId].pageForwardDoc;
                baseQuery = baseQuery.startAfter(lastRootEntity);
            }

            // If the call is to paginate in the backward direction
            if(searchParams.paginateDirection == 'backward'){
                // Get the query cursor that was saved as the marker for the backward search starting point 
                //  then set the query to start after that cursor point (the query has been reversed in the where clause)
                let lastRootEntity = context.state.fsearchEntities[searchParams.queryId].pageBackwardDoc;
                baseQuery = baseQuery.startAfter(lastRootEntity);
            }

            // Set "limit", if defined, otherwise default to 10
            let limit=10;
            if(typeof searchParams.limit == 'number' && searchParams.limit > 0){
                limit = searchParams.limit;
            }
            baseQuery = baseQuery.limit(limit + 1);

            let randomTrack = Math.floor(Math.random() * 1000); 
            
            // Run the query and save to a listener and store the listener removal/cancel function 
            // TODO:  need to handle the case where, at the end of all pagination forward/backard (next/prev is disabled) and all the displayed entities are deleted.  onSnapshot will return an empty array - errors will ensue
            context.state.fsearchListeners[searchParams.queryId] = baseQuery.onSnapshot({includeMetadataChanges:true}, function(querySnapshot){
                console.log('randomTrack', randomTrack);
                console.log(querySnapshot);
                console.log(querySnapshot.docChanges());
                // if not connected, the promise still apparently resolves (hence this .then is called) but the query is empty 
                // however it the database is empty, it also returns an empty querySnapshot.
                // TODO:  verify the issue and figure out how to tell the difference
                // TODO - verify .empty is a documented property - found it when viewing the querySnapshot object via console.log; documentations shows to use isEmpty() function, but doing so returns an error that its an invalid function
                //if(!querySnapshot.empty){  

                // skip any cached results as other listeners with similar query will interfere and give "weird" flashing/temporary results
                if (querySnapshot.metadata.fromCache == false){
                    // Set up the results by retrieving each data from each resultant document
                    //  each result is put in an object with properties "id" & "data"
                    //  each object is then added to a parent array to preserve the search result order
                    let queryResultDocsFound = [];
                    querySnapshot.forEach(function(doc){ // doc = QueryDocumentSnapshot
                        let resultObj = {};
                        resultObj.data = doc.data(); 
                        resultObj.docId = doc.id;

                        // Set the entity's display based on config displayFunction
                        if( searchParams.hasOwnProperty('displayFunction')  ) {
                            // evaluate the display function
                            try {
                                let entityFormFields = resultObj.data;
                                resultObj.data.ListDisplayText = eval(searchParams.displayFunction);
                            }
                            catch(err) {
                                alert('There was an error evaluating the list display text in an EntitySearch result for query id: ' + searchParams.queryId);
                                alert(err);
                            }
                        }
                
                        queryResultDocsFound.push(resultObj); // {data: <doc data>, id: <docId>}
                    });

                    // Store query cursors for forward pagination
                    let pageBackwardDoc = querySnapshot.docs[0];
                    let pageForwardDoc = querySnapshot.docs[querySnapshot.docs.length-2];  // since an extra entity was added to the search limit, pagination should come from the actual limit point


                    // Start off with Prev/Next Buttons enabled
                    let disablePrevButton = false;
                    let disableNextButton = false;

                    // If not paginating, its an initial search - disable the previous button
                    if(!searchParams.hasOwnProperty('paginateDirection')) disablePrevButton = true; 

                    // Check results to see if there's enough results for another page  
                    if(querySnapshot.docs.length == limit + 1 ){
                        // The full result set exists AND there is another page
                        //  Remove the last result from the display as its more than the requested limit, so it shouldn't be shown
                        queryResultDocsFound.pop();
                        //  If paginating, set the associated button to be clickable based on the direction of the search
                        if(searchParams.paginateDirection == 'backward') disablePrevButton = false; // enable previous button
                        else if(searchParams.paginateDirection == 'forward') disableNextButton = false; // enable next button
                    }
                    else{
                        // There weren't enough results to paginate in the direction of the search
                        if(searchParams.paginateDirection == 'backward') disablePrevButton = true; // disable previous button
                        else if(searchParams.paginateDirection == 'forward') disableNextButton = true; // disable next button
                        // If not paginating, its an initial search - disable the next button
                        else if(!searchParams.hasOwnProperty('paginateDirection')) disableNextButton = true; 

                        // not enough results, so set the page forward reference to the last entity found - NOTE:  this may not need to be done as the user can't page foward in this state anyway
                        pageForwardDoc = querySnapshot.docs[querySnapshot.docs.length-1]; 
                    }

                    
                    // Things are backwards for the reverse direction - modify the results to coincide with a forward search from a page-backwards point of view
                    if(searchParams.paginateDirection == 'backward'){
                        queryResultDocsFound = queryResultDocsFound.reverse();  // reverse the order of the returned documents
                        let pageForwardTemp = pageForwardDoc;
                        pageForwardDoc = pageBackwardDoc // the first doc is acually the last doc in the set of a foward search
                        pageBackwardDoc = pageForwardTemp; // the last doc is actually the first doc in the set of a forward search
                    }

                    // set up the parameters to be commited to storage
                    let searchObj= {
                        queryId: searchParams.queryId,
                        results: queryResultDocsFound,
                        pageBackwardDoc:pageBackwardDoc,
                        pageForwardDoc:pageForwardDoc,
                        disablePrevButton:disablePrevButton,
                        disableNextButton:disableNextButton,

                    }
                    context.commit('setSearchEntity', searchObj)
                    context.commit('setLoadingIndicator', false);
                }
                // }
                // else{
                //     // TODO: need better error handling
                //     alert('Unable to retrive Root Entity List.  Possibly you are having internet connection problems.');
                // }
            });
            // .then()
            // .catch(function(error) {
            //     console.error("Error retrieving collection: ", error);
            // });
        },
    }
})