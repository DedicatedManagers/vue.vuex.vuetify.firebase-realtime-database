<template>
  <v-slide-y-transition mode="out-in">
    <v-container fluid>
      <v-layout row wrap>
        <v-flex xs12 md4>
          <v-card>
            <v-toolbar color="blue" dark>
              <v-toolbar-title>Related Child</v-toolbar-title>
            </v-toolbar>
            <v-card-title>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-form>
                    <v-text-field  v-model="FirstName" label="First Name" required ></v-text-field>
                    <v-text-field  v-model="MiddleName" label="Middle Name" required ></v-text-field>
                    <v-text-field  v-model="LastName" label="Last Name" required ></v-text-field>
                    <v-text-field  v-model="PrimaryStreetAddress" label="Primary Street Address" required ></v-text-field>

                    <v-menu ref="BirthDateMenuRef" :return-value.sync="BirthDate" v-model="BirthDateMenuVisibility" :close-on-content-click="false" :nudge-right="40" lazy transition="scale-transition" offset-y full-width min-width="290px">
                      <v-text-field slot="activator" v-model="BirthDate" label="Birth Date" prepend-icon="event" readonly ></v-text-field>
                      <v-date-picker v-model="BirthDate" @input="$refs.BirthDateMenuRef.save(BirthDate);"></v-date-picker>
                    </v-menu>

                    <div class="text-xs-right">
                      <v-btn color="error" @click="confirmDialogVisibility=true">Delete<v-icon right>delete</v-icon></v-btn>
                    </div>
                  </v-form>
                </v-flex>
              </v-layout>
            </v-card-title>
          </v-card> 
        </v-flex>

          <v-flex xs12 md4 offset-md1>
            <v-card>
              <v-toolbar color="blue" dark>
                <v-toolbar-title>Incomes</v-toolbar-title>
              </v-toolbar>
              <v-card-title>
                <v-layout row wrap>
                  <v-flex xs12>
                    <v-list v-for="(relatedChildIncome, relatedChildIncomeCollectionId) in relatedChildIncomes" :key="relatedChildIncomeCollectionId" v-if="relatedChildIncome">
                      <v-list-tile  :to="'/PrimaryKinshipCaregiver/'+primaryRelativeCaregiverId+'/RelatedChild/'+relatedChildId+'/RelatedChildIncome/'+relatedChildIncomeCollectionId">
                          <v-list-tile-action>
                          <v-icon>monetization_on</v-icon>
                        </v-list-tile-action>

                        <v-list-tile-content>
                          <v-list-tile-title>{{relatedChildIncome.data.IncomeType}} - {{relatedChildIncome.data.IncomeAmount}}</v-list-tile-title>
                        </v-list-tile-content>
                      </v-list-tile>
                    </v-list>
                    <div class="text-xs-right">
                      <v-btn color="success" @click="addRelatedChildIncome">Add Income<v-icon right>monetization_on</v-icon></v-btn>
                    </div>
                  </v-flex>
                </v-layout>
              </v-card-title>
            </v-card>              
          </v-flex>
      </v-layout>

      <template v-if="confirmDialogVisibility">
        <dialog-confirm confirmType="error" :confirmVisibilty="confirmDialogVisibility" @confirmAccept="fDelete" @confirmCancel="confirmDialogVisibility=false">
          <template slot="title">Confirm Delete</template>
          <template slot="text">Are you sure you want to delete this child?</template>
          <template slot="confirmButton">Confirm Delete</template>
        </dialog-confirm>
      </template>
    </v-container>
  </v-slide-y-transition>
</template>

<script>
import DialogConfirm from '@/components/shared/DialogConfirm';

