<template>
    <v-select v-model="localModel" :items="items" :label="fieldLabel"></v-select>
</template>


<script>

export default {
  name: 'SelectField',
  props:['fieldName', 'fieldLabel', 'items', 'componentCollectionId', 'docId'],
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