<template>
  <layout-template :entityConfig="entityConfig" ></layout-template>
</template>

<script>
import Template from '@/components/shared/Templates/Column-Two';

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
        collectionId:this.componentCollectionId,
        docId:this.docId,
        title:'Case Plan',
        onDelete:{
          confirmMessage:"Are you sure you want to delete case plan from the primary kinship caregiver?",
          route:"/dashboard",
        },
        baseUrl: (this.parentCollectionDocId?'/' +this.parentCollectionId + '/' + this.parentCollectionDocId:"") + '/' + this.componentCollectionId + '/'+ this.docId + '/',
        formFields:[
          {
            fieldType:'checkbox',
            fieldName:"CommunityConnectionNeeded",
            fieldLabel:"Community Connection Needed",
          },
          {
            fieldType:'checkbox',
            fieldName:"CommunityConnectionAchieved",
            fieldLabel:"Community Connection Achieved",
          },
        ],
        subEntities:[
          {
            toolbarTitle:"Guardianship", 
            entityType:"FamilyAdvocacyGuardianship",
            icon:"assignment_ind",
            addIcon:"assignment_ind",
            addButtonText:"Add Guardianship",
          },
        ]
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
