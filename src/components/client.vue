<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout row>
        <v-flex xs12>
            <h1>Primary Caregiver</h1>
            <v-form v-if="current_PrimaryRelativeCaregiver">
                <v-text-field v-model="current_PrimaryRelativeCaregiver.data.FirstName" label="Name" required ></v-text-field>
                <v-text-field v-model="current_PrimaryRelativeCaregiver.data.LastName" label="Name" required ></v-text-field>
                <v-btn @click="submit">submit</v-btn>
            </v-form>
        </v-flex>

      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>


<script>
import firebase from 'firebase/app';

export default {
  name: 'Client',
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
        console.log(this.$store.state.current_PrimaryRelativeCaregiver);
        console.log(this.current_PrimaryRelativeCaregiver);
        this.$store.dispatch('setPrimaryRelativeCaregiverById', this.current_PrimaryRelativeCaregiver)
      }
  },
  created(){
    this.$store.dispatch('getPrimaryRelativeCaregiverById', "jEgHuKWvGvjuJOq7hjNC");
  },
};
</script>
 
<style>
</style>
