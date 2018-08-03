<template>
    <v-select v-model="localModel" :items="items" :label="fieldLabel"></v-select>
</template>


<script>

export default {
  name: 'SelectField',
  props:['fieldName', 'fieldLabel', 'items', 'collectionId', 'docId'],
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