<template>
  <v-app>
    <v-toolbar app clipped>
      <v-btn icon to="/dashboard">
        <v-icon>dashboard</v-icon>
      </v-btn>
      <v-toolbar-title>Foster Kinship Client Database</v-toolbar-title>
      <v-spacer></v-spacer>
      <search-box></search-box>
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
import SearchBox from '@/components/shared/SearchBox';

export default {
  name: 'App',
  components:{
      'search-box':SearchBox,
  },
  data() {
    return {
    };
  },
  computed:{
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
  },
};
</script>

