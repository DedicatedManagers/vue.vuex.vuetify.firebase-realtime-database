<template>
  <v-slide-y-transition mode="out-in">
    <v-container fluid>
        <v-layout row wrap>
          <v-flex xs12>
            <router-link to="/dashbaord">Dashboard</router-link> 
            <span v-for="(navBreadCrumb, id) in navBreadCrumbs" :key="id">
                | <router-link  :to="navBreadCrumb.link">{{navBreadCrumb.text}}</router-link>
            </span>

            <template v-if="!this.$store.state.currentEntity">
              <div style="margin-top:100px; text-align:center;">
                <v-progress-circular :size="300" :width="30" indeterminate color="blue"></v-progress-circular>
                <h1>LOADING DATA</h1>
              </div>
            </template>
            <template v-else>
              <template v-if="primaryKinshipCaregiverIncomeId || primaryKinshipCaregiverContactId || familyAdvocacyCasePlanId">
                <primarykinshipcaregiver-income v-if="primaryKinshipCaregiverIncomeId" :primaryKinshipCaregiverId="primaryKinshipCaregiverId" :primaryKinshipCaregiverIncomeId="primaryKinshipCaregiverIncomeId"></primarykinshipcaregiver-income>
                <primarykinshipcaregiver-contact v-if="primaryKinshipCaregiverContactId"  :primaryKinshipCaregiverId="primaryKinshipCaregiverId" :primaryKinshipCaregiverContactId="primaryKinshipCaregiverContactId"></primarykinshipcaregiver-contact>
                <familyadvocacy-caseplan v-if="familyAdvocacyCasePlanId && !familyAdvocacyGuardianshipId" :primaryKinshipCaregiverId="primaryKinshipCaregiverId" :familyAdvocacyCasePlanId="familyAdvocacyCasePlanId"></familyadvocacy-caseplan>
                <familyadvocacy-guardianship v-if="familyAdvocacyGuardianshipId"  :primaryKinshipCaregiverId="primaryKinshipCaregiverId" :familyAdvocacyCasePlanId="familyAdvocacyCasePlanId" :familyAdvocacyGuardianshipId="familyAdvocacyGuardianshipId"></familyadvocacy-guardianship>
              </template>
              <template v-else-if="kinshipChildId">
                <kinshipchild  v-if="!(kinshipChildIncomeId || kinshipChildCustodyStatusId)" :primaryKinshipCaregiverId="primaryKinshipCaregiverId" :kinshipChildId="kinshipChildId" ></kinshipchild>
                <kinshipchild-income v-if="kinshipChildIncomeId" :primaryKinshipCaregiverId="primaryKinshipCaregiverId" :kinshipChildId="kinshipChildId" :kinshipChildIncomeId="kinshipChildIncomeId"></kinshipchild-income>
                <kinshipchild-custodystatus v-if="kinshipChildCustodyStatusId" :primaryKinshipCaregiverId="primaryKinshipCaregiverId" :kinshipChildId="kinshipChildId" :kinshipChildCustodyStatusId="kinshipChildCustodyStatusId"></kinshipchild-custodystatus>
              </template>
              <template v-else-if="otherInHouseholdId">
                <otherinhousehold v-if="!otherInHouseholdIncomeId" :primaryKinshipCaregiverId="primaryKinshipCaregiverId" :otherInHouseholdId="otherInHouseholdId" ></otherinhousehold>
                <otherinhousehold-income v-if="otherInHouseholdIncomeId" :primaryKinshipCaregiverId="primaryKinshipCaregiverId" :otherInHouseholdId="otherInHouseholdId" :otherInHouseholdIncomeId="otherInHouseholdIncomeId"></otherinhousehold-income>
              </template>
              <template v-else>
                <primary-kinship-caregiver :primaryKinshipCaregiverId="primaryKinshipCaregiverId"></primary-kinship-caregiver>
              </template>
            </template>

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
import OtherInHousehold from '@/components/OtherInHousehold';
import OtherInHouseholdIncome from '@/components/OtherInHouseholdIncome';
import PrimaryKinshipCaregiverIncome from '@/components/PrimaryKinshipCaregiverIncome';
import KinshipChildCustodyStatus from '@/components/KinshipChildCustodyStatus';
import PrimaryKinshipCaregiverContact from '@/components/PrimaryKinshipCaregiverContact';
import FamilyAdvocacyCasePlan from '@/components/FamilyAdvocacyCasePlan';
import FamilyAdvocacyGuardianship from '@/components/FamilyAdvocacyGuardianship';


