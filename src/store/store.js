import Vue from 'vue';
import Vuex from 'vuex';
import firebase from 'firebase/app';
import router from '@/router';

Vue.use(Vuex);

export const store = new Vuex.Store({
    state:{
        user:null,
        userIsAuthenticated:false,
        QUERY_PrimaryRelativeCaregiverById:false,
        current_PrimaryRelativeCaregiver:false,
        current_PrimaryRelativeCaregivers:false,

    },
    mutations:{
        setUserIsAuthenticated(state, replace){
            state.userIsAuthenticated = replace;
        },
        setUser(state, replace){
            state.user = replace;
        }
    },
    actions:{
        login(context, credentials){
            firebase.auth().signInWithEmailAndPassword(credentials.username, credentials.password)
            .then(data=>{
                console.log('Logged in.');
                router.push('/dashboard');
            })
            .catch(e=>{
                console.log('Login failed: ', e);
                alert(e.message)
            });  
        },
        logout(context){
            firebase.auth().signOut()
            .then(data=>{
              console.log('Logged out.');
              router.push('/login');
            })
            .catch(e=>{
              console.log('Logout failed: ', e);
            });
        },
        getPrimaryRelativeCaregiverById(context, PrimaryRelativeCaregiverId){
            // If there is already a listener for this query, unsubscribe it
            if(context.state.QUERY_PrimaryRelativeCaregiverById){
                context.state.QUERY_PrimaryRelativeCaregiverById();
            }
            // Set up the new query & listener
            context.state.QUERY_PrimaryRelativeCaregiverById = firebase.firestore().collection('PrimaryRelativeCaregiver').doc(PrimaryRelativeCaregiverId).onSnapshot(function(doc){
                context.state.current_PrimaryRelativeCaregiver = {
                    id: PrimaryRelativeCaregiverId,
                    data: doc.data(),
                }
            });            
        },
        setPrimaryRelativeCaregiverById(context, current_PrimaryRelativeCaregiver){
            firebase.firestore().collection('PrimaryRelativeCaregiver').doc(current_PrimaryRelativeCaregiver.id).set(current_PrimaryRelativeCaregiver.data)
            .then(function() {
                console.log("Document successfully written!");
            })
            .catch(function(error) {
                console.error("Error writing document: ", error);
            });
        },

        getPrimaryRelativeCaregivers(context){
            firebase.firestore().collection('PrimaryRelativeCaregiver').get()
            .then(function(querySnapshot){
                let PrimaryRelativeCaregiverOBJ = {};
                querySnapshot.forEach(function(doc){
                    PrimaryRelativeCaregiverOBJ[doc.id] = doc.data();
                });
                context.state.current_PrimaryRelativeCaregivers=PrimaryRelativeCaregiverOBJ;
            })
            .catch(function(error) {
                console.error("Error retrieving clients: ", error);
            });
        }
    }
})