<template>
  <v-app>
    <v-toolbar app clipped>
      <v-btn icon @click="navOpen=!navOpen">
        <v-icon>menu</v-icon>
      </v-btn>
      <v-toolbar-title class="hidden-sm-and-down">Foster Kinship Client Database</v-toolbar-title>
      <v-toolbar-title class="hidden-md-and-up">FK</v-toolbar-title>
      <v-spacer></v-spacer>
      <search-box v-show="$vuetify.breakpoint.smAndUp"></search-box>
      <v-btn flat small to="/search" class="hidden-sm-and-up"><v-icon>search</v-icon></v-btn>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn flat @click='login' v-if="!userIsAuthenticated">Sign In</v-btn>
        <v-btn flat @click='logout' v-if="userIsAuthenticated">Sign Out</v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-navigation-drawer dark  :value="navOpen" class="blue darken-2" app >
      <v-list>
        <v-list-tile @click="routeLink('/dashboard')">
          <v-list-tile-action>
            <v-icon>dashboard</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Dashboard</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile  @click="routeLink('/search')">
          <v-list-tile-action>
            <v-icon>search</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Search</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-content>
      <template v-if="this.$store.state.loadingIndicator">
        <div class="centeredOnScreen" text-xs-center>
          <v-progress-circular :size="250" :width="30" indeterminate color="blue"></v-progress-circular>
          <h1>LOADING DATA</h1>
        </div>
      </template>
      <template>
        <router-view/>
      </template>

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
      navOpen:false,
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
    routeLink(loc){
      router.push(loc)
    },
  },
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
</style>
