<template>
<v-card class="customListExpandable" v-if="!this.$store.state.loadingIndicator">
    <v-toolbar color="blue" dark  @click="listVisibility=!listVisibility">
    <v-toolbar-title>{{entityConfig.subEntities[subEntityIndex].toolbarTitle}}</v-toolbar-title><v-spacer></v-spacer><v-btn v-if="ammendedCollection" icon><v-icon >{{listVisibility?'expand_less':'expand_more'}}</v-icon></v-btn>
    </v-toolbar>
    <v-layout row wrap>
        <v-flex xs12>
        <v-list v-if="ammendedCollection" subheader>
            <v-list-group v-model="listVisibility">
            <v-list-tile  :to="entityConfig.entityUrl + '/' + entityConfig.subEntities[subEntityIndex].collectionId + '/' + entityListCollectionId" v-for="(ammendedEntity, entityListCollectionId) in ammendedCollection" :key="entityListCollectionId">
                <v-list-tile-action>
                <v-icon>{{entityConfig.subEntities[subEntityIndex].icon}}</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                <v-list-tile-title>{{ammendedEntity.ListDisplayText}}</v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
            </v-list-group>
            <v-list-group :value="!listVisibility">
            <v-list-tile @click="listVisibility=!listVisibility">
                <v-list-tile-action>
                <v-icon>{{entityConfig.subEntities[subEntityIndex].icon}}</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                <v-list-tile-title>{{Object.keys(ammendedCollection).length}} Hidden (click to show)</v-list-tile-title>
                </v-list-tile-content>                            
            </v-list-tile>
            </v-list-group>
        </v-list>
        <div class="text-xs-right">
            <v-btn color="warning" @click="addEntity">{{entityConfig.subEntities[subEntityIndex].addButtonText}}<v-icon right>{{entityConfig.subEntities[subEntityIndex].addIcon}}</v-icon></v-btn>
        </div>
        </v-flex>
    </v-layout>
</v-card>              

</template>


<script>
export default {
  name: 'SubEntityList',
  props:['entityConfig', 'subEntityIndex'],
  data() {
    return {
        listVisibility:true,
    };
  },
  computed:{
        ammendedCollection: function(){
            if(  !(this.$store.state.currentEntity||{}).hasOwnProperty(this.entityConfig.subEntities[this.subEntityIndex].collectionId) )  return null;

            // Need to ammend the Entity to Let SubEntityList component know what to display for each entity when rendered as a list item (as the variables can change between entity types) 
            let ammendedCurrentEntity = {};
            for (let entityId in this.$store.state.currentEntity[this.entityConfig.subEntities[this.subEntityIndex].collectionId]){
                // check that the data & ParentCollectionId properties exist on the entity - may just be a sanity check
                if(  ((this.$store.state.currentEntity[this.entityConfig.subEntities[this.subEntityIndex].collectionId][entityId]||{}).data||{}).hasOwnProperty('ParentCollectionId')  ){
                    // Check that the parent of the entity being checked matches the parent sent in - necessary for nested entities?  Could just be sanity check
                    if(this.$store.state.currentEntity[this.entityConfig.subEntities[this.subEntityIndex].collectionId][entityId].data.ParentCollectionId == this.entityConfig.docId){  // sanity check?  This may not be necessary
                        // only including entities that have the same individual parent
                        ammendedCurrentEntity[entityId]=this.$store.state.currentEntity[this.entityConfig.subEntities[this.subEntityIndex].collectionId][entityId]; 
                        
                        // set default text
                        let listDisplayText = this.entityConfig.subEntities[this.subEntityIndex].title;

                        // if a evalFunctions.breadCrumb is defined
                        if(  (this.entityConfig.subEntities[this.subEntityIndex].evalFunctions||{}).hasOwnProperty('subEntityListDisplayText')  ){
                            // evaluate the evalFunctions.breadCrumb
                            try {
                                let entityFormFields = this.$store.state.currentEntity[this.entityConfig.subEntities[this.subEntityIndex].collectionId][entityId].data;
                                listDisplayText = eval(this.entityConfig.subEntities[this.subEntityIndex].evalFunctions.subEntityListDisplayText);
                            }
                            catch(err) {
                                alert('There was an error evaluating the list display text in an enttiy in the sub entity list for entity type: ' + this.subEntityIndex);
                                alert(err);
                            }
                        }
                        // set the computed text on the ammended entity
                        ammendedCurrentEntity[entityId]['ListDisplayText'] = listDisplayText;
                    }
                }
            }

            return ammendedCurrentEntity;
        }
  },
  methods:{
    addEntity(){
        this.$store.commit('setLoadingIndicator', true);
        this.$store.dispatch('fcreateEntity', {docId:'add', collectionId:this.entityConfig.subEntities[this.subEntityIndex].collectionId, parentCollectionId:this.entityConfig.docId, parentCollectionType:this.entityConfig.collectionId}).then(createdDocId=>{
            console.log( 'addEntity received: ' + createdDocId  );
            if(createdDocId){
                this.$router.push(this.entityConfig.entityUrl + '/' + this.entityConfig.subEntities[this.subEntityIndex].collectionId + '/' + createdDocId);
            }
            else{
                // TODO: need better action for failure
                alert('Failed to create new child entity.  You may have lost the connection to the server.  Try reloading the application.');
            }
        });
    },
    created(){
        console.log('SubEntityList.vue created function. Props: ' + JSON.stringify(this.$options.propsData));
    },
  },
}
</script>


<style>
</style>
