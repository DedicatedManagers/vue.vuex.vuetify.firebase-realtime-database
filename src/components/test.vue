<template>
  <v-slide-y-transition mode="out-in">
    <v-container fluid>
        <v-layout row wrap>
          <v-flex xs12 md4>
              {{DbPath}}<br><br>
              {{entities}}<br><br>
              {{entities.length}}<br><br>

          </v-flex>
        </v-layout>
    </v-container>
  </v-slide-y-transition>
</template>


<script>
import {RootEntity} from '@/../config/Entities/RootEntity.js';

export default {
  name: 'Dashboard',
  props:['DbPath'],
  data() {
    return {
    };
  },
  computed:{
    entities:function(){
//        this.DbPath = this.DbPath 
        let Entities = [];
        function findEntity(urlString){
            let matches = urlString.match(/^(\w+)\/([A-Za-z0-9]{20})(?=\/|$)\/?(.*)/);  // looking for pattern: EntityName/EntityId 
            if(matches){
                Entities.push({collectionId:matches[1], docId:matches[2]});
                findEntity(matches[3]);
            }
        }
        findEntity(this.DbPath);

        return Entities;
    },
  },
  methods:{
  },
  created(){
    console.log('created function in test.vue');
  },
};
</script>
 
<style>
</style>
