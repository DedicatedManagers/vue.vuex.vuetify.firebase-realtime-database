<template>
    <v-checkbox v-model="localModel" :label="fieldLabel"></v-checkbox>
</template>


<script>

export default {
  name: 'CheckboxField',
  props:['fieldName', 'fieldLabel', 'collectionId', 'docId'],
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