<template>
  <div>
    <v-slide-y-transition mode="out-in">
      <v-container fluid>
          <v-layout row wrap>
            <v-flex xs12>

              <v-breadcrumbs style="padding:0px; margin-left:12px;" large divider="/">
                <v-breadcrumbs-item ripple exact exact-active-class v-for="(navBreadCrumb, id) in navBreadCrumbs" :key="id" :disabled="false" :to="navBreadCrumb.link">
                  {{ navBreadCrumb.text }}
                </v-breadcrumbs-item>
              </v-breadcrumbs>
          
              <template v-if="this.$store.state.currentEntity">
                <layout-template :entityConfig="entityConfig" ></layout-template>
              </template>
    
            </v-flex>
          </v-layout> 
      </v-container>
    </v-slide-y-transition>
  </div>
</template>

<script>
import Template from '@/components/shared/Templates/Column-Two';
import {RootEntity} from '@/../config/Entities/RootEntity.js';

export default {
  name: 'TemplateLoader',
  props:['DbPath'],
  components:{
    'layout-template':Template,
  },
  data() {
    return {
    };
  },
  watch:{
    // watch for route changes to the root entity, as we will need to reload the Entity
    // -- This happens when on an entity and a search in the toolbar is clicked.
    rootEntityDocId:function(){
      this.initializeEntity();
    }
  },
  methods:{
    initializeEntity(){
      console.log('initializeEntity in TemplateLoader.vue');
      // if we have already loaded the root level Entity (highest parent of the entities)
      if(this.$store.state.currentEntity){
        if(this.$store.state.currentEntity[this.rootEntityCollectionId]){

          // if we are trying to get a new root level Entity, clear out the currentEntity & entityListeners to start fresh with the new root level entity
          // - its a new entity if the new id (rootEntityDocId) doesn't exist already on the root entity (rootEntityCollectionId)
          if(!this.$store.state.currentEntity[this.rootEntityCollectionId].hasOwnProperty(this.rootEntityDocId)){
              this.$store.commit('deleteAllCurrentEntitesAndListeners');
              this.$store.dispatch('getEntity', {docId:this.rootEntityDocId, collectionId:this.rootEntityCollectionId});
          }
        }
      }
      else{
        // this is a new load of the app - get the info for this root level entity
        console.log('new load');
        this.$store.dispatch('getEntity', {docId:this.rootEntityDocId, collectionId:this.rootEntityCollectionId});      
      }
    }
  },
  computed:{
    // Returns an array holding the collectionIds & docIds of the matched route
    // ie   [ {collectionId: 'RootEntity', docId:'xxxxxx'}, {collectionId: 'NestedEntity', docId:'xxxxxx'}, {collectionId: 'NestedEntity2', docId:'xxxxxx'}      ]
    entityPointers:function(){
        let Entities = [];
        function findEntity(urlString){
            let matches = urlString.match(/^(\w+)\/([A-Za-z0-9]{20})(?=\/|$)\/?(.*)/);  // looking for pattern: EntityName/EntityId 
            if(matches){
                Entities.push({collectionId:matches[1], docId:matches[2]});
                findEntity(matches[3]);
            }
        }
        findEntity(this.DbPath);
        if(Entities.length < 1){
          //TODO better way to handle no entity pointers found (ie bad url structure)
          alert('Malformed route!');
        }
        return Entities;
    },
    routedEntityConfig:function(){
      let theConfigEntity = RootEntity;
      for (let i=1; i<this.entityPointers.length; i++){ // skip the root entity
        // if the subEntity exists on the object
        if(  ((theConfigEntity||{}).subEntities||{}).hasOwnProperty([this.entityPointers[i].collectionId])  ){
          // set the outer entity as the nested entity for the next iteration
          theConfigEntity = theConfigEntity.subEntities[this.entityPointers[i].collectionId];
        }
        else{
          return "Entity Config Not Found!"
        }
      }
      return theConfigEntity;
    },
    rootEntityDocId: function(){
      return this.entityPointers[0].docId;
    },
    rootEntityCollectionId: function(){
      return this.entityPointers[0].collectionId;
    },
    parentEntityUrl:function(){
      if (this.entityPointers.length == 1) return "/dashboard"; // only 1 pointer means it the parent entity
      let theUrl = '/db';
      for (let i=0; i<this.entityPointers.length-1; i++){ // loop over all entities except the last, which is the current entity
        theUrl += '/' + this.entityPointers[i].collectionId + '/' + this.entityPointers[i].docId;
      }
      return theUrl;
    },
    entityUrl:function(){
      let theUrl = '/db';
      for (let i=0; i<this.entityPointers.length; i++){ // build the url from the entites pointers in case there's extra garbage at the end (ie someone copies malfomed link /RootEntity/xxxxx/NestedEntity/xxxxx/garbage - which still works)
        theUrl += '/' + this.entityPointers[i].collectionId + '/' + this.entityPointers[i].docId;
      }
      return theUrl;
    },
    docId: function(){
      return this.entityPointers[this.entityPointers.length-1].docId;
    },
    componentCollectionId: function(){
      return this.entityPointers[this.entityPointers.length-1].collectionId;      
    },
    parentCollectionDocId: function(){
      if(this.entityPointers.length>1){
        console.log(this.entityPointers[this.entityPointers.length-2].docId);
        return this.entityPointers[this.entityPointers.length-2].docId;
      }
    },
    entityConfig: function(){
      return {
        ...this.routedEntityConfig,
        docId:this.docId,
        entityUrl: this.entityUrl,
        parentEntityUrl: this.parentEntityUrl,
      }
    },

    navBreadCrumbs: function (){
      let crumbs = [];
      crumbs.push({
          link:'/dashboard',
          text:'Dashboard',
      });

      // Make a copy of the entity configuration to manipulate 
      let theConfigEntity = RootEntity;
      let theLink = "/db";
      for (let i=0; i<this.entityPointers.length; i++){ 
        // if the url subEntity type exists on the configuration object
        if(  (theConfigEntity||{}).collectionId == this.entityPointers[i].collectionId  ){

          // if the entity has asynchronously loaded
          if( (((this.$store.state.currentEntity||{})[this.entityPointers[i].collectionId]||{})[this.entityPointers[i].docId]||{}).hasOwnProperty('data')   ) {
            // set up variables to be used by evalFunctions.breadCrumb
            let entityFormFields = this.$store.state.currentEntity[this.entityPointers[i].collectionId][this.entityPointers[i].docId].data;
            let entityId = this.$store.state.currentEntity[this.entityPointers[i].collectionId][this.entityPointers[i].docId].id;

            // set default text
            let linkText = theConfigEntity.title;

            // if a evalFunctions.breadCrumb is defined
            if(  ((theConfigEntity||{}).evalFunctions||{}).hasOwnProperty('breadCrumb')  ){
              // evaluate the evalFunctions.breadCrumb
              try {
                linkText = eval(theConfigEntity.evalFunctions.breadCrumb);
              }
              catch(err) {
                  alert('There was an error evaluating the breadCrumb for entity: ' + this.entityPointers[i].collectionId);
              }
            }

            theLink += "/" + this.entityPointers[i].collectionId + "/" + this.entityPointers[i].docId;
            crumbs.push({
                link:theLink,
                text:linkText,
            });
          }
          // if there is another nested entity in the url
          if(i+1 < this.entityPointers.length){
            // if there is nested entity of the same type as the next url entity type
            if(  theConfigEntity.subEntities.hasOwnProperty(this.entityPointers[i+1].collectionId)  ){
              // set the outer entity as the nested entity for the next iteration
              theConfigEntity = theConfigEntity.subEntities[this.entityPointers[i+1].collectionId];    
            }
          }
        }
      }
      return crumbs;
    },
  },
  created(){
    this.$store.commit('setLoadingIndicator', true);
    console.log('created function in TemplateLoader.vue');
    this.initializeEntity();
  },
};
</script>
 
<style>

.customListExpandable .v-toolbar{
  cursor:pointer;
}
.customListExpandable .v-list__group__header{
  display: none
}
</style>