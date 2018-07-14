<template>
  <v-slide-y-transition mode="out-in">
    <v-container fluid>
        <v-layout row wrap>
          <v-flex xs12>
              <h1>Primary Caregiver</h1>
              <v-form>
                  <v-text-field  v-model="FirstName" label="First Name" required ></v-text-field>
                  <v-text-field  v-model="MiddleName" label="Middle Name" required ></v-text-field>
                  <v-text-field  v-model="LastName" label="Last Name" required ></v-text-field>
                  <v-text-field  v-model="PrimaryStreetAddress" label="Primary Street Address" required ></v-text-field>

                  <v-menu ref="BirthDateMenuRef" :return-value.sync="BirthDate" v-model="BirthDateMenuVisibility" :close-on-content-click="false" :nudge-right="40" lazy transition="scale-transition" offset-y full-width min-width="290px">
                    <v-text-field slot="activator" v-model="BirthDate" label="Birth Date" prepend-icon="event" readonly ></v-text-field>
                    <v-date-picker v-model="BirthDate" @input="$refs.BirthDateMenuRef.save(BirthDate);"></v-date-picker>
                  </v-menu>

                  <v-checkbox v-model="NavigatorProgram" label="Navigator Program"></v-checkbox>


                  <v-select v-model="ClientTypeAtIntake" :items="ClientTypeAtIntakeValues" label="Client Type At Intake" ></v-select>

                  <h2>Related Children</h2>
                  <v-btn class="" @click="addRelatedChild">Add Child</v-btn>
                  

              </v-form>
          </v-flex>
        </v-layout> 

        <v-layout row>
            <v-spacer></v-spacer>
            <v-btn class="error" @click="confirmDialogVisibility=true">Delete Client</v-btn>
            <template v-if="confirmDialogVisibility">
              <dialog-confirm confirmType="error" :confirmVisibilty="confirmDialogVisibility" @confirmAccept="fDelete" @confirmCancel="confirmDialogVisibility=false">
                <template slot="title">Confirm Delete</template>
                <template slot="text">Are you sure you want to delete this client?</template>
                <template slot="confirmButton">Confirm Delete</template>
              </dialog-confirm>
            </template>
        </v-layout> 

    </v-container>
  </v-slide-y-transition>
</template>

<script>
import DialogConfirm from '@/components/shared/DialogConfirm';

export default {
  name: 'PrimaryRelativeCaregiver',
  props:['primaryRelativeCaregiverId'],
  components:{
    'dialog-confirm':DialogConfirm
  },
  data() {
    return {
      componentCollectionId:'PrimaryRelativeCaregiver',
      confirmDialogVisibility:false,
      BirthDateMenuVisibility:false,

      ClientTypeAtIntakeValues:[
        "1- Formal/Licensed",
        "2- Formal/Licensing in progress",
        "3- Formal/Unable to be licensed; blood relative",
        "4- Formal/Unable to be licensed; fictive",
        "5- Informal/Guardianship; blood relative",
        "6- Informal/Guardianship; fictive",
        "7- Informal/Temp guardianship; blood relative",
        "8- Informal/Temp guardianship; fictive",
        "9- Informal/No guardianship; blood relative",
        "10- Informal/No guardianship; fictive",
        "11-Adoptive Parent",
        "12-No Custody",
      ],

    };
  },
  computed:{
    docId: function(){
      return this.primaryRelativeCaregiverId;
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
    NavigatorProgram:{
      get(){
        return this.$store.getters.getCurrentEntityFieldValue({docId:this.docId,collectionId:this.componentCollectionId,fieldName:'NavigatorProgram',});
      },
      set(newValue){
        this.$store.dispatch('update_currentEntity_byEntityPropertyContainer', {docId:this.docId, collectionId:this.componentCollectionId, propertiesObject:{NavigatorProgram: newValue}});
      },
    },
    
    ClientTypeAtIntake:{
      get(){
        return this.$store.getters.getCurrentEntityFieldValue({docId:this.docId,collectionId:this.componentCollectionId,fieldName:'ClientTypeAtIntake',});
      },
      set(newValue){
        this.$store.dispatch('update_currentEntity_byEntityPropertyContainer', {docId:this.docId, collectionId:this.componentCollectionId, propertiesObject:{ClientTypeAtIntake: newValue}});
      },
    },
    


  },
  methods:{
      fDelete(){
        this.confirmDialogVisibility = false;
        this.$store.dispatch('fdelete_Entity_byCollectionId',this.componentCollectionId)
      },
      addRelatedChild(){
        this.$router.push('/PrimaryRelativeCaregiver/' + this.docId + '/RelatedChild/add');
      }
  },
  created(){
    console.log('PrimaryRelativeCaregiver.vue created function: ' + this.docId + this.componentCollectionId);
  },
};
</script>
 
<style>
</style>
