<template>
<v-card class="customListExpandable">
    <v-toolbar color="blue" dark  @click="listVisibility=!listVisibility">
    <v-toolbar-title>{{entityConfig.subEntities[subEntityIndex].toolbarTitle}}</v-toolbar-title><v-spacer></v-spacer><v-btn v-if="ammendedCollection" icon><v-icon >{{listVisibility?'expand_less':'expand_more'}}</v-icon></v-btn>
    </v-toolbar>
    <v-layout row wrap>
        <v-flex xs12>
        <v-list v-if="ammendedCollection" subheader>
            <v-list-group v-model="listVisibility">
            <v-list-tile  :to="entityConfig.entityUrl + '/' + entityConfig.subEntities[subEntityIndex].entityType + '/' + entityListCollectionId" v-for="(ammendedEntity, entityListCollectionId) in ammendedCollection" :key="entityListCollectionId">
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
            if(  !(this.$store.state.currentEntity||{}).hasOwnProperty(this.entityConfig.subEntities[this.subEntityIndex].entityType) )  return null;

            // Need to ammend the Entity to Let SubEntityList component know what to display for each entity when rendered as a list item (as the variables can change between entity types) 
            let ammendedCurrentEntity = {};
            for (let entityId in this.$store.state.currentEntity[this.entityConfig.subEntities[this.subEntityIndex].entityType]){
                // Check that the parent of the entity being checked matches the parent sent in - necessary for nested entities?  Could just be sanity check
                if(this.$store.state.currentEntity[this.entityConfig.subEntities[this.subEntityIndex].entityType][entityId].data.ParentCollectionId == this.entityConfig.docId){  // sanity check?  This may not be necessary
                    // only including entities that have the same individual parent
                    ammendedCurrentEntity[entityId]=this.$store.state.currentEntity[this.entityConfig.subEntities[this.subEntityIndex].entityType][entityId]; 
                    
                    // Create the ListDisplayText based on Entity Type
                    // Some entity types also filter out other entities in the same type that don't have the same parent
                    if(this.entityConfig.subEntities[this.subEntityIndex].entityType=='KinshipChild' || this.entityConfig.subEntities[this.subEntityIndex].entityType=="OtherInHousehold"){
                        ammendedCurrentEntity[entityId]['ListDisplayText'] =
                            // Create the format of what do display when this entity is rendered as a list item
                            (this.$store.state.currentEntity[this.entityConfig.subEntities[this.subEntityIndex].entityType][entityId].data.LastName||"") + ", " +
                            (this.$store.state.currentEntity[this.entityConfig.subEntities[this.subEntityIndex].entityType][entityId].data.FirstName||"") + " " +
                            (this.$store.state.currentEntity[this.entityConfig.subEntities[this.subEntityIndex].entityType][entityId].data.MiddleName||"");    
                    }
                    else if(this.entityConfig.subEntities[this.subEntityIndex].entityType=='OtherInHouseholdIncome' || this.entityConfig.subEntities[this.subEntityIndex].entityType=="PrimaryKinshipCaregiverIncome" || this.entityConfig.subEntities[this.subEntityIndex].entityType=='KinshipChildIncome'){
                            ammendedCurrentEntity[entityId]['ListDisplayText'] =
                                // Create the format of what do display when this entity is rendered as a list item
                                (this.$store.state.currentEntity[this.entityConfig.subEntities[this.subEntityIndex].entityType][entityId].data.IncomeType||"") + " - $" +
                                (this.$store.state.currentEntity[this.entityConfig.subEntities[this.subEntityIndex].entityType][entityId].data.IncomeAmount||"");    
                    }
                    else if(this.entityConfig.subEntities[this.subEntityIndex].entityType=='KinshipChildCustodyStatus'){
                        ammendedCurrentEntity[entityId]['ListDisplayText'] =
                            // Create the format of what do display when this entity is rendered as a list item
                            (this.$store.state.currentEntity[this.entityConfig.subEntities[this.subEntityIndex].entityType][entityId].data.CustodyDate||"") + " - " +
                            (this.$store.state.currentEntity[this.entityConfig.subEntities[this.subEntityIndex].entityType][entityId].data.CustodyStatus||"");
                    }
                    else if(this.entityConfig.subEntities[this.subEntityIndex].entityType=='PrimaryKinshipCaregiverContact'){
                        ammendedCurrentEntity[entityId]['ListDisplayText'] =
                            // Create the format of what do display when this entity is rendered as a list item
                            (this.$store.state.currentEntity[this.entityConfig.subEntities[this.subEntityIndex].entityType][entityId].data.ContactDate||"") + " - " +
                            (this.$store.state.currentEntity[this.entityConfig.subEntities[this.subEntityIndex].entityType][entityId].data.ContactType||"");
                    }
                    else if(this.entityConfig.subEntities[this.subEntityIndex].entityType=='FamilyAdvocacyCasePlan'){
                        ammendedCurrentEntity[entityId]['ListDisplayText'] =
                            // Create the format of what do display when this entity is rendered as a list item
                            'Case Plan Needed: ' + (this.$store.state.currentEntity[this.entityConfig.subEntities[this.subEntityIndex].entityType][entityId].data.CommunityConnectionNeeded?'Yes':'No');
                    }
                    else if(this.entityConfig.subEntities[this.subEntityIndex].entityType=='FamilyAdvocacyGuardianship'){
                        ammendedCurrentEntity[entityId]['ListDisplayText'] =
                            // Create the format of what do display when this entity is rendered as a list item
                            'Guardianship Type: ' + (this.$store.state.currentEntity[this.entityConfig.subEntities[this.subEntityIndex].entityType][entityId].data.GuardianshipType);
                    }
                    else{
                            // The entity type has not been defined.  Need to define the entity above.
                            ammendedCurrentEntity[entityId]['ListDisplayText'] ='Error #INOS2833';
                    }
            }
            }
            return ammendedCurrentEntity;
        }
  },
  methods:{
    addEntity(){
        this.$store.dispatch('fcreateEntity', {docId:'add', collectionId:this.entityConfig.subEntities[this.subEntityIndex].entityType, parentCollectionId:this.entityConfig.docId, parentCollectionType:this.entityConfig.collectionId}).then(createdDocId=>{
            console.log( 'addEntity received: ' + createdDocId  );
            this.$router.push(this.entityConfig.entityUrl + '/' + this.entityConfig.subEntities[this.subEntityIndex].entityType + '/' + createdDocId);
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
