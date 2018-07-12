<template>
  <v-slide-y-transition mode="out-in">
    <v-container fluid>
        <v-layout row wrap>
          <v-flex xs12>
            <router-link to="/dashbaord">Dashboard</router-link> 
            <span v-for="(navBreadCrumb, id) in navBreadCrumbs" :key="id">
                | <router-link  :to="navBreadCrumb.link">{{navBreadCrumb.text}}</router-link>
            </span>
            <client v-if="!childId" :clientId="clientId"></client>
            <child v-if="childId" :childId="childId"></child>
          </v-flex>
        </v-layout> 
    </v-container>
  </v-slide-y-transition>
</template>

<script>
import firebase from 'firebase/app';
import Client from '@/components/Client';
import Child from '@/components/Child';

export default {
  name: 'Client',
  props:['clientId','childId'],
  components:{
      client:Client,
      child:Child,
  },
  computed:{
      clientFullName:function(){
        let fullName = "";
        fullName += this.$store.state.currentEntity['PrimaryRelativeCaregiver']?this.$store.state.currentEntity['PrimaryRelativeCaregiver'].data.LastName:"";
        fullName += ", ";
        fullName += this.$store.state.currentEntity['PrimaryRelativeCaregiver']?this.$store.state.currentEntity['PrimaryRelativeCaregiver'].data.FirstName:"";
        return fullName;
      },
      navBreadCrumbs: function (){
          let crumbs = [];
          if(this.childId){
            crumbs.push({
                link:'/client/'+this.clientId,
                text:this.clientFullName,
            });
          }
          return crumbs;
      },
  },
  created(){
    console.log('ClientConteiner.vue created function');
    console.log(this.$options.propsData);
    console.log(this.childId);
    this.$store.dispatch('getEntity_ByEntityContainer', {docId:this.clientId, collectionId:'PrimaryRelativeCaregiver'});
  },
};
</script>
 
<style>
</style>
