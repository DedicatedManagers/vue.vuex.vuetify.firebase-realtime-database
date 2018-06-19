<template>
  <v-slide-y-transition mode="out-in">
    <v-container fluid>
      <v-layout row wrap>
        <v-flex xs12>
          <h1>Dashboard</h1>
        </v-flex>
        <v-flex xs12 v-if="clients">
          <div v-for="(client, id) in clients" :key="id">
            <div>
              <router-link :to="'/client/'+id">{{client.LastName}}, {{client.FirstName}} {{client.MiddleName}}</router-link>
            </div>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </v-slide-y-transition>
</template>


<script>
export default {
  name: 'Dashboard',
  data() {
    return {
    };
  },
  computed:{
    clients(){
      return this.$store.state.current_PrimaryRelativeCaregivers;
    }
  },
  created(){
    console.log('created function in dashboard.vue');
    this.$store.dispatch('getPrimaryRelativeCaregivers');
  },
};
</script>
 
<style>
</style>
