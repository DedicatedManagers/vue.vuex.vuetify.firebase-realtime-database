<template>
  <v-slide-y-transition mode="out-in">
    <v-container fluid>
        <v-layout row wrap>

          <entity-search :searchParams="EntitySearchMyRecent"></entity-search>
          <entity-search :searchParams="EntitySearchAllRecent"></entity-search>
         

        </v-layout>

        <div>
          <v-btn color="success" @click="addNewClient">{{RootEntity.addButtonText}}<v-icon right>{{RootEntity.addIcon}}</v-icon></v-btn>
        </div>
    </v-container>
  </v-slide-y-transition>
</template>


<script>
import EntitySearch from '@/components/shared/EntitySearch.vue';
import {RootEntity} from '@/../config/Entities/RootEntity.js';

export default {
  name: 'Dashboard',
  components:{
    'entity-search':EntitySearch,
  },
  data() {
    return {
      RootEntity:RootEntity,
      EntitySearchMyRecent:{
        collectionId:RootEntity.collectionId,
        where:[{
          fieldName:'CreatedAtUid',
          testOperator:'==',
          testVal:this.$store.state.user.uid,
        }],
        orderBy:[{
          fieldPath:'CreatedAt',
          directionStr:'asc',
        }],
        limit:5, 
        queryId:'myRecent',
        routeBase:'/db/' + RootEntity.collectionId + '/',
        title:"My Recent Caregivers"
      },
      EntitySearchAllRecent:{
        collectionId:RootEntity.collectionId,
        // where:[
        //   {
        //     fieldName:'CreatedAtUid',
        //     testOperator:'>',
        //     testVal:this.$store.state.user.uid,
        //   },
        // ],
        orderBy:[
          // {
          //   fieldPath:'CreatedAtUid',
          //   directionStr:'asc',
          // },
          {
            fieldPath:'CreatedAt',
            directionStr:'asc',
          }
        ],
        limit:5, 
        queryId:'allRecent',
        routeBase:'/db/' + RootEntity.collectionId + '/',
        title:"All Recent Caregivers"
      },
    };
  },
  computed:{
  },
  methods:{
    addNewClient(){
      this.$store.commit('setLoadingIndicator', true);
      this.$store.dispatch('fcreateEntity', {docId:'add', collectionId:RootEntity.collectionId}).then(createdDocId=>{
        console.log( 'addEntity received: ' + createdDocId  );
        this.$router.push('/db/' + RootEntity.collectionId + '/' + createdDocId);
      });
    }
  },
  beforeDestroy(){
    console.log('beforeDestroy function in dashboard.vue');
  },
  destroyed(){
    console.log('destroyed function in dashboard.vue');
  },
  created(){
    //this.$store.commit('deleteAllCurrentEntitesAndListeners');
    //this.$store.commit('setLoadingIndicator', true);
    console.log('created function in dashboard.vue');
  },
};
</script>
 
<style>
</style>
