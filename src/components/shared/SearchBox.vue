<template>
    <v-menu ref="searchMenuRef" max-height="400" v-model="searchMenuVisibility" :close-on-content-click="false"  nudge-bottom="10" lazy transition="scale-transition" offset-y full-width min-width="290px">
        <v-text-field slot="activator" @keyup="searchMenuVisibility=true" v-model="searchQuery" label="Quick Search" append-icon="search" single-line hide-details ></v-text-field>
        <v-layout row wrap>
            <v-flex xs6>
                <ais-index :app-id="algoliaCredentials.appId" :api-key="algoliaCredentials.apiKey" :index-name="algoliaCredentials.indexName1" :query="searchQuery">
                    <v-list three-line subheader>
                    <v-subheader>Kinship Caregivers</v-subheader>
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
                                <ais-highlight :result="result" attribute-name="MiddleName"></ais-highlight>
                                </v-list-tile-title>
                                <v-list-tile-sub-title>
                                <ais-highlight :result="result" attribute-name="PrimaryStreetAddress"></ais-highlight>
                                </v-list-tile-sub-title>
                                <v-list-tile-sub-title>
                                <ais-highlight :result="result" attribute-name="PrimaryStreetAddress"></ais-highlight>
                                </v-list-tile-sub-title>
                            </v-list-tile-content>
                            </v-list-tile>                
                        </template>
                    </ais-results>
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
            <v-flex xs6>
                <ais-index :app-id="algoliaCredentials.appId" :api-key="algoliaCredentials.apiKey" :index-name="algoliaCredentials.indexName2" :query="searchQuery">
                    <v-list three-line subheader>
                    <v-subheader>Kinship Children</v-subheader>
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
                                <ais-highlight :result="result" attribute-name="MiddleName"></ais-highlight>
                                </v-list-tile-title>
                                <v-list-tile-sub-title>
                                <ais-highlight :result="result" attribute-name="PrimaryStreetAddress"></ais-highlight>
                                </v-list-tile-sub-title>
                                <v-list-tile-sub-title>
                                <ais-highlight :result="result" attribute-name="PrimaryStreetAddress"></ais-highlight>
                                </v-list-tile-sub-title>
                            </v-list-tile-content>
                            </v-list-tile>                
                        </template>
                    </ais-results>
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
    </v-menu>
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
    };
  },
  computed:{
      algoliaCredentials(){
          return credentials.algolia;
      }
  },
  methods:{
  },
}
</script>

<style>
.ais-index {background-color:white;}
.ais-index em {background-color:rgb(236, 230, 178);}
</style>