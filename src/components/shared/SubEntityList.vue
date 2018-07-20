<template>

<v-card class="customListExpandable">
    <v-toolbar color="blue" dark  @click="listVisibility=!listVisibility">
    <v-toolbar-title>{{toolbarTitle}}</v-toolbar-title><v-spacer></v-spacer><v-btn v-if="entityList" icon><v-icon >{{listVisibility?'expand_less':'expand_more'}}</v-icon></v-btn>
    </v-toolbar>
    <v-layout row wrap>
        <v-flex xs12>
        <v-list v-if="entityList">
            <v-list-group v-model="listVisibility">
            <v-list-tile  :to="baseUrl+entityListCollectionId" v-for="(entityList, entityListCollectionId) in entityList" :key="entityListCollectionId">
                <v-list-tile-action>
                <v-icon>{{icon}}</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                <v-list-tile-title>{{entityList.data.LastName}}, {{entityList.data.FirstName}} {{entityList.data.MiddleName}}</v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
            </v-list-group>
            <v-list-group :value="!listVisibility">
            <v-list-tile @click="listVisibility=!listVisibility">
                <v-list-tile-action>
                <v-icon>{{icon}}</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                <v-list-tile-title>{{Object.keys(entityList).length}} Hidden (click to show)</v-list-tile-title>
                </v-list-tile-content>                            
            </v-list-tile>
            </v-list-group>
        </v-list>
        <div class="text-xs-right">
            <v-btn color="success" @click="addEntity">{{addButtonText}}<v-icon right>{{addIcon}}</v-icon></v-btn>
        </div>
        </v-flex>
    </v-layout>
</v-card>              

</template>


<script>
export default {
  name: 'SubEntityList',
  props:['entityList','baseUrl','toolbarTitle','icon','addIcon','addButtonText'],
  data() {
    return {
        listVisibility:true,
    };
  },
  computed:{
  },
  methods:{
    addEntity(){
    this.$router.push(this.baseUrl + "add");
    },
  },
}
</script>