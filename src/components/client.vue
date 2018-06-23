<template>
  <v-slide-y-transition mode="out-in">
    <v-container fluid>
        <v-layout row wrap>
          <v-flex xs12>
              <h1>Primary Caregiver</h1>
              <v-form>
                  <v-text-field @keyup="submit" v-model="FirstName" label="First Name" required ></v-text-field>
                  <v-text-field @keyup="submit" v-model="MiddleName" label="Middle Name" required ></v-text-field>
                  <v-text-field @keyup="submit" v-model="LastName" label="Last Name" required ></v-text-field>
                  <v-text-field @keyup="submit" v-model="PrimaryStreetAddress" label="Primary Street Address" required ></v-text-field>
              </v-form>
          </v-flex>

        </v-layout>
    </v-container>
  </v-slide-y-transition>
</template>


<script>
import firebase from 'firebase/app';

export default {
  name: 'Client',
  props:['clientId'],
  data() {
    return {
    };
  },
  computed:{
    FirstName:{
      get(){
        return this.$store.state.currentPrimaryRelativeCaregiver?this.$store.state.currentPrimaryRelativeCaregiver.data.FirstName:"";
      },
      set(newValue){
        this.$store.commit('update_currentPrimaryRelativeCaregiver_byObject', {FirstName: newValue});
      },
    },
    MiddleName:{
      get(){
        return this.$store.state.currentPrimaryRelativeCaregiver?this.$store.state.currentPrimaryRelativeCaregiver.data.MiddleName:"";
      },
      set(newValue){
        this.$store.commit('update_currentPrimaryRelativeCaregiver_byObject', {MiddleName: newValue});
      },
    },
    LastName:{
      get(){
        return this.$store.state.currentPrimaryRelativeCaregiver?this.$store.state.currentPrimaryRelativeCaregiver.data.LastName:"";
      },
      set(newValue){
        this.$store.commit('update_currentPrimaryRelativeCaregiver_byObject', {LastName: newValue});
      },
    },
    PrimaryStreetAddress:{
      get(){
        return this.$store.state.currentPrimaryRelativeCaregiver?this.$store.state.currentPrimaryRelativeCaregiver.data.PrimaryStreetAddress:"";
      },
      set(newValue){
        this.$store.commit('update_currentPrimaryRelativeCaregiver_byObject', {PrimaryStreetAddress: newValue});
      },
    },
    
  },
  methods:{
      submit(){
        this.$store.dispatch('fcommit_PrimaryRelativeCaregiverById')
      }
  },
  created(){
    console.log('created function in client.vue. dispatching getPrimaryRelativeCaregiverById');
    this.$store.dispatch('getPrimaryRelativeCaregiverById', this.clientId);
  },
};
</script>
 
<style>
</style>
