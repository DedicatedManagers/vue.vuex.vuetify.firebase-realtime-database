<template>
  <v-app>
    <template>
      <v-layout row justify-center v-if="confirmDialogIsVisible">
        <v-dialog v-model="confirmDialogIsVisible" persistent max-width="290">
          <v-btn slot="activator" color="primary" dark>Open Dialog</v-btn>
          <v-card>
            <v-card-title class="headline">Use Google's location service?</v-card-title>
            <v-card-text>Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running.</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" flat @click="confirmDialogDecision(false)">Disagree</v-btn>
              <v-btn color="green darken-1" flat @click="confirmDialogDecision(false)">Agree</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-layout>
    </template>


    <v-toolbar app clipped>
      <v-btn icon to="/dashboard">
        <v-icon>dashboard</v-icon>
      </v-btn>
      <v-toolbar-title>Foster Kinship Client Database</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn flat @click='login' v-if="!userIsAuthenticated">Sign In</v-btn>
        <v-btn flat @click='logout' v-if="userIsAuthenticated">Sign Out</v-btn>
      </v-toolbar-items>
    </v-toolbar>


    <v-content>
      <router-view/>
    </v-content>
    <v-footer fixed app>
      <span>&copy; 2018</span>
    </v-footer>
  </v-app>
</template>

<script>
import firebase from 'firebase/app';
import router from '@/router';

export default {
  name: 'App',
  data() {
    return {
      
    };
  },
  computed:{
    confirmDialogIsVisible(){
      return this.$store.state.confirmDialog.isVisible;
    },
    userIsAuthenticated: function(){
      return this.$store.state.userIsAuthenticated;
    },
  },
  methods:{
    login(){
      router.push('/login');
    },
    logout(){
      this.$store.dispatch('logout');
    },
    confirmDialogDecision(result) {
      if(result){
        return this.$store.state.confirmDialog.resultTrueFunction();
      }
      else{
        return this.$store.state.confirmDialog.resultFalseFunction();          
      }
    },
  }
};
</script>
