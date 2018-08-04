<template>
  <layout-template :entityConfig="entityConfig" ></layout-template>
</template>

<script>
import Template from '@/components/shared/Templates/Column-Two';
import {RootEntity} from '@/../config/Entities/RootEntity.js';

export default {
  name: 'KinshipChildIncome',
  props:['primaryKinshipCaregiverId', 'kinshipChildId', 'kinshipChildIncomeId'],
  components:{
    'layout-template':Template,
  },
  data() {
    return {
      componentCollectionId:'KinshipChildIncome',
      parentCollectionId:'KinshipChild',
    };
  },
  computed:{
    docId: function(){
      return this.kinshipChildIncomeId;
    },
    parentCollectionDocId: function(){
      return this.primaryKinshipCaregiverId;
    },
    entityConfig:function(){
      return {
        ...RootEntity.subEntities[1].subEntities[0],
        collectionId:this.componentCollectionId,
        docId:this.docId,
        baseUrl: (this.parentCollectionDocId?'/' +this.parentCollectionId + '/' + this.parentCollectionDocId:"") + '/' + this.componentCollectionId + '/'+ this.docId + '/',
      }
    }
  },
  methods:{
  },
  created(){
    console.log('KinshipChildIncome.vue created function. Props: ' + JSON.stringify(this.$options.propsData));
  },
};
</script>
 
<style>
</style>
