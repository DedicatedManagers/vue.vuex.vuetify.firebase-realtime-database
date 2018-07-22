<template>
  <v-slide-y-transition mode="out-in">
    <v-container fluid>
      <v-layout row wrap>
        <v-flex xs12 md4>
          <v-card>
            <v-toolbar color="blue" dark>
              <v-toolbar-title>Kinship Child Custody Status</v-toolbar-title>
            </v-toolbar>
            <v-card-title>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-form>
                    <v-text-field  v-model="CustodyDate" label="Custody Date" required ></v-text-field>
                    <v-text-field  v-model="CustodyStatus" label="Custody Status" required ></v-text-field>
                    <v-text-field  v-model="CustodyNotes" label="Notes" required ></v-text-field>

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
          <template slot="text">Are you sure you want to delete this custody status from the child?</template>
          <template slot="confirmButton">Confirm Delete</template>
        </dialog-confirm>
      </template>
    </v-container>
  </v-slide-y-transition>
</template>

<script>
import DialogConfirm from '@/components/shared/DialogConfirm';

export default {
  name: 'KinshipChildCustodyStatus',
  props:['primaryKinshipCaregiverId', 'kinshipChildId', 'kinshipChildCustodyStatusId'],
  components:{
    'dialog-confirm':DialogConfirm
  },
  data() {
    return {
      componentCollectionId:'KinshipChildCustodyStatus',
      confirmDialogVisibility:false,
    };
  },
  computed:{
    docId: function(){
      return this.kinshipChildCustodyStatusId;
    },
    CustodyDate:{
      get(){
        return this.$store.getters.getCurrentEntityFieldValue({docId:this.docId,collectionId:this.componentCollectionId,fieldName:'CustodyDate',});
      },
      set(newValue){
        this.$store.dispatch('updateCurrentEntity', {docId:this.docId, collectionId:this.componentCollectionId, propertiesObject:{CustodyDate: newValue}});
      },
    },
    CustodyStatus:{
      get(){
        return this.$store.getters.getCurrentEntityFieldValue({docId:this.docId,collectionId:this.componentCollectionId,fieldName:'CustodyStatus',});
      },
      set(newValue){
        this.$store.dispatch('updateCurrentEntity', {docId:this.docId, collectionId:this.componentCollectionId, propertiesObject:{CustodyStatus: newValue}});
      },
    },
    CustodyNotes:{
      get(){
        return this.$store.getters.getCurrentEntityFieldValue({docId:this.docId,collectionId:this.componentCollectionId,fieldName:'CustodyNotes',});
      },
      set(newValue){
        this.$store.dispatch('updateCurrentEntity', {docId:this.docId, collectionId:this.componentCollectionId, propertiesObject:{CustodyNotes: newValue}});
      },
    },
  },
  methods:{
      fDelete(){
        this.confirmDialogVisibility = false;
        this.$store.dispatch('fdeleteEntity',{collectionId:this.componentCollectionId,docId:this.docId,route:{to:'/PrimaryKinshipCaregiver/'+this.primaryKinshipCaregiverId+'/KinshipChild/'+this.kinshipChildId}})
      },
  },
  created(){
    console.log('KinshipChildCustodyStatus.vue created function. Props: ' + JSON.stringify(this.$options.propsData));

    // if we are adding a new subEntity then create it
    // - otherwise this entity will get loaded by parent ClientContainer.vue created function
    if(this.kinshipChildCustodyStatusId == "add"){
      this.$store.dispatch('getEntity', {docId:this.docId, collectionId:this.componentCollectionId});
    }

    // TODO: Need to implement verification of kinshipChildCustodyStatusId 
    // - The parent ClientContainer.vue loads the parent entity and its children
    // - - If the kinshipChild value is legitimate (not deleted though user saved the link or erroneous value entered in the link) then the kinshipChild will get loaded
    // - - Otherwise - a blank form gets loaded and the user isn't notified of the issue until trying to type something in one of the fields  & the message is for a deleted entity which is confusing
  },
};
</script>
 
<style>
</style>
