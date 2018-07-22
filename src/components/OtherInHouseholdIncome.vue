<template>
  <v-slide-y-transition mode="out-in">
    <v-container fluid>
      <v-layout row wrap>
        <v-flex xs12 md4>
          <v-card>
            <v-toolbar color="blue" dark>
              <v-toolbar-title>Kinship Child Income</v-toolbar-title>
            </v-toolbar>
            <v-card-title>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-form>
                    <v-text-field  v-model="IncomeType" label="Income Type" required ></v-text-field>
                    <v-text-field  v-model="IncomeAmount" label="Income Amount" required ></v-text-field>

                    <div class="text-xs-right">
                      <v-btn color="error" @click="confirmDialogVisibility=true">Delete<v-icon right>delete</v-icon></v-btn>
                    </div>
                  </v-form>
                </v-flex>
              </v-layout>
            </v-card-title>
          </v-card> 
        </v-flex>
      </v-layout>

      <template v-if="confirmDialogVisibility">
        <dialog-confirm confirmType="error" :confirmVisibilty="confirmDialogVisibility" @confirmAccept="fDelete" @confirmCancel="confirmDialogVisibility=false">
          <template slot="title">Confirm Delete</template>
          <template slot="text">Are you sure you want to delete this income stream from the child?</template>
          <template slot="confirmButton">Confirm Delete</template>
        </dialog-confirm>
      </template>
    </v-container>
  </v-slide-y-transition>
</template>

<script>
import DialogConfirm from '@/components/shared/DialogConfirm';

export default {
  name: 'OtherInHouseholdIncome',
  props:['primaryKinshipCaregiverId', 'otherInHouseholdId', 'otherInHouseholdIncomeId'],
  components:{
    'dialog-confirm':DialogConfirm
  },
  data() {
    return {
      componentCollectionId:'OtherInHouseholdIncome',
      confirmDialogVisibility:false,
    };
  },
  computed:{
    docId: function(){
      return this.otherInHouseholdIncomeId;
    },
    IncomeType:{
      get(){
        return this.$store.getters.getCurrentEntityFieldValue({docId:this.docId,collectionId:this.componentCollectionId,fieldName:'IncomeType',});
      },
      set(newValue){
        this.$store.dispatch('updateCurrentEntity', {docId:this.docId, collectionId:this.componentCollectionId, propertiesObject:{IncomeType: newValue}});
      },
    },
    IncomeAmount:{
      get(){
        return this.$store.getters.getCurrentEntityFieldValue({docId:this.docId,collectionId:this.componentCollectionId,fieldName:'IncomeAmount',});
      },
      set(newValue){
        this.$store.dispatch('updateCurrentEntity', {docId:this.docId, collectionId:this.componentCollectionId, propertiesObject:{IncomeAmount: newValue}});
      },
    },
  },
  methods:{
      fDelete(){
        this.confirmDialogVisibility = false;
        this.$store.dispatch('fdeleteEntity',{collectionId:this.componentCollectionId,docId:this.docId,route:{to:'/PrimaryKinshipCaregiver/'+this.primaryKinshipCaregiverId+'/OtherInHousehold/'+this.otherInHouseholdId}})
      },
  },
  created(){
    console.log('OtherInHouseholdIncome.vue created function. Props: ' + JSON.stringify(this.$options.propsData));

    // if we are adding a new subEntity then create it
    // - otherwise this entity will get loaded by parent ClientContainer.vue created function
    if(this.otherInHouseholdIncomeId == "add"){
      this.$store.dispatch('getEntity', {docId:this.docId, collectionId:this.componentCollectionId});
    }

    // TODO: Need to implement verification of otherInHouseholdIncomeId 
    // - The parent ClientContainer.vue loads the parent entity and its children
    // - - If the otherInHousehold value is legitimate (not deleted though user saved the link or erroneous value entered in the link) then the otherInHousehold will get loaded
    // - - Otherwise - a blank form gets loaded and the user isn't notified of the issue until trying to type something in one of the fields  & the message is for a deleted entity which is confusing
  },
};
</script>
 
<style>
</style>
