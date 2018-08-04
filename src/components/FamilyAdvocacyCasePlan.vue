<template>
  <layout-template :entityConfig="entityConfig" ></layout-template>
</template>

<script>
import Template from '@/components/shared/Templates/Column-Two';
import {RootEntity} from '@/../config/Entities/RootEntity.js';

export default {
  name: 'FamilyAdvocacyCasePlan',
  props:['primaryKinshipCaregiverId', 'familyAdvocacyCasePlanId'],
  components:{
    'layout-template':Template,
  },
  data() {
    return {
      componentCollectionId:'FamilyAdvocacyCasePlan',
      parentCollectionId:'PrimaryKinshipCaregiver',
    };
  },
  computed:{
    docId: function(){
      return this.familyAdvocacyCasePlanId;
    },
    parentCollectionDocId: function(){
      return this.primaryKinshipCaregiverId;
    },
    entityConfig:function(){
      return {
        ...RootEntity.subEntities[3],
        collectionId:this.componentCollectionId,
        docId:this.docId,
        baseUrl: (this.parentCollectionDocId?'/' +this.parentCollectionId + '/' + this.parentCollectionDocId:"") + '/' + this.componentCollectionId + '/'+ this.docId + '/',
      }
    }
  },
  methods:{
  },
  created(){
    console.log('FamilyAdvocacyCasePlan.vue created function. Props: ' + JSON.stringify(this.$options.propsData));
  },
};
</script>
 
<style>
</style>
