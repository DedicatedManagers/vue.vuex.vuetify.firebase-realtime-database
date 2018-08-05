<template>
  <div>
    <template v-if="!this.$store.state.currentEntity">
      <div class="centeredOnScreen" text-xs-center>
        <v-progress-circular :size="250" :width="30" indeterminate color="blue"></v-progress-circular>
        <h1>LOADING DATA</h1>
      </div>
    </template>
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
  name: 'TemplateContainer',
  props:['DbPath'],
  components:{
    'layout-template':Template,
  },
  data() {
    return {
    };
  },
  watch:{
     rootEntityCollectionId: function(){
      this.initializeEntity();
    }
  },
  methods:{
    initializeEntity(){
      console.log('initializeEntity in test.vue');
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
        return Entities;

        //TODO handle no entity pointers found (ie bad url structure)
    },
    routedEntityConfig:function(){
      let theEntity = RootEntity;
      for (let i=1; i<this.entityPointers.length; i++){ // skip the root entity
        // if the subEntity exists on the object
        if(  ((theEntity||{}).subEntities||{}).hasOwnProperty([this.entityPointers[i].collectionId])  ){
          // set the outer entity as the nested entity for the next iteration
          theEntity = theEntity.subEntities[this.entityPointers[i].collectionId];
        }
        else{
          return "Entity Config Not Found!"
        }
      }
      return theEntity;
    },
    rootEntityDocId: function(){
      return this.entityPointers[0].docId;
    },
    rootEntityCollectionId: function(){
      return this.entityPointers[0].collectionId;
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
        collectionId:this.componentCollectionId,
        docId:this.docId,
        baseUrl: '/db/' + this.DbPath,
      }
    },




      navBreadCrumbs: function (){
        let crumbs = [];
        crumbs.push({
            link:'/dashboard',
            text:'Dashboard',
        });
        crumbs.push({
            link:'/dashboard',
            text:'NEED TO FIGURE OUT BREADCRUMBS',
        });

        let rootEntityData = (((this.$store.state.currentEntity||{})[this.rootEntityCollectionId]||{})[this.rootEntityDocId]||{}).hasOwnProperty('data');
        console.log(rootEntityData);
        if( (((this.$store.state.currentEntity||{})[this.rootEntityCollectionId]||{})[this.rootEntityDocId]||{}).hasOwnProperty('data')   ) {
          let entityFields = this.$store.state.currentEntity[this.rootEntityCollectionId][this.rootEntityDocId].data;
          console.log(entityFields);
          let breadCrumbFunction = RootEntity.breadCrumbFunction;
          let text = eval(breadCrumbFunction);
          console.log(text);
          crumbs.push({
              link:'/dashboard',
              text:text,
          });
        }

        return crumbs;
      },
  },
  created(){
    console.log('created function in test.vue');
    this.initializeEntity();
  },
};
</script>
 
<style>

.centeredOnScreen {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transform: -webkit-translate(-50%, -50%);
  transform: -moz-translate(-50%, -50%);
  transform: -ms-translate(-50%, -50%);
}

.customListExpandable .v-toolbar{
  cursor:pointer;
}
.customListExpandable .v-list__group__header{
  display: none
}
</style>