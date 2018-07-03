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

                  <v-menu ref="BirthDateMenuRef" :return-value.sync="BirthDateLocal" v-model="BirthDateMenuVisibility" :close-on-content-click="false" :nudge-right="40" lazy transition="scale-transition" offset-y full-width min-width="290px">
                    <v-text-field slot="activator" v-model="BirthDateLocal" label="Birth Date" prepend-icon="event" readonly ></v-text-field>
                    <v-date-picker v-model="BirthDateLocal" @input="$refs.BirthDateMenuRef.save(BirthDateLocal);"></v-date-picker>
                  </v-menu>

                  <v-checkbox v-model="NavigatorProgram" label="Navigator Program"></v-checkbox>


                  <v-select v-model="ClientTypeAtIntake" :items="ClientTypeAtIntakeValues" label="Client Type At Intake" ></v-select>

                  

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
import firebase from 'firebase/app';
import DialogConfirm from '@/components/shared/DialogConfirm';

export default {
  name: 'Client',
  props:['clientId'],
  components:{
    'dialog-confirm':DialogConfirm
  },
  data() {
    return {
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
    FirstName:{
      get(){
        return this.$store.state.currentPrimaryRelativeCaregiver?this.$store.state.currentPrimaryRelativeCaregiver.data.FirstName:"";
      },
      set(newValue){
        this.$store.dispatch('update_currentPrimaryRelativeCaregiver_byObject', {FirstName: newValue});
      },
    },
    MiddleName:{
      get(){
        return this.$store.state.currentPrimaryRelativeCaregiver?this.$store.state.currentPrimaryRelativeCaregiver.data.MiddleName:"";
      },
      set(newValue){
        this.$store.dispatch('update_currentPrimaryRelativeCaregiver_byObject', {MiddleName: newValue});
      },
    },
    LastName:{
      get(){
        return this.$store.state.currentPrimaryRelativeCaregiver?this.$store.state.currentPrimaryRelativeCaregiver.data.LastName:"";
      },
      set(newValue){
        this.$store.dispatch('update_currentPrimaryRelativeCaregiver_byObject', {LastName: newValue});
      },
    },
    PrimaryStreetAddress:{
      get(){
        return this.$store.state.currentPrimaryRelativeCaregiver?this.$store.state.currentPrimaryRelativeCaregiver.data.PrimaryStreetAddress:"";
      },
      set(newValue){
        this.$store.dispatch('update_currentPrimaryRelativeCaregiver_byObject', {PrimaryStreetAddress: newValue});
      },
    },
    BirthDateLocal:{
      get(){
        return this.$store.state.currentPrimaryRelativeCaregiver?this.$store.state.currentPrimaryRelativeCaregiver.data.BirthDate:null;
      },
      set(newValue){
        this.$store.dispatch('update_currentPrimaryRelativeCaregiver_byObject', {BirthDate: newValue});
      },
    },
    NavigatorProgram:{
      get(){
        return this.$store.state.currentPrimaryRelativeCaregiver?this.$store.state.currentPrimaryRelativeCaregiver.data.NavigatorProgram:null;
      },
      set(newValue){
        this.$store.dispatch('update_currentPrimaryRelativeCaregiver_byObject', {NavigatorProgram: newValue});
      },
    },
    
    ClientTypeAtIntake:{
      get(){
        return this.$store.state.currentPrimaryRelativeCaregiver?this.$store.state.currentPrimaryRelativeCaregiver.data.ClientTypeAtIntake:null;
      },
      set(newValue){
        this.$store.dispatch('update_currentPrimaryRelativeCaregiver_byObject', {ClientTypeAtIntake: newValue});
      },
    },
    


  },
  methods:{
      fDelete(){
        this.confirmDialogVisibility = false;
        this.$store.dispatch('fdelete_PrimaryRelativeCaregiverById')
      },
  },
  created(){
    this.$store.dispatch('getPrimaryRelativeCaregiverById', this.clientId);
  },
};
</script>
 
<style>
</style>
