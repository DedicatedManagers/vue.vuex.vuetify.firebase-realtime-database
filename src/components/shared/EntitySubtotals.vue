<template>
<v-card class="customListExpandable" v-if="!this.$store.state.loadingIndicator && entityConfig.subTotals.config">
    <v-toolbar color="blue" dark  @click="listVisibility=!listVisibility">
    <v-toolbar-title>{{entityConfig.subTotals.config.title}}</v-toolbar-title><v-spacer></v-spacer><v-btn v-if="entitySubtotals" icon><v-icon >{{listVisibility?'expand_less':'expand_more'}}</v-icon></v-btn>
    </v-toolbar>
    <v-layout row wrap>
        <v-flex xs12>
        <v-list v-if="entitySubtotals" subheader>
            <v-list-group v-model="listVisibility">
            <v-list-tile  v-for="(entitySubtotal, entitySubtotalName) in entitySubtotals" :key="entitySubtotalName">
                <v-list-tile-action>
                    <v-icon>{{entitySubtotal.icon}}</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                    <v-list-tile-title>{{entitySubtotal.listDisplayText}}{{entitySubtotal.valPrepend}}{{entitySubtotal.val}}{{entitySubtotal.valAppend}}</v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
            </v-list-group>
            <v-list-group :value="!listVisibility">
            <v-list-tile @click="listVisibility=!listVisibility">
                <v-list-tile-action>
                    <v-icon>{{entityConfig.subTotals.config.hiddenItemsIcon}}</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                    <v-list-tile-title>{{Object.keys(entitySubtotals).length}} Hidden (click to show)</v-list-tile-title>
                </v-list-tile-content>                            
            </v-list-tile>
            </v-list-group>
        </v-list>
        </v-flex>
    </v-layout>
</v-card>              

</template>


<script>
import Vue from 'vue';

export default {
  name: 'EntitySubtotals',
  props:['entityConfig'],
  components:{
  },
  data() {
    return {
        listVisibility:true,
    };
  },
  methods:{
        getSubEntityTotal(parentEntityConfig, subTotalName){

            // check for and recursively call any further child entities
            if (parentEntityConfig.subEntities){
                for (let subEntityName in parentEntityConfig.subEntities){

                    // get the subEntityConfig object
                    let subEntityConfig = parentEntityConfig.subEntities[subEntityName];

                    // recursively call this functin for the found subEntity
                    this.getSubEntityTotal(subEntityConfig, subTotalName);  // subEntityConfig will be the parentEntity of the recursive operation
                }
            }

            // Loop over the form fields of the subEntity
            let parentEntityFormFields = parentEntityConfig.formFields;
            for (let formField in parentEntityFormFields){

                // get the parentEntity form field configuration object
                let parentEntityConfigFormField = parentEntityConfig.formFields[formField];

                let formFieldName = parentEntityConfigFormField.fieldName;

                // If a parentEntity form field has a 'subTotals' property
                if (  parentEntityConfigFormField.hasOwnProperty('subTotals')  ){

                    //If the found subTotals property contains this particular subTotal
                    if (parentEntityConfigFormField.subTotals.includes(subTotalName) ){
                        // Get the currentEntity for this config object and add its total
                        
                        if(  !(  this.$store.state.currentEntity||{})[parentEntityConfig.collectionId]  ) return false; 

                        // Get the object that holds all the entities for this entity type 
                        let loopCurrentEntities = this.$store.state.currentEntity[parentEntityConfig.collectionId];
                        
                        // Loop over the entities for this entity type
                        for (let loopCurrentEntity in loopCurrentEntities){
                            // initialize
                            if (!this.calculatedEntitySubtotals) this.calculatedEntitySubtotals = {};
                            if (!this.calculatedEntitySubtotals[subTotalName]) this.calculatedEntitySubtotals[subTotalName] = {};
                            if (!this.calculatedEntitySubtotals[subTotalName].val) this.calculatedEntitySubtotals[subTotalName].val = 0;

                            // perform the subtotal calculation
                            this.calculatedEntitySubtotals[subTotalName].val += parseFloat(loopCurrentEntities[loopCurrentEntity].data[formFieldName].trim());

                            // add the meta information
                            this.calculatedEntitySubtotals[subTotalName].icon = this.entityConfig.subTotals.ids[subTotalName].icon;
                            this.calculatedEntitySubtotals[subTotalName].listDisplayText = this.entityConfig.subTotals.ids[subTotalName].listDisplayText;
                            this.calculatedEntitySubtotals[subTotalName].valPrepend = this.entityConfig.subTotals.ids[subTotalName].valPrepend;
                            this.calculatedEntitySubtotals[subTotalName].valAppend = this.entityConfig.subTotals.ids[subTotalName].valAppend;

                        }
                        
                        // A DIFFERENT WAY OF DOING THE ABOVE USING Vue.set BUT IT DOESN'T APPEAR TO BE NEEDED
                        // for (let loopCurrentEntity in loopCurrentEntities){
                        //     console.log('adding formField', formFieldName, loopCurrentEntities[loopCurrentEntity].data[formFieldName]);
                        //     if (!this.calculatedEntitySubtotals) this.calculatedEntitySubtotals = {};

                        //         if (  !(  this.calculatedEntitySubtotals[subTotalName]||{}).hasOwnProperty('val')  ){
                        //             let subTotalObject = {};
                        //             subTotalObject.val = Number(loopCurrentEntities[loopCurrentEntity].data[formFieldName]);
                        //             subTotalObject.icon  = 'person';
                        //             subTotalObject.listDisplayText = subTotalName;

                        //             Vue.set(this.calculatedEntitySubtotals, subTotalName, subTotalObject);
                        //         }
                        //         else {
                        //             this.calculatedEntitySubtotals[subTotalName].val += Number(loopCurrentEntities[loopCurrentEntity].data[formFieldName]);
                        //         }
                        //     console.log('added formField', formFieldName, loopCurrentEntities[loopCurrentEntity].data[formFieldName]);

                        // }
                        //this.calculatedEntitySubtotals[subTotalName][parentEntityConfigFormField.fieldName];

                        // this.calculatedEntitySubtotals[subTotalName] += subTotalName;
                    }

                }
            }
        
        }
  },
  computed:{
        entitySubtotals: function(){

            // Reset calculated data variable
            this.calculatedEntitySubtotals = null;

            // Check if there are any SubTotal calculations to display
            if (  !this.entityConfig.hasOwnProperty('subTotals')  ) return false;
            
            // Loop over the SubTotals to display and calculate their totals
            for (let subTotalName in this.entityConfig.subTotals.ids){

                // Loop over all the subEntities
                for (let subEntityName in this.entityConfig.subEntities){

                    // Call recrusive function to add up all the underlying fields that are in this subTotal
                    this.getSubEntityTotal(this.entityConfig.subEntities[subEntityName], subTotalName);
                }
                //     
 
            }

            return this.calculatedEntitySubtotals;

        }
  },
  mounted(){
  },
  created(){
  },
};
</script>
 
<style>
</style>