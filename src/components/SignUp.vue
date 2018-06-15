<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout row>
        <v-flex xs12 md6 offset-md3>
          <v-form v-model="valid">
            <h1>Create Account</h1>
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
            <v-btn :disabled="!valid" @click="submit">Submit</v-btn>
          </v-form>
          <router-link to="/login">Already Have An Account?</router-link>
        </v-flex>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>


<script>
export default {
  data() {
    return {
      pwHidden:true,
      username:"",
      password:"",
    };
  },
  name: 'Login',
};
</script>


<style>
</style>