export default {
  name: 'ClientContainer',
  props:[
    'primaryKinshipCaregiverId','kinshipChildId', 'kinshipChildIncomeId','otherInHouseholdId', 'otherInHouseholdIncomeId',
    'primaryKinshipCaregiverIncomeId','kinshipChildCustodyStatusId','primaryKinshipCaregiverContactId','familyAdvocacyCasePlanId',
    'familyAdvocacyGuardianshipId'
  ],
  components:{
      'primary-kinship-caregiver':PrimaryKinshipCaregiver,
      'kinshipchild':KinshipChild,
      'kinshipchild-income':KinshipChildIncome,
      'otherinhousehold':OtherInHousehold,
      'otherinhousehold-income':OtherInHouseholdIncome,
      'primarykinshipcaregiver-income':PrimaryKinshipCaregiverIncome,
      'primarykinshipcaregiver-contact':PrimaryKinshipCaregiverContact,
      'familyadvocacy-caseplan':FamilyAdvocacyCasePlan,
      'familyadvocacy-guardianship':FamilyAdvocacyGuardianship,
      'kinshipchild-custodystatus':KinshipChildCustodyStatus,
  },
  methods:{
    initializeEntity(){
      console.log('initializeEntity in ClientContainer.vue');
      // if we have already loaded the root level Entity (highest parent of the entities)
      if(this.$store.state.currentEntity){
        if(this.$store.state.currentEntity['PrimaryKinshipCaregiver']){

          // if we are trying add or to get a new root level Entity, clear out the currentEntity & entityListeners to start fresh with the new root level entity
          // - its a new entity if the new id (primaryKinshipCaregiverId) doesn't exist already on the root entity (PrimaryKinshipCaregiver)
          if(this.primaryKinshipCaregiverId=="add" || !this.$store.state.currentEntity['PrimaryKinshipCaregiver'].hasOwnProperty(this.primaryKinshipCaregiverId)){
              this.$store.commit('deleteAllCurrentEntitesAndListeners');
              this.$store.dispatch('getEntity', {docId:this.primaryKinshipCaregiverId, collectionId:'PrimaryKinshipCaregiver'});
          }
        }
      }
      else{
        // this is a new load of the app - get the info for this root level entity
        console.log('new load');
        this.$store.dispatch('getEntity', {docId:this.primaryKinshipCaregiverId, collectionId:'PrimaryKinshipCaregiver'});      
      }
    }
  },
  watch:{
    primaryKinshipCaregiverId: function(){
      this.initializeEntity();
    }
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
      otherInHouseholdFullName:function(){
        // If the OtherInHousehold has not loaded, return an empty string
        if( ! ((this.$store.state.currentEntity||{})['OtherInHousehold']||{}).hasOwnProperty(this.otherInHouseholdId)   ) return ""; 
        
        let FirstName = ((((this.$store.state.currentEntity||{})['OtherInHousehold']||{})[this.otherInHouseholdId]||{}).data||{}).FirstName;
        if (typeof FirstName === 'undefined') FirstName = "<FIRST NAME NOT SET>";

        let LastName = ((((this.$store.state.currentEntity||{})['OtherInHousehold']||{})[this.otherInHouseholdId]||{}).data||{}).LastName;
        if (typeof LastName === 'undefined') LastName = "<LAST NAME NOT SET>";

        let fullName = LastName + ", " + FirstName;
        return fullName;
      },
      navBreadCrumbs: function (){
        let crumbs = [];
        if(this.primaryKinshipCaregiverIncomeId){
          crumbs.push({
              link:'/PrimaryKinshipCaregiver/'+this.primaryKinshipCaregiverId,
              text:this.clientFullName,
          });
        }
        if(this.primaryKinshipCaregiverContactId){
          crumbs.push({
              link:'/PrimaryKinshipCaregiver/'+this.primaryKinshipCaregiverId,
              text:this.clientFullName,
          });
        }
        if(this.familyAdvocacyCasePlanId){
          crumbs.push({
              link:'/PrimaryKinshipCaregiver/'+this.primaryKinshipCaregiverId,
              text:this.clientFullName,
          });
        }
        if(this.familyAdvocacyGuardianshipId){
          crumbs.push({
              link:'/PrimaryKinshipCaregiver/'+this.primaryKinshipCaregiverId+'/FamilyAdvocacyCasePlan/'+this.familyAdvocacyCasePlanId,
              text:'Case Plan',
          });
        }
        if(this.kinshipChildId){
          crumbs.push({
              link:'/PrimaryKinshipCaregiver/'+this.primaryKinshipCaregiverId,
              text:this.clientFullName,
          });
        }
        if(this.kinshipChildIncomeId || this.kinshipChildCustodyStatusId){
          crumbs.push({
              link:'/PrimaryKinshipCaregiver/'+this.primaryKinshipCaregiverId+'/KinshipChild/'+this.kinshipChildId,
              text:this.kinshipChildFullName,
          });
        }
        if(this.otherInHouseholdId){
          crumbs.push({
              link:'/PrimaryKinshipCaregiver/'+this.primaryKinshipCaregiverId,
              text:this.clientFullName,
          });
        }
        if(this.otherInHouseholdIncomeId){
          crumbs.push({
              link:'/PrimaryKinshipCaregiver/'+this.primaryKinshipCaregiverId+'/OtherInHousehold/'+this.otherInHouseholdId,
              text:this.otherInHouseholdFullName,
          });
        }

        return crumbs;
      },
  },
  created(){
    console.log('ClientContainer.vue created function. Props: ' + JSON.stringify(this.$options.propsData));
    this.initializeEntity();
  },  
  beforeDestroy(){
    console.log('ClientContainer beforeDestroy');
  }
};
</script>
 
<style>

.customListExpandable .v-toolbar{
  cursor:pointer;
}
.customListExpandable .v-list__group__header{
  display: none
}
</style>
