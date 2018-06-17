<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout row>
        <v-flex xs12>
            <h1>Client</h1>
            <v-form>
                <v-text-field
                v-model="name"
                label="Name"
                required
                ></v-text-field>
                <v-btn
                @click="submit"
                >
                submit
                </v-btn>
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
  methods:{
      submit(){
        firebase.database().ref('names/').set({
            Name:this.name,
        }).then(snapshot=>{
            console.log(snapshot);
        }).catch(e=>{
            console.log(e);
        })
      }
  }
};
</script>
 
<style>
</style>
