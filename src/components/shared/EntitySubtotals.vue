<template>
  <div>
   {{entitySubtotals}}
  </div>
</template>

<script>

export default {
  name: 'EntitySubtotals',
  props:['entityConfig'],
  components:{
  },
  data() {
    return {
        calculatedEntitySubtotals:{},
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
                        
                        if(  !(  (this.$store.state.currentEntity||{})[parentEntityConfig.collectionId])  ) return false; 

                        let loopCurrentEntities = this.$store.state.currentEntity[parentEntityConfig.collectionId];
                        for (let loopCurrentEntity in loopCurrentEntities){
                            if (!this.calculatedEntitySubtotals[subTotalName]) this.calculatedEntitySubtotals[subTotalName] = 0;
                            this.calculatedEntitySubtotals[subTotalName] += Number(loopCurrentEntities[loopCurrentEntity].data[formFieldName]);
                            console.log('adding formField', formFieldName, loopCurrentEntities[loopCurrentEntity].data[formFieldName]);
                        }
                        
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
            this.calculatedEntitySubtotals = {};

            // Check if there are any SubTotal calculations to display
            if (  !this.entityConfig.hasOwnProperty('subTotals')  ) return false;
            
            // Loop over the SubTotals to display and calculate their totals
            for (let subTotalName in this.entityConfig.subTotals){

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