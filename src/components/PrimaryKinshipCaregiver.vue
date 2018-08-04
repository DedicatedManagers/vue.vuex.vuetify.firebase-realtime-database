<template>
  <layout-template :entityConfig="entityConfig" ></layout-template>
</template>



<script>
import Template from '@/components/shared/Templates/Column-Two';
import {RootEntity} from '@/../config/Entities/RootEntity.js';

export default {
  name: 'PrimaryKinshipCaregiver',
  props:['primaryKinshipCaregiverId'],
  components:{
    'layout-template':Template,
  },
  data() {
    return {
      componentCollectionId:'PrimaryKinshipCaregiver',
    }
  },
  computed:{
    docId: function(){
      return this.primaryKinshipCaregiverId;
    },
    entityConfig:function(){
      return {
        ...RootEntity,
        collectionId:this.componentCollectionId,
        docId:this.docId,
        baseUrl: (this.parentCollectionDocId?'/' +this.parentCollectionId + '/' + this.parentCollectionDocId:"") + '/' + this.componentCollectionId + '/'+ this.docId + '/',
      }
    }
  },
  methods:{
  },
  created(){
    console.log('PrimaryKinshipCaregiver.vue created function. Props: ' + JSON.stringify(this.$options.propsData));
  },
  mounted(){
    console.log('PrimaryKinshipCaregiver.vue mounted function. Props: ' + JSON.stringify(this.$options.propsData));
  },
  beforeDestroy(){
    console.log('PrimaryKinshipCaregiver beforeDestroy');
  }  
};
</script>
 
<style>
</style>
