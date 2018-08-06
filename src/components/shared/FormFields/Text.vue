<template>
    <v-text-field  v-model="localModel" :label="fieldLabel" :rules="computedRules"></v-text-field>
</template>


<script>

export default {
  name: 'TextField',
  props:['fieldName', 'fieldLabel', 'rules', 'collectionId', 'docId'],
  data() {
    return {
    };
  },
  computed:{
    // turn the array of rules from strings into code
    computedRules: function(){
      let rulesArray = [];
      for(let i=0; i<this.rules.length; i++){

        try {
          rulesArray.push(  eval(this.rules[i])  );
        }
        catch(err) {
            // TODO: better error handling needed
            alert('There was an error evaluating a rule for the field : ' + this.fieldName);
            alert(err);
        }

      }
      return rulesArray;
    },
    localModel:{
      get(){
        return this.$store.getters.getCurrentEntityFieldValue({docId:this.docId,collectionId:this.collectionId,fieldName:this.fieldName,});
      },
      set(newValue){
        this.$store.dispatch('updateCurrentEntity', {docId:this.docId, collectionId:this.collectionId, propertiesObject:{[this.fieldName]: newValue}});
      },
    },
  },
  methods:{
  },
}
</script>

<style>
</style>