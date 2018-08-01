<template>
  <v-slide-y-transition mode="out-in">
    <v-container fluid>
      <v-layout row wrap>
        <v-flex xs12 md4>
          <v-card>
            <v-toolbar color="blue" dark>
              <v-toolbar-title>Case Plan</v-toolbar-title>
            </v-toolbar>
            <v-card-title>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-form>
                    <v-checkbox v-model="CommunityConnectionNeeded" label="Community Connection Needed"></v-checkbox>
                    <v-checkbox v-model="CommunityConnectionAchieved" label="Community Connection Achieved"></v-checkbox>

                    <div class="text-xs-right">
                      <v-btn color="error" @click="confirmDialogVisibility=true">Delete<v-icon right>delete</v-icon></v-btn>
                    </div>
                  </v-form>
                </v-flex>
              </v-layout>
            </v-card-title>
          </v-card> 
        </v-flex>


       <v-flex xs12 md4 px-1>
        <v-layout row wrap>
          <v-flex xs12 hidden-md-and-up>
            &nbsp;
          </v-flex>

          <v-flex xs12>
            <subentity-list 
              toolbarTitle="Guardianship"  
              entityType="FamilyAdvocacyGuardianship" 
              :parentCollectionId="this.docId"
              :parentCollectionType="this.componentCollectionId"
              :baseUrl="'/PrimaryKinshipCaregiver/'+primaryKinshipCaregiverId+'/FamilyAdvocacyCasePlan/'+docId+'/FamilyAdvocacyGuardianship/'"
              icon="assignment_ind"
              addIcon="assignment_ind"
              addButtonText="Add Guardianship"
            ></subentity-list>
          </v-flex>        
        </v-layout>
      </v-flex>

      </v-layout>

      <template v-if="confirmDialogVisibility">
        <dialog-confirm confirmType="error" :confirmVisibilty="confirmDialogVisibility" @confirmAccept="fDelete" @confirmCancel="confirmDialogVisibility=false">
          <template slot="title">Confirm Delete</template>
          <template slot="text">Are you sure you want to delete this case plan from the primary kinship caregiver?</template>
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
  name: 'FamilyAdvocacyCasePlan',
  props:['primaryKinshipCaregiverId', 'familyAdvocacyCasePlanId'],
  components:{
    'dialog-confirm':DialogConfirm,
    'subentity-list':SubEntityList,
  },
  data() {
    return {
      componentCollectionId:'FamilyAdvocacyCasePlan',
      confirmDialogVisibility:false,
    };
  },
  computed:{
    docId: function(){
      return this.familyAdvocacyCasePlanId;
    },
    CommunityConnectionNeeded:{
      get(){
        return this.$store.getters.getCurrentEntityFieldValue({docId:this.docId,collectionId:this.componentCollectionId,fieldName:'CommunityConnectionNeeded',});
      },
      set(newValue){
        this.$store.dispatch('updateCurrentEntity', {docId:this.docId, collectionId:this.componentCollectionId, propertiesObject:{CommunityConnectionNeeded: newValue}});
      },
    },
    CommunityConnectionAchieved:{
      get(){
        return this.$store.getters.getCurrentEntityFieldValue({docId:this.docId,collectionId:this.componentCollectionId,fieldName:'CommunityConnectionAchieved',});
      },
      set(newValue){
        this.$store.dispatch('updateCurrentEntity', {docId:this.docId, collectionId:this.componentCollectionId, propertiesObject:{CommunityConnectionAchieved: newValue}});
      },
    },
  },
  methods:{
      fDelete(){
        this.confirmDialogVisibility = false;
        this.$store.dispatch('fdeleteEntity',{collectionId:this.componentCollectionId,docId:this.docId,route:{to:'/PrimaryKinshipCaregiver/'+this.primaryKinshipCaregiverId}})
      },
  },
  created(){
    console.log('FamilyAdvocacyCasePlan.vue created function. Props: ' + JSON.stringify(this.$options.propsData));

    // TODO: Need to implement verification of this currnt entity 
    // - The parent ClientContainer.vue loads the parent entity and all its child entities
    // - - If the loaded ID value is legitimate (not deleted though user saved the link or erroneous value entered in the link) then this entity will get loaded
    // - - Otherwise - a blank form gets loaded and the user isn't notified of the issue until trying to type something in one of the fields  & the message is for a deleted entity which is confusing
  },
};
</script>
 
<style>
</style>
