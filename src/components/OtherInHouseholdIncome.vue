<template>
  <layout-template :entityConfig="entityConfig" ></layout-template>
</template>

<script>
import Template from '@/components/shared/Templates/Column-Two';
import {RootEntity} from '@/../config/Entities/RootEntity.js';

export default {
  name: 'OtherInHouseholdIncome',
  props:['primaryKinshipCaregiverId', 'otherInHouseholdId', 'otherInHouseholdIncomeId'],
  components:{
    'layout-template':Template,
  },
  data() {
    return {
      componentCollectionId:'OtherInHouseholdIncome',
      parentCollectionId:'OtherInHousehold',
    };
  },
  computed:{
    docId: function(){
      return this.otherInHouseholdIncomeId;
    },
    parentCollectionDocId: function(){
      return this.primaryKinshipCaregiverId;
    },
    entityConfig:function(){
      return {
        ...RootEntity.subEntities[this.parentCollectionId].subEntities[this.componentCollectionId],
        collectionId:this.componentCollectionId,
        docId:this.docId,
        baseUrl: (this.parentCollectionDocId?'/' +this.parentCollectionId + '/' + this.parentCollectionDocId:"") + '/' + this.componentCollectionId + '/'+ this.docId + '/',
      }
    }
  },
  methods:{
  },
  created(){
    console.log('OtherInHouseholdIncome.vue created function. Props: ' + JSON.stringify(this.$options.propsData));
  },
};
</script>
 
<style>
</style>
