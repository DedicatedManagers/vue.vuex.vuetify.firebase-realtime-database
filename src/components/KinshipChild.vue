<template>
  <v-slide-y-transition mode="out-in">
    <v-container fluid>
      <v-layout row wrap>
        <v-flex xs12 md4>
          <v-card>
            <v-toolbar color="blue" dark>
              <v-toolbar-title>Kinship Child</v-toolbar-title>
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
            <v-layout row wrap>
              <v-flex xs12 hidden-md-and-up>
                &nbsp;
              </v-flex>

              <v-flex xs12>
                <subentity-list 
                  toolbarTitle="Incomes"  
                  entityType="KinshipChildIncome" 
                  :parentCollectionId="this.docId"
                  :baseUrl="'/PrimaryKinshipCaregiver/'+primaryKinshipCaregiverId+'/KinshipChild/'+kinshipChildId+'/KinshipChildIncome/'"
                  icon="monetization_on"
                  addIcon="monetization_on"
                  addButtonText="Add Income"
                ></subentity-list>
              </v-flex>              

              <v-flex xs12>
                &nbsp;
              </v-flex>

              <v-flex xs12>
                <subentity-list 
                  toolbarTitle="Kinship Custody Status"  
                  entityType="KinshipChildCustodyStatus" 
                  :parentCollectionId="this.docId"
                  :baseUrl="'/PrimaryKinshipCaregiver/'+primaryKinshipCaregiverId+'/KinshipChild/'+kinshipChildId+'/KinshipChildCustodyStatus/'"
                  icon="person"
                  addIcon="person_add"
                  addButtonText="Add Status"
                ></subentity-list>
              </v-flex>              
            </v-layout>
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
import SubEntityList from '@/components/shared/SubEntityList';

export default {
  name: 'KinshipChild',
  props:['kinshipChildId', 'primaryKinshipCaregiverId'],
  components:{
    'dialog-confirm':DialogConfirm,
    'subentity-list':SubEntityList,
  },
  data() {
    return {
      componentCollectionId:'KinshipChild',
      confirmDialogVisibility:false,
      BirthDateMenuVisibility:false,
    };
  },
  computed:{
    docId: function(){
      return this.kinshipChildId;
    },
    FirstName:{
      get(){
        return this.$store.getters.getCurrentEntityFieldValue({docId:this.docId,collectionId:this.componentCollectionId,fieldName:'FirstName',});
      },
      set(newValue){
        this.$store.dispatch('updateCurrentEntity', {docId:this.docId, collectionId:this.componentCollectionId, propertiesObject:{FirstName: newValue}});
      },
    },
    MiddleName:{
      get(){
        return this.$store.getters.getCurrentEntityFieldValue({docId:this.docId,collectionId:this.componentCollectionId,fieldName:'MiddleName',});
      },
      set(newValue){
        this.$store.dispatch('updateCurrentEntity', {docId:this.docId, collectionId:this.componentCollectionId, propertiesObject:{MiddleName: newValue}});
      },
    },
    LastName:{
      get(){
        return this.$store.getters.getCurrentEntityFieldValue({docId:this.docId,collectionId:this.componentCollectionId,fieldName:'LastName',});
      },
      set(newValue){
        this.$store.dispatch('updateCurrentEntity', {docId:this.docId, collectionId:this.componentCollectionId, propertiesObject:{LastName: newValue}});
      },
    },
    PrimaryStreetAddress:{
      get(){
        return this.$store.getters.getCurrentEntityFieldValue({docId:this.docId,collectionId:this.componentCollectionId,fieldName:'PrimaryStreetAddress',});
      },
      set(newValue){
        this.$store.dispatch('updateCurrentEntity', {docId:this.docId, collectionId:this.componentCollectionId, propertiesObject:{PrimaryStreetAddress: newValue}});
      },
    },
    BirthDate:{
      get(){
        return this.$store.getters.getCurrentEntityFieldValue({docId:this.docId,collectionId:this.componentCollectionId,fieldName:'BirthDate',});
      },
      set(newValue){
        this.$store.dispatch('updateCurrentEntity', {docId:this.docId, collectionId:this.componentCollectionId, propertiesObject:{BirthDate: newValue}});
      },
    },


  },
  methods:{
      fDelete(){
        this.confirmDialogVisibility = false;
        this.$store.dispatch('fdeleteEntity',{collectionId:this.componentCollectionId,docId:this.docId,route:{to:'/PrimaryKinshipCaregiver/'+this.primaryKinshipCaregiverId}})
      },     
      addKinshipChildIncome(){
        this.$router.push('/PrimaryKinshipCaregiver/' + this.primaryKinshipCaregiverId + '/KinshipChild/' + this.kinshipChildId + '/KinshipChildIncome/add');
      }

  },
  created(){
    console.log('KinshipChild.vue created function. Props: ' + JSON.stringify(this.$options.propsData));

    // if we are adding a new subEntity then create it
    // - otherwise this entity will get loaded by parent ClientContainer.vue created function
    if(this.docId == "add"){
      this.$store.dispatch('getEntity', {docId:this.docId, collectionId:this.componentCollectionId});
    }

    // TODO: Need to implement verification of kinshipChildId 
    // - The parent ClientContainer.vue loads the parent entity and its children
    // - - If the kinshipChild value is legitimate (not deleted though user saved the link or erroneous value entered in the link) then the kinshipChild will get loaded
    // - - Otherwise - a blank form gets loaded and the user isn't notified of the issue until trying to type something in one of the fields  & the message is for a deleted entity which is confusing
  },
};
</script>
 
<style>
</style>
