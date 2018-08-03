<template>
    <v-text-field  v-model="localModel" :label="fieldLabel" :rules="rules"></v-text-field>
</template>


<script>

export default {
  name: 'TextField',
  props:['fieldName', 'fieldLabel', 'rules', 'componentCollectionId', 'docId'],
  data() {
    return {
    };
  },
  computed:{
    localModel:{
      get(){
        return this.$store.getters.getCurrentEntityFieldValue({docId:this.docId,collectionId:this.componentCollectionId,fieldName:this.fieldName,});
      },
      set(newValue){
        this.$store.dispatch('updateCurrentEntity', {docId:this.docId, collectionId:this.componentCollectionId, propertiesObject:{[this.fieldName]: newValue}});
      },
    },
  },
  methods:{
  },
}
</script>

<style>
</style>