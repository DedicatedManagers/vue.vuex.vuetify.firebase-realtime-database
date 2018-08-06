<template>
  <v-slide-y-transition mode="out-in">
    <v-container fluid>
        <v-layout row wrap>
          <v-flex xs12 md4>
            <v-card>
              <v-toolbar color="blue" dark>
                <v-toolbar-title>Primary Kinship Caregivers</v-toolbar-title>
              </v-toolbar>
              <v-card-title>
                <v-layout row wrap>
                  <v-flex xs12>
                    <v-list  v-for="(client, id) in clients" :key="id">
                      <v-list-tile  :to="'/db/' + RootEntity.entityType + '/' + id">
                          <v-list-tile-action>
                          <v-icon>{{RootEntity.icon}}</v-icon>
                        </v-list-tile-action>

                        <v-list-tile-content>
                          <v-list-tile-title>{{client.LastName}}, {{client.FirstName}} {{client.MiddleName}}</v-list-tile-title>
                        </v-list-tile-content>
                      </v-list-tile>
                    </v-list>
                    <div class="text-xs-right">
                      <v-btn color="success" @click="addNewClient">{{RootEntity.addButtonText}}<v-icon right>{{RootEntity.addIcon}}</v-icon></v-btn>
                    </div>
                  </v-flex>
                </v-layout>
              </v-card-title>
            </v-card>              
          </v-flex>
        </v-layout>
    </v-container>
  </v-slide-y-transition>
</template>


<script>
import {RootEntity} from '@/../config/Entities/RootEntity.js';

export default {
  name: 'Dashboard',
  data() {
    return {
      RootEntity:RootEntity,
    };
  },
  computed:{
    clients(){
      return this.$store.state.currentPrimaryKinshipCaregivers;
    }
  },
  methods:{
    addNewClient(){
      this.$store.dispatch('fcreateEntity', {docId:'add', collectionId:RootEntity.entityType}).then(createdDocId=>{
          console.log( 'addEntity received: ' + createdDocId  );
          this.$router.push('/db/' + RootEntity.entityType + '/' + createdDocId);
      });
    }
  },
  created(){
    console.log('created function in dashboard.vue');
    this.$store.dispatch('getPrimaryKinshipCaregivers');
  },
};
</script>
 
<style>
</style>
