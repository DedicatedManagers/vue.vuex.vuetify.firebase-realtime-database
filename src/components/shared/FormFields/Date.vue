<template>
    <v-menu ref="BirthDateMenuRef" :return-value.sync="localModel" v-model="BirthDateMenuVisibility" :close-on-content-click="false" :nudge-right="40" lazy transition="scale-transition" offset-y full-width min-width="290px">
    <v-text-field slot="activator" v-model="localModel" label="Birth Date" prepend-icon="event" readonly ></v-text-field>
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