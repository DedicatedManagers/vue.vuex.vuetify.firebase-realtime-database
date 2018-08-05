<template>
  <layout-template :entityConfig="entityConfig" ></layout-template>
</template>

<script>
import Template from '@/components/shared/Templates/Column-Two';
import {RootEntity} from '@/../config/Entities/RootEntity.js';

export default {
  name: 'PrimaryKinshipCaregiverIncome',
  props:['primaryKinshipCaregiverId', 'primaryKinshipCaregiverIncomeId'],
  components:{
    'layout-template':Template,
  },
  data() {
    return {
      componentCollectionId:'PrimaryKinshipCaregiverIncome',
      parentCollectionId:'PrimaryKinshipCaregiver',
    };
  },
  computed:{
    docId: function(){
      return this.primaryKinshipCaregiverIncomeId;
    },
    parentCollectionDocId: function(){
      return this.primaryKinshipCaregiverId;
    },
    entityConfig:function(){
      console.log('entityConfig');
      console.log(RootEntity.subEntities[this.componentCollectionId]);

      return {
        ...RootEntity.subEntities[this.componentCollectionId],
        collectionId:this.componentCollectionId,
        docId:this.docId,
        baseUrl: (this.parentCollectionDocId?'/' +this.parentCollectionId + '/' + this.parentCollectionDocId:"") + '/' + this.componentCollectionId + '/'+ this.docId + '/',
      }
    }
  },
  methods:{
  },
  created(){
    console.log('PrimaryKinshipCaregiverIncome.vue created function. Props: ' + JSON.stringify(this.$options.propsData));
  },
};
</script>
 
<style>
</style>
