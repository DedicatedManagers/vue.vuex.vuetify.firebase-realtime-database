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
              <v-btn class="error" @click="confirmDialogVisiblility=true">Delete Client</v-btn>
              <dialog-confirm confirmType="error" :confirmVisibilty="confirmDialogVisiblility" @confirmAccept="fDelete" @confirmCancel="confirmDialogVisiblility=false">
                <template slot="title">Confirm Delete</template>
                <template slot="text">Are you sure you want to delete this client?</template>
                <template slot="confirmButton">Confirm Delete</template>
              </dialog-confirm>
          </v-flex>
        </v-layout> 
    </v-container>
  </v-slide-y-transition>
</template>

<script>
import firebase from 'firebase/app';
import DialogConfirm from '@/components/shared/DialogConfirm';

export default {
  name: 'Client',
  props:['clientId'],
  components:{
    'dialog-confirm':DialogConfirm
  },
  data() {
    return {
      confirmDialogVisiblility:false,
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
      },
      fDelete(){
        this.confirmDialogVisiblility = false;
        this.$store.dispatch('fdelete_PrimaryRelativeCaregiverById')
      }
  },
  created(){
    this.$store.dispatch('getPrimaryRelativeCaregiverById', this.clientId);
  },
};
</script>
 
<style>
</style>
