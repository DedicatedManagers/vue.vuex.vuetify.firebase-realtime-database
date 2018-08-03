<template>
    <v-text-field  v-model="localModel" :label="fieldLabel" :rules="rules"></v-text-field>
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