<template>
  <v-slide-y-transition mode="out-in">
    <v-container fluid>
        <v-layout row wrap>
          <v-flex xs12>
            <router-link to="/dashbaord">Dashboard</router-link> 
            <span v-for="(navBreadCrumb, id) in navBreadCrumbs" :key="id">
                | <router-link  :to="navBreadCrumb.link">{{navBreadCrumb.text}}</router-link>
            </span>
            <primary-relative-caregiver v-if="!relatedChildId && !relatedChildIncomeId" :primaryRelativeCaregiverId="primaryRelativeCaregiverId"></primary-relative-caregiver>
            <related-child v-if="relatedChildId && !relatedChildIncomeId" :primaryRelativeCaregiverId="primaryRelativeCaregiverId" :relatedChildId="relatedChildId" ></related-child>
            <related-child-income v-if="relatedChildIncomeId" :primaryRelativeCaregiverId="primaryRelativeCaregiverId" :relatedChildId="relatedChildId" :relatedChildIncomeId="relatedChildIncomeId"></related-child-income>
          </v-flex>
        </v-layout> 
    </v-container>
  </v-slide-y-transition>
</template>

<script>
import firebase from 'firebase/app';
import PrimaryKinshipCaregiver from '@/components/PrimaryKinshipCaregiver';
import RelatedChild from '@/components/RelatedChild';
import RelatedChildIncome from '@/components/RelatedChildIncome';

export default {
  name: 'ClientContainer',
  props:['primaryRelativeCaregiverId','relatedChildId', 'relatedChildIncomeId'],
  components:{
      'primary-relative-caregiver':PrimaryKinshipCaregiver,
      'related-child':RelatedChild,
      'related-child-income':RelatedChildIncome,
  },
  computed:{
      clientFullName:function(){
        if( ! ((this.$store.state.currentEntity||{})['PrimaryKinshipCaregiver']||{}).hasOwnProperty(this.primaryRelativeCaregiverId)   ) return "";  // the async call to get the info hasn't happened yet
        
        let FirstName = ((((this.$store.state.currentEntity||{})['PrimaryKinshipCaregiver']||{})[this.primaryRelativeCaregiverId]||{}).data||{}).FirstName;
        if (typeof FirstName === 'undefined') FirstName = "<FIRST NAME NOT SET>";

        let LastName = ((((this.$store.state.currentEntity||{})['PrimaryKinshipCaregiver']||{})[this.primaryRelativeCaregiverId]||{}).data||{}).LastName;
        if (typeof LastName === 'undefined') LastName = "<LAST NAME NOT SET>";

        let fullName = LastName + ", " + FirstName;
        return fullName;
      },
      relatedChildFullName:function(){
        // If the RelatedChild has not loaded, return an empty string
        if( ! ((this.$store.state.currentEntity||{})['RelatedChild']||{}).hasOwnProperty(this.relatedChildId)   ) return ""; 
        
        let FirstName = ((((this.$store.state.currentEntity||{})['RelatedChild']||{})[this.relatedChildId]||{}).data||{}).FirstName;
        if (typeof FirstName === 'undefined') FirstName = "<FIRST NAME NOT SET>";

        let LastName = ((((this.$store.state.currentEntity||{})['RelatedChild']||{})[this.relatedChildId]||{}).data||{}).LastName;
        if (typeof LastName === 'undefined') LastName = "<LAST NAME NOT SET>";

        let fullName = LastName + ", " + FirstName;
        return fullName;
      },
      navBreadCrumbs: function (){
          let crumbs = [];
          if(this.relatedChildId){
            crumbs.push({
                link:'/PrimaryKinshipCaregiver/'+this.primaryRelativeCaregiverId,
                text:this.clientFullName,
            });
          }
          if(this.relatedChildIncomeId){
            crumbs.push({
                link:'/PrimaryKinshipCaregiver/'+this.primaryRelativeCaregiverId+'/RelatedChild/'+this.relatedChildId,
                text:this.relatedChildFullName,
            });
          }
          return crumbs;
      },
  },
  created(){
    console.log('ClientContainer.vue created function. Props: ' + JSON.stringify(this.$options.propsData));

    // if we have already loaded the root level Entity (highest parent of the entities)
    if(this.$store.state.currentEntity){
      if(this.$store.state.currentEntity['PrimaryKinshipCaregiver']){

        // if we are trying add or to get a new root level Entity, clear out the currentEntity & entityListeners to start fresh with the new root level entity
        // - its a new entity if the new id (primaryRelativeCaregiverId) doesn't exist already on the root entity (PrimaryKinshipCaregiver)
        if(this.primaryRelativeCaregiverId=="add" || !this.$store.state.currentEntity['PrimaryKinshipCaregiver'].hasOwnProperty(this.primaryRelativeCaregiverId)){
            this.$store.commit('deleteAllCurrentEntitesAndListeners');
            this.$store.dispatch('getEntity_ByEntityContainer', {docId:this.primaryRelativeCaregiverId, collectionId:'PrimaryKinshipCaregiver'});
        }
      }
    }
    else{
      // this is a new load of the app - get the info for this root level entity
      console.log('new load');
      this.$store.dispatch('getEntity_ByEntityContainer', {docId:this.primaryRelativeCaregiverId, collectionId:'PrimaryKinshipCaregiver'});      
    }
  },
};
</script>
 
<style>
</style>
