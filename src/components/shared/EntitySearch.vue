<template >
    <v-flex xs12 md4 px-1 v-if="!this.$store.state.loadingIndicator">
        <v-card>
            <v-toolbar color="blue" dark>
            <v-toolbar-title>{{searchParams.title}}</v-toolbar-title>
            </v-toolbar>
            <v-card-title>
            <v-layout row wrap>
                <v-flex xs12>
                    <v-list  v-for="(searchResult, id) in searchResults.results" :key="id">
                        <v-list-tile @click="loadEntity(searchResult.docId)" >
                            <v-list-tile-action>
                            <v-icon>{{RootEntity.icon}}</v-icon>
                        </v-list-tile-action>

                        <v-list-tile-content>
                            <v-list-tile-title>{{searchResult.data.LastName}}, {{searchResult.data.FirstName}} {{searchResult.data.MiddleName}}</v-list-tile-title>
                        </v-list-tile-content>
                        </v-list-tile>
                    </v-list>
                    <div v-if="searchResults.results">
                        <v-btn :disabled="searchResults.disablePrevButton" @click="paginate('backward')">&laquo; Prev</v-btn><v-btn :disabled="searchResults.disableNextButton" @click="paginate('forward')">Next &raquo;</v-btn><br>
                    </div>
                </v-flex>
            </v-layout>
            </v-card-title>
        </v-card>              
    </v-flex>

</template>


<script>
import {RootEntity} from '@/../config/Entities/RootEntity.js';

export default {
  name: 'EntitySearch',
  props:['searchParams'],
  components:{
  },
  data() {
    return {
      RootEntity:RootEntity,
    };
  },
  computed:{
    searchResults(){
        if(!this.$store.state.fsearchEntities) return {};
        if(!this.$store.state.fsearchEntities[this.searchParams.queryId]) return {};
        return this.$store.state.fsearchEntities[this.searchParams.queryId];
    }
  },
  methods:{
      loadEntity(id){
        console.log('EntitySearch. Set loading indicator');
        this.$store.commit('setLoadingIndicator', true);
        this.$nextTick(function () {
            console.log('next tick');
            this.$router.push( this.searchParams.routeBase + id);
        })

      },
      paginate(direction){
        this.searchParams.paginateDirection = direction;
        this.$store.dispatch('getRootEntityRecent',this.searchParams);
         
      }
  },
  created(){
    console.log('created function in EntitySearch.vue');
    // If the search has not yet been initialized for the session - initialize the search
    if(!(this.$store.state.fsearchEntities && this.$store.state.fsearchEntities[this.searchParams.queryId])){
        console.log('running search in EntitySearch.vue');
        this.$store.commit('setLoadingIndicator', true);
        this.$store.dispatch('getRootEntityRecent',this.searchParams);
    }
  },
  mounted(){
  },
}
</script>

<style>
</style>