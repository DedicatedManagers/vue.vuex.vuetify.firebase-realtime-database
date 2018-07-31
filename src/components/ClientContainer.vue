<template>
  <v-slide-y-transition mode="out-in">
    <v-container fluid>
        <v-layout row wrap>
          <v-flex xs12>

            <v-breadcrumbs style="padding:0px; margin-left:12px;" large divider="/">
              <v-breadcrumbs-item ripple exact exact-active-class
                v-for="(navBreadCrumb, id) in navBreadCrumbs" :key="id"
                :disabled="false"
                :to="navBreadCrumb.link"
              >
                {{ navBreadCrumb.text }}
              </v-breadcrumbs-item>
            </v-breadcrumbs>

            <template v-if="!this.$store.state.currentEntity">
              <div class="centeredOnScreen" text-xs-center>
                <v-progress-circular :size="250" :width="30" indeterminate color="blue"></v-progress-circular>
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
        crumbs.push({
            link:'/dashboard',
            text:'Dashboard',
        });
        if(this.primaryKinshipCaregiverId){
          // create base link
          let rootLink='/PrimaryKinshipCaregiver/'+this.primaryKinshipCaregiverId;

          // Root Level
          crumbs.push({
              link:rootLink,
              text:this.clientFullName,
          });

          // 1st child
          if(this.primaryKinshipCaregiverIncomeId){
            crumbs.push({
                link:rootLink + '/PrimaryKinshipCaregiverIncome/'+this.primaryKinshipCaregiverIncomeId,
                text:'Income: '+ this.primaryKinshipCaregiverIncomeId,
            });
          }
          // 1st child
          if(this.primaryKinshipCaregiverContactId){
            crumbs.push({
                link:rootLink + '/PrimaryKinshipCaregiverContact/'+this.primaryKinshipCaregiverContactId,
                text:'Contact: '+ this.primaryKinshipCaregiverContactId,
            });
          }

          if(this.otherInHouseholdId){
            // 1st child - Root
            let othersRootLink =  rootLink + '/OtherInHousehold/'+this.otherInHouseholdId;
            crumbs.push({
                link:othersRootLink,
                text:this.otherInHouseholdFullName,
            });

            // 1st child - 1st Nested Child
            if(this.otherInHouseholdIncomeId){
              crumbs.push({
                  link:othersRootLink+'/OtherInHouseholdIncome/'+this.otherInHouseholdIncomeId,
                  text:'Income: '+ this.otherInHouseholdIncomeId,
              });
            }
          }


          if(this.familyAdvocacyCasePlanId){
            // 1st child - Root
            let familyAdvocacyRootLink = rootLink + '/FamilyAdvocacyCasePlan/'+this.familyAdvocacyCasePlanId;
            crumbs.push({
                link:familyAdvocacyRootLink,
                text:'Case Plan: ' + this.familyAdvocacyCasePlanId,
            });

            // 1st child - 1st Nested Child
            if(this.familyAdvocacyGuardianshipId){
              crumbs.push({
                  link:familyAdvocacyRootLink+'/FamilyAdvocacyGuardianship/'+this.familyAdvocacyGuardianshipId,
                  text:'Guardianship: ' + this.familyAdvocacyGuardianshipId,
              });
            }
          }


          if(this.kinshipChildId){
            // 1st child - Root
            let kinshipChildRootLink = rootLink + '/KinshipChild/'+this.kinshipChildId;
            crumbs.push({
                link:kinshipChildRootLink,
                text:this.kinshipChildFullName,
            });
            // 1st child - 1st Nested Child
            if(this.kinshipChildIncomeId){
              crumbs.push({
                  link:kinshipChildRootLink+'/KinshipChildIncomeId/'+this.kinshipChildIncomeId,
                  text:'Income: ' + this.kinshipChildIncomeId,
              });
            }
            // 1st child - 1st Nested Child
            if(this.kinshipChildCustodyStatusId){
              crumbs.push({
                  link:kinshipChildRootLink+'/KinshipChildCustodyStatusId/'+this.kinshipChildCustodyStatusId,
                  text:'Custody Status: ' + this.kinshipChildCustodyStatusId,
              });
            }
          }

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

.centeredOnScreen {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transform: -webkit-translate(-50%, -50%);
  transform: -moz-translate(-50%, -50%);
  transform: -ms-translate(-50%, -50%);
}

.customListExpandable .v-toolbar{
  cursor:pointer;
}
.customListExpandable .v-list__group__header{
  display: none
}
</style>
