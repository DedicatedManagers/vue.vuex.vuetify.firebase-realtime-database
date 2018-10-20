<template>
    <div>
        <br>
        <v-layout row wrap>
            <v-flex xs12 md4 offset-md1>
                <v-list>
                    <v-list-tile>
                       <v-text-field @keyup="searchMenuVisibility=true" v-model="searchQuery" label="Search" append-icon="search" single-line hide-details ></v-text-field>
                    </v-list-tile>
                    <v-list-tile>
                       Fields to Search (<a @click="setSearch('all')">All</a> &nbsp; or &nbsp; <a @click="setSearch('none')">None</a>):
                    </v-list-tile>
                    <v-list-tile v-for="(fieldToSearch,index) in fieldsToSearchConfig" :key="index">
                        <v-list-tile-content>
                            <v-switch :label="fieldToSearch.label" v-model="fieldsToSearch" :value="fieldToSearch.fieldName"></v-switch>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list>
            </v-flex>
            <v-flex xs12 md5 offset-md1>
                <ais-index :query-parameters="queryParameters" :app-id="algoliaCredentials.appId" :cache="false" :api-key="algoliaCredentials.apiKey" :index-name="algoliaCredentials.indexName1" :query="searchQuery">
                    <v-list three-line>
                    <ais-results>
                        <template slot-scope="{ result }">
                            <v-list-tile avatar :to="'/db/PrimaryKinshipCaregiver/'+result.objectID">
                                <v-list-tile-avatar>
                                    <v-icon>person</v-icon>
                                </v-list-tile-avatar>
                                <v-list-tile-content>
                                    <v-list-tile-title>
                                        <ais-highlight :result="result" attribute-name="LastName"></ais-highlight>,&nbsp;
                                        <ais-highlight :result="result" attribute-name="FirstName"></ais-highlight>&nbsp;
                                    </v-list-tile-title>
                                    <v-list-tile-sub-title>
                                        <ais-highlight :result="result" attribute-name="StreetAddress1"></ais-highlight>&nbsp;
                                        <ais-highlight :result="result" attribute-name="City"></ais-highlight>,&nbsp;
                                        <ais-highlight :result="result" attribute-name="State"></ais-highlight>&nbsp;
                                        <ais-highlight :result="result" attribute-name="ZipCode"></ais-highlight><br>
                                        <ais-highlight :result="result" attribute-name="PrimaryPhoneNumber"></ais-highlight><br>
                                        <ais-highlight :result="result" attribute-name="SecondaryPhoneNumber"></ais-highlight><br>
                                    </v-list-tile-sub-title>
                                </v-list-tile-content>
                            </v-list-tile>                
                        </template>
                    </ais-results>
                    <ais-pagination></ais-pagination>
                    </v-list>
                    <ais-no-results>
                        <template slot-scope="props">
                            <v-alert type="error" :value="true">
                                No results found.
                            </v-alert>
                        </template>
                    </ais-no-results>
                </ais-index>
            </v-flex>
        </v-layout>

 
    </div>
</template>


<script>
import credentials from '@/../config/credentials';

export default {
  name: 'SearchBox',
  props:[],
  data() {
    return {
      searchQuery:"",
      searchMenuVisibility:false,
      fieldsToSearch:[],
      fieldsToSearchConfig:[
        {label:"First Name", fieldName:"FirstName",},
        {label:"Last Name", fieldName:"LastName",},
        {label:"Street Address", fieldName:"StreetAddress1",},
        {label:"City", fieldName:"City",},
        {label:"State", fieldName:"State",},
        {label:"ZipCode", fieldName:"ZipCode",},
        {label:"PrimaryPhoneNumber", fieldName:"PrimaryPhoneNumber",},
      ]
    };
  },
  computed:{
      algoliaCredentials(){
          return credentials.algolia;
      },
      queryParameters(){
          return {
            restrictSearchableAttributes: this.fieldsToSearch
          }
      }
  },
  methods:{
    setSearch(type){
        if (type=="all"){
            this.fieldsToSearch = [];
            for (let fieldToSearch of this.fieldsToSearchConfig){
                this.fieldsToSearch.push(fieldToSearch.fieldName)
            }
        }
        if (type=="none"){
            this.fieldsToSearch = [];
        }

    }
  },
  created(){
      for (let fieldToSearch of this.fieldsToSearchConfig){
          this.fieldsToSearch.push(fieldToSearch.fieldName)
      }
  },
}
</script>

<style>
.ais-index {background-color:white;}
.ais-index em {background-color:rgb(236, 230, 178);}


ul.ais-pagination li {display:inline;}
ul.ais-pagination li a {text-decoration:none;}
</style>