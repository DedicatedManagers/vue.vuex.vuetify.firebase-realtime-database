<template>
    <v-menu ref="BirthDateMenuRef" :return-value.sync="localModel" v-model="BirthDateMenuVisibility" :close-on-content-click="false" :nudge-right="40" lazy transition="scale-transition" offset-y full-width min-width="290px">
    <v-text-field slot="activator" v-model="localModel" :rules="computedRules" :label="fieldLabel" append-icon="event" readonly ></v-text-field>
    <v-date-picker v-model="localModel" @input="$refs.BirthDateMenuRef.save(localModel);"></v-date-picker>
    </v-menu>
</template>


<script>

export default {
  name: 'DateField',
  props:['fieldName', 'fieldLabel', 'rules', 'collectionId', 'docId'],
  data() {
    return {
      BirthDateMenuVisibility:false,
    };
  },
  computed:{
    // turn the array of rules from strings into code
    // TODO: turn this into MIXIN?
    computedRules: function(){
      let rulesArray = [];
      if(this.rules){
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