<template>
  <v-slide-y-transition mode="out-in">
    <v-container fluid>
        <v-layout row wrap>
          <v-flex xs12>
              <h1>Primary Caregiver</h1>
              <v-form v-if="current_PrimaryRelativeCaregiver">
                  <v-text-field v-model="current_PrimaryRelativeCaregiver.data.FirstName" label="First Name" required ></v-text-field>
                  <v-text-field v-model="current_PrimaryRelativeCaregiver.data.MiddleName" label="Middle Name" required ></v-text-field>
                  <v-text-field v-model="current_PrimaryRelativeCaregiver.data.LastName" label="Last Name" required ></v-text-field>
                  <v-btn @click="submit">submit</v-btn>
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
        name:"",
    };
  },
  computed:{
    current_PrimaryRelativeCaregiver(){
      return this.$store.state.current_PrimaryRelativeCaregiver;
    }
  },
  methods:{
      submit(){
        this.$store.dispatch('setPrimaryRelativeCaregiverById', this.current_PrimaryRelativeCaregiver)
      }
  },
  created(){
    console.log('created function in client.vue');
    this.$store.dispatch('getPrimaryRelativeCaregiverById', this.clientId);
  },
};
</script>
 
<style>
</style>
