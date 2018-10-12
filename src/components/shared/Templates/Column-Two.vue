<template>
  <v-slide-y-transition mode="out-in">
    <v-container fluid>
        <v-layout row wrap>
          <v-flex xs12 sm6 md4 px-1 class="customListExpandable">
            <entity-form :entityConfig="entityConfig"></entity-form>
          </v-flex>

          <v-flex xs12 sm6 md4 px-1>

            <v-layout row wrap>
              <v-flex xs12>
                <entity-subtotals :entityConfig="entityConfig"></entity-subtotals>
              </v-flex>

              <v-flex xs12 hidden-sm-and-up>
                &nbsp;
              </v-flex>

              <v-flex xs12 v-for="(subEntityConfig, subEntityIndex) in entityConfig.subEntities" :key="subEntityIndex">
                <subentity-list :entityConfig="entityConfig" :subEntityIndex="subEntityIndex"></subentity-list>
                <v-flex>
                  &nbsp;
                </v-flex>
              </v-flex>


            </v-layout>
          </v-flex>

          <v-flex xs12 md4 px-1>
              <v-flex xs12 hidden-md-and-up>
                &nbsp;
              </v-flex>

          </v-flex>

        </v-layout> 

    </v-container>
  </v-slide-y-transition>


</template>

<script>
import EntitySubtotals from '@/components/shared/EntitySubtotals.vue';
import DialogConfirm from '@/components/shared/DialogConfirm';
import SubEntityList from '@/components/shared/SubEntityList';
import EntityForm from '@/components/shared/EntityForm';

export default {
  name: 'TwoColumnLayout',
  props:['entityConfig'],
  components:{
    'dialog-confirm':DialogConfirm,
    'subentity-list':SubEntityList,
    'entity-form':EntityForm,
    'entity-subtotals':EntitySubtotals,
  },
  data() {
    return {
    };
  },
  computed:{
  },
  methods:{
  },
  created(){
    console.log('two-column.vue created function.');
  },
};
</script>
 
<style>
</style>
