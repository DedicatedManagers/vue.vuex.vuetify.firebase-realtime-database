// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuetify from 'vuetify';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';
import 'vuetify/dist/vuetify.min.css';
import App from './App';
import router from './router';
import {store} from './store/store'
import InstantSearch from 'vue-instantsearch';
import credentials from '@/../config/credentials';

// Update the display
document.querySelector('#PreLoader H1').innerHTML = 'Connecting...';;

Vue.use(InstantSearch);

firebase.initializeApp(credentials.firebase);
const firestore = firebase.firestore();
firestore.settings({timestampsInSnapshots: true,});

Vue.use(Vuetify, { 
  // theme: {
  //   primary: '#ee44aa',
  //   secondary: '#424242',
  //   accent: '#82B1FF',
  //   error: '#FF5252',
  //   info: '#2196F3',
  //   success: '#4CAF50',
  //   warning: '#FFC107',
  // } 
});

Vue.config.productionTip = false;

let app;

firebase.auth().onAuthStateChanged(function(user) {
  store.commit('setUserIsAuthenticated', user?true:null);
  store.commit('setUser', user);

    if (!app) {
    /* eslint-disable no-new */
    app = new Vue({
      store:store,
      el: '#app',
      router,
      components: { App },
      template: '<App/>',
    });
  }
});
