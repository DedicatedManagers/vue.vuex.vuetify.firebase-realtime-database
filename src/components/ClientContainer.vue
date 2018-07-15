<template>
  <v-slide-y-transition mode="out-in">
    <v-container fluid>
        <v-layout row wrap>
          <v-flex xs12>
            <router-link to="/dashbaord">Dashboard</router-link> 
            <span v-for="(navBreadCrumb, id) in navBreadCrumbs" :key="id">
                | <router-link  :to="navBreadCrumb.link">{{navBreadCrumb.text}}</router-link>
            </span>
            <primary-relative-caregiver v-if="!relatedChildId" :primaryRelativeCaregiverId="primaryRelativeCaregiverId"></primary-relative-caregiver>
            <related-child v-if="relatedChildId" :relatedChildId="relatedChildId"></related-child>
          </v-flex>
        </v-layout> 
    </v-container>
  </v-slide-y-transition>
</template>

<script>
import firebase from 'firebase/app';
import PrimaryRelativeCaregiver from '@/components/PrimaryRelativeCaregiver';
import RelatedChild from '@/components/RelatedChild';

export default {
  name: 'ClientContainer',
  props:['primaryRelativeCaregiverId','relatedChildId'],
  components:{
      'primary-relative-caregiver':PrimaryRelativeCaregiver,
      'related-child':RelatedChild,
  },
  computed:{
      clientFullName:function(){
        if(!this.$store.state.currentEntity['PrimaryRelativeCaregiver']) return "";
        if(!this.$store.state.currentEntity['PrimaryRelativeCaregiver'][this.primaryRelativeCaregiverId]) return "";
        
        let fullName = "";
        fullName += this.$store.state.currentEntity['PrimaryRelativeCaregiver'][this.primaryRelativeCaregiverId]?this.$store.state.currentEntity['PrimaryRelativeCaregiver'][this.primaryRelativeCaregiverId].data.LastName:"";
        fullName += ", ";
        fullName += this.$store.state.currentEntity['PrimaryRelativeCaregiver'][this.primaryRelativeCaregiverId]?this.$store.state.currentEntity['PrimaryRelativeCaregiver'][this.primaryRelativeCaregiverId].data.FirstName:"";
        return fullName;
      },
      navBreadCrumbs: function (){
          let crumbs = [];
          if(this.relatedChildId){
            crumbs.push({
                link:'/PrimaryRelativeCaregiver/'+this.primaryRelativeCaregiverId,
                text:this.clientFullName,
            });
          }
          return crumbs;
      },
  },
  created(){
    console.log('ClientContainer.vue created function. Props: ' + JSON.stringify(this.$options.propsData));

    // if we have already loaded the root level Entity (highest parent of the entities)
    if(this.$store.state.currentEntity){
      if(this.$store.state.currentEntity['PrimaryRelativeCaregiver']){
        for (let rootEntityId in this.$store.state.currentEntity['PrimaryRelativeCaregiver']){
          // if we are trying to get a new root level Entity, clear out the currentEntity & entityListeners to start fresh with the new root level entity
          if(rootEntityId != this.primaryRelativeCaregiverId){
            this.$store.commit('deleteAllCurrentEntitesAndListeners');
            this.$store.dispatch('getEntity_ByEntityContainer', {docId:this.primaryRelativeCaregiverId, collectionId:'PrimaryRelativeCaregiver'});
          }
          break; //there should only be one root currentEntity so no need to loop any further
        }
      }
    }
    else{
      // this is a new load of the app - get the info for this root level entity
      this.$store.dispatch('getEntity_ByEntityContainer', {docId:this.primaryRelativeCaregiverId, collectionId:'PrimaryRelativeCaregiver'});      
    }
  },
};
</script>
 
<style>
</style>
