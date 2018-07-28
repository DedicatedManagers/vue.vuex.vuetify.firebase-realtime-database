<template>
    <v-menu ref="searchMenuRef" max-height="400" v-model="searchMenuVisibility" :close-on-content-click="false"  nudge-bottom="10" lazy transition="scale-transition" offset-y full-width min-width="290px">
    <v-text-field slot="activator" @keyup="searchMenuVisibility=true" v-model="searchQuery" label="Search" append-icon="search" single-line hide-details ></v-text-field>
    <ais-index app-id="LJ0K5JZG8G" api-key="e30ecedc21c8c5a61dd7f221dca1429e" index-name="PrimaryKinshipCaregiver" :query="searchQuery">
        <v-list three-line>
        <ais-results>
            <template slot-scope="{ result }">
                <v-list-tile avatar>
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
            <br>No results found for: <br>
            <h1>{{ props.query }}</h1>
        </template>
        </ais-no-results>
    </ais-index>
    </v-menu>
</template>


<script>
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
  },
  methods:{
  },
}
</script>

<style>
.ais-index {background-color:white;}
.ais-index em {background-color:rgb(236, 230, 178);}
</style>