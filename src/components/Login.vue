<template>
  <v-slide-y-transition mode="out-in">
    <v-container fluid>
      <v-layout row wrap>
        <v-flex xs12 md6 offset-md3>
          <v-form v-model="valid" v-on:submit.prevent="onSubmit">
            <h1>Sign In</h1>
            <v-text-field v-model="username" label="User Name"></v-text-field>
            <v-text-field
              v-model="password"
              :append-icon="pwHidden ? 'visibility' : 'visibility_off'"
              :append-icon-cb="() => (pwHidden = !pwHidden)"
              :type="pwHidden ? 'password' : 'text'"
              name="input-10-1"
              label="Enter your password"
              hint="At least 8 characters"
              min="8"
              counter
            ></v-text-field>
            <v-btn :disabled="!valid" @click.prevent="signin" type="submit">Sign In</v-btn>
          </v-form>
        </v-flex>
      </v-layout>
    </v-container>
  </v-slide-y-transition>
</template>


<script>
import firebase from 'firebase/app';
import router from '@/router';

export default {
  name: 'Login',
  data() {
    return {
      pwHidden:true,
      username:"",
      password:"",
      valid:false,
    };
  },
  methods:{
    signin:function(){ 
      this.$store.dispatch('login', {
        username: this.username,
        password: this.password
      });
    }
  }
};
</script>


<style>
</style>
