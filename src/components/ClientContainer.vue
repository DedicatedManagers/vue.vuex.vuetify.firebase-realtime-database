<template>
  <v-slide-y-transition mode="out-in">
    <v-container fluid>
        <v-layout row wrap>
          <v-flex xs12>
            <router-link to="/dashbaord">Dashboard</router-link> 
            <span v-for="(navBreadCrumb, id) in navBreadCrumbs" :key="id">
                | <router-link  :to="navBreadCrumb.link">{{navBreadCrumb.text}}</router-link>
            </span>
            <primary-relative-caregiver v-if="!kinshipChildId && !kinshipChildIncomeId" :primaryKinshipCaregiverId="primaryKinshipCaregiverId"></primary-relative-caregiver>
            <kinship-child v-if="kinshipChildId && !kinshipChildIncomeId" :primaryKinshipCaregiverId="primaryKinshipCaregiverId" :kinshipChildId="kinshipChildId" ></kinship-child>
            <kinship-child-income v-if="kinshipChildIncomeId" :primaryKinshipCaregiverId="primaryKinshipCaregiverId" :kinshipChildId="kinshipChildId" :kinshipChildIncomeId="kinshipChildIncomeId"></kinship-child-income>
          </v-flex>
        </v-layout> 
    </v-container>
  </v-slide-y-transition>
</template>

<script>
import firebase from 'firebase/app';
import PrimaryKinshipCaregiver from '@/components/PrimaryKinshipCaregiver';
import KinshipChild from '@/components/KinshipChild';
import KinshipChildIncome from '@/components/KinshipChildIncome';

export default {
  name: 'ClientContainer',
  props:['primaryKinshipCaregiverId','kinshipChildId', 'kinshipChildIncomeId'],
  components:{
      'primary-relative-caregiver':PrimaryKinshipCaregiver,
      'kinship-child':KinshipChild,
      'kinship-child-income':KinshipChildIncome,
  },
  computed:{
      clientFullName:function(){
        if( ! ((this.$store.state.currentEntity||{})['PrimaryKinshipCaregiver']||{}).hasOwnProperty(this.primaryKinshipCaregiverId)   ) return "";  // the async call to get the info hasn't happened yet
        
        let FirstName = ((((this.$store.state.currentEntity||{})['PrimaryKinshipCaregiver']||{})[this.primaryKinshipCaregiverId]||{}).data||{}).FirstName;
        if (typeof FirstName === 'undefined') FirstName = "<FIRST NAME NOT SET>";

        let LastName = ((((this.$store.state.currentEntity||{})['PrimaryKinshipCaregiver']||{})[this.primaryKinshipCaregiverId]||{}).data||{}).LastName;
        if (typeof LastName === 'undefined') LastName = "<LAST NAME NOT SET>";

        let fullName = LastName + ", " + FirstName;
        return fullName;
      },
      kinshipChildFullName:function(){
        // If the KinshipChild has not loaded, return an empty string
        if( ! ((this.$store.state.currentEntity||{})['KinshipChild']||{}).hasOwnProperty(this.kinshipChildId)   ) return ""; 
        
        let FirstName = ((((this.$store.state.currentEntity||{})['KinshipChild']||{})[this.kinshipChildId]||{}).data||{}).FirstName;
        if (typeof FirstName === 'undefined') FirstName = "<FIRST NAME NOT SET>";

        let LastName = ((((this.$store.state.currentEntity||{})['KinshipChild']||{})[this.kinshipChildId]||{}).data||{}).LastName;
        if (typeof LastName === 'undefined') LastName = "<LAST NAME NOT SET>";

        let fullName = LastName + ", " + FirstName;
        return fullName;
      },
      navBreadCrumbs: function (){
          let crumbs = [];
          if(this.kinshipChildId){
            crumbs.push({
                link:'/PrimaryKinshipCaregiver/'+this.primaryKinshipCaregiverId,
                text:this.clientFullName,
            });
          }
          if(this.kinshipChildIncomeId){
            crumbs.push({
                link:'/PrimaryKinshipCaregiver/'+this.primaryKinshipCaregiverId+'/KinshipChild/'+this.kinshipChildId,
                text:this.kinshipChildFullName,
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
        // - its a new entity if the new id (primaryKinshipCaregiverId) doesn't exist already on the root entity (PrimaryKinshipCaregiver)
        if(this.primaryKinshipCaregiverId=="add" || !this.$store.state.currentEntity['PrimaryKinshipCaregiver'].hasOwnProperty(this.primaryKinshipCaregiverId)){
            this.$store.commit('deleteAllCurrentEntitesAndListeners');
            this.$store.dispatch('getEntity_ByEntityContainer', {docId:this.primaryKinshipCaregiverId, collectionId:'PrimaryKinshipCaregiver'});
        }
      }
    }
    else{
      // this is a new load of the app - get the info for this root level entity
      console.log('new load');
      this.$store.dispatch('getEntity_ByEntityContainer', {docId:this.primaryKinshipCaregiverId, collectionId:'PrimaryKinshipCaregiver'});      
    }
  },
};
</script>
 
<style>
</style>
