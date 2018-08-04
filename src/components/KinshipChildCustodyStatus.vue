<template>
  <layout-template :entityConfig="entityConfig" ></layout-template>
</template>

<script>
import Template from '@/components/shared/Templates/Column-Two';
import {RootEntity} from '@/../config/Entities/RootEntity.js';

export default {
  name: 'KinshipChildCustodyStatus',
  props:['primaryKinshipCaregiverId', 'kinshipChildId', 'kinshipChildCustodyStatusId'],
  components:{
    'layout-template':Template,
  },
  data() {
    return {
      componentCollectionId:'KinshipChildCustodyStatus',
      parentCollectionId:'KinshipChild',
    };
  },
  computed:{
    docId: function(){
      return this.kinshipChildCustodyStatusId;
    },
    parentCollectionDocId: function(){
      return this.primaryKinshipCaregiverId;
    },
    entityConfig:function(){
      return {
        ...RootEntity.subEntities[1].subEntities[1],
        collectionId:this.componentCollectionId,
        docId:this.docId,
        baseUrl: (this.parentCollectionDocId?'/' +this.parentCollectionId + '/' + this.parentCollectionDocId:"") + '/' + this.componentCollectionId + '/'+ this.docId + '/',
      }
    }
  },
  methods:{
  },
  created(){
    console.log('KinshipChildCustodyStatus.vue created function. Props: ' + JSON.stringify(this.$options.propsData));
  },
};
</script>
 
<style>
</style>