export default {
  name: 'RelatedChild',
  props:['relatedChildId', 'primaryRelativeCaregiverId'],
  components:{
    'dialog-confirm':DialogConfirm
  },
  data() {
    return {
      componentCollectionId:'RelatedChild',
      confirmDialogVisibility:false,
      BirthDateMenuVisibility:false,
    };
  },
  computed:{
    docId: function(){
      return this.relatedChildId;
    },
    relatedChildIncomes(){
      // if the parent entity has not loaded, return an empty object
      if(!(((((this.$store.state.currentEntity||{})['RelatedChild']||{})[this.relatedChildId]||{}).data||{}).NestedCollections||{}).hasOwnProperty('RelatedChildIncome')) return {};

      // the parent entity has been loaded
      let relatedChildIncomesFiltered = {};
      for(let relatedChildIncomeDocId in this.$store.state.currentEntity['RelatedChild'][this.relatedChildId].data.NestedCollections.RelatedChildIncome){
        // Verify the child entity has been loaded
        if(  ((this.$store.state.currentEntity||{})['RelatedChildIncome']||{}).hasOwnProperty(relatedChildIncomeDocId)  ){
          relatedChildIncomesFiltered[relatedChildIncomeDocId] = this.$store.state.currentEntity['RelatedChildIncome'][relatedChildIncomeDocId];
        }
      }
      return relatedChildIncomesFiltered;
    },
    FirstName:{
      get(){
        return this.$store.getters.getCurrentEntityFieldValue({docId:this.docId,collectionId:this.componentCollectionId,fieldName:'FirstName',});
      },
      set(newValue){
        this.$store.dispatch('update_currentEntity_byEntityPropertyContainer', {docId:this.docId, collectionId:this.componentCollectionId, propertiesObject:{FirstName: newValue}});
      },
    },
    MiddleName:{
      get(){
        return this.$store.getters.getCurrentEntityFieldValue({docId:this.docId,collectionId:this.componentCollectionId,fieldName:'MiddleName',});
      },
      set(newValue){
        this.$store.dispatch('update_currentEntity_byEntityPropertyContainer', {docId:this.docId, collectionId:this.componentCollectionId, propertiesObject:{MiddleName: newValue}});
      },
    },
    LastName:{
      get(){
        return this.$store.getters.getCurrentEntityFieldValue({docId:this.docId,collectionId:this.componentCollectionId,fieldName:'LastName',});
      },
      set(newValue){
        this.$store.dispatch('update_currentEntity_byEntityPropertyContainer', {docId:this.docId, collectionId:this.componentCollectionId, propertiesObject:{LastName: newValue}});
      },
    },
    PrimaryStreetAddress:{
      get(){
        return this.$store.getters.getCurrentEntityFieldValue({docId:this.docId,collectionId:this.componentCollectionId,fieldName:'PrimaryStreetAddress',});
      },
      set(newValue){
        this.$store.dispatch('update_currentEntity_byEntityPropertyContainer', {docId:this.docId, collectionId:this.componentCollectionId, propertiesObject:{PrimaryStreetAddress: newValue}});
      },
    },
    BirthDate:{
      get(){
        return this.$store.getters.getCurrentEntityFieldValue({docId:this.docId,collectionId:this.componentCollectionId,fieldName:'BirthDate',});
      },
      set(newValue){
        this.$store.dispatch('update_currentEntity_byEntityPropertyContainer', {docId:this.docId, collectionId:this.componentCollectionId, propertiesObject:{BirthDate: newValue}});
      },
    },


  },
  methods:{
      fDelete(){
        console.log(this.primaryRelativeCaregiverId);
        this.confirmDialogVisibility = false;
        this.$store.dispatch('fdelete_Entity_byCollectionContainer',{collectionId:this.componentCollectionId,docId:this.docId,route:{to:'/PrimaryKinshipCaregiver/'+this.primaryRelativeCaregiverId}})
      },     
      addRelatedChildIncome(){
        this.$router.push('/PrimaryKinshipCaregiver/' + this.primaryRelativeCaregiverId + '/RelatedChild/' + this.relatedChildId + '/RelatedChildIncome/add');
      }

  },
  created(){
    console.log('RelatedChild.vue created function. Props: ' + JSON.stringify(this.$options.propsData));

    // if we are adding a new subEntity then create it
    // - otherwise this entity will get loaded by parent ClientContainer.vue created function
    if(this.relatedChildId == "add"){
      this.$store.dispatch('getEntity_ByEntityContainer', {docId:this.docId, collectionId:this.componentCollectionId});
    }

    // TODO: Need to implement verification of relatedChildId 
    // - The parent ClientContainer.vue loads the parent entity and its children
    // - - If the relatedChild value is legitimate (not deleted though user saved the link or erroneous value entered in the link) then the relatedChild will get loaded
    // - - Otherwise - a blank form gets loaded and the user isn't notified of the issue until trying to type something in one of the fields  & the message is for a deleted entity which is confusing
  },
};
</script>
 
<style>
</style>
