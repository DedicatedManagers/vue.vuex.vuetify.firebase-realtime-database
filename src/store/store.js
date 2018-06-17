import Vue from 'vue';
import Vuex from 'vuex';
import firebase from 'firebase/app';
import router from '@/router';

Vue.use(Vuex);

export const store = new Vuex.Store({
    state:{
        userIsAuthenticated:false,
    },
    mutations:{
        setUserIsAuthenticated(state, replace){
            state.userIsAuthenticated = replace;
        },
    },
    actions:{
        login(context, credentials){
            firebase.auth().signInWithEmailAndPassword(credentials.username, credentials.password).then(
                function (user){
                    router.push('/client');
                },
                function(error){
                    console.log('login failed. Error:', error);
                    alert(error.message)
                }
            );
        },
        logout(context){
            firebase.auth().signOut()
            .then(data=>{
              console.log('Logged out.  Response: ' + data);
              router.push('/login');
            })
            .catch(e=>{
              console.log('Logout failed: ', e);
            });
        },
    }
})