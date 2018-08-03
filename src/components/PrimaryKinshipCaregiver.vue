<template>
  <v-slide-y-transition mode="out-in">
    <v-container fluid>
        <v-layout row wrap>
          <v-flex xs12 sm6 md4 px-1 class="customListExpandable">
            <v-toolbar color="blue" dark @click="PrimaryKinshipCaregiverFormVisiblity=PrimaryKinshipCaregiverFormVisiblity?0:1">
              <v-toolbar-title>Primary Kinship Caregiver</v-toolbar-title><v-spacer></v-spacer><v-btn icon><v-icon >{{PrimaryKinshipCaregiverFormVisiblity?'expand_less':'expand_more'}}</v-icon></v-btn>
            </v-toolbar>
            <v-expansion-panel v-model="PrimaryKinshipCaregiverFormVisiblity">
              <v-expansion-panel-content >
                <v-card >
                  <v-card-text>
                    <v-form ref="profileForm">
                      <div v-for="(FormField, index) in FormFieldsConfig" :key="index">
                        <text-field v-if="FormField.fieldType == 'text'" :fieldName="FormField.fieldName" :fieldLabel="FormField.fieldLabel" :rules="FormField.rules" :componentCollectionId="componentCollectionId" :docId="docId"></text-field>
                        <date-field v-if="FormField.fieldType == 'date'" :fieldName="FormField.fieldName" :fieldLabel="FormField.fieldLabel" :rules="FormField.rules" :componentCollectionId="componentCollectionId" :docId="docId"></date-field>
                        <checkbox-field v-if="FormField.fieldType == 'checkbox'" :fieldName="FormField.fieldName" :fieldLabel="FormField.fieldLabel" :componentCollectionId="componentCollectionId" :docId="docId"></checkbox-field>
                        <select-field v-if="FormField.fieldType == 'select'" :items="FormField.fieldItems" :fieldName="FormField.fieldName" :fieldLabel="FormField.fieldLabel" :componentCollectionId="componentCollectionId" :docId="docId"></select-field>
                      </div>
                      <div class="text-xs-right">
                        <v-btn color="error" @click="confirmDialogVisibility=true">Delete<v-icon right>delete</v-icon></v-btn>
                      </div>
                    </v-form>
                    </v-card-text>
                </v-card> 
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-flex>

          <v-flex xs12 sm6 md4 px-1>

            <v-layout row wrap>
              <v-flex xs12 hidden-sm-and-up>
                &nbsp;
              </v-flex>

              <v-flex xs12>
                <subentity-list 
                  toolbarTitle="Primary Kinship Caregiver Income"  
                  entityType="PrimaryKinshipCaregiverIncome" 
                  :parentCollectionId="this.docId"
                  :parentCollectionType="this.componentCollectionId"
                  :baseUrl="'/PrimaryKinshipCaregiver/'+docId+'/PrimaryKinshipCaregiverIncome/'"
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
                  toolbarTitle="Kinship Children"  
                  entityType="KinshipChild" 
                  :parentCollectionId="this.docId"
                  :parentCollectionType="this.componentCollectionId"
                  :baseUrl="'/PrimaryKinshipCaregiver/'+docId+'/KinshipChild/'"
                  icon="person"
                  addIcon="person_add"
                  addButtonText="Add Child"
                ></subentity-list>
              </v-flex>
              
              <v-flex xs12>
                &nbsp;
              </v-flex>

              <v-flex xs12>
                <subentity-list 
                  toolbarTitle="Others In Household"  
                  entityType="OtherInHousehold" 
                  :parentCollectionId="this.docId"
                  :parentCollectionType="this.componentCollectionId"
                  :baseUrl="'/PrimaryKinshipCaregiver/'+docId+'/OtherInHousehold/'"
                  icon="person"
                  addIcon="person_add"
                  addButtonText="Add Other"
                ></subentity-list>
              </v-flex>


              <v-flex xs12>
                &nbsp;
              </v-flex>

              <v-flex xs12>
                <subentity-list 
                  toolbarTitle="Case Plan"  
                  entityType="FamilyAdvocacyCasePlan" 
                  :parentCollectionId="this.docId"
                  :parentCollectionType="this.componentCollectionId"
                  :baseUrl="'/PrimaryKinshipCaregiver/'+docId+'/FamilyAdvocacyCasePlan/'"
                  icon="import_contacts"
                  addIcon="import_contacts"
                  addButtonText="Add Case Plan"
                ></subentity-list>
              </v-flex>


            </v-layout>
          </v-flex>


          <v-flex xs12 md4 px-1>
              <v-flex xs12 hidden-md-and-up>
                &nbsp;
              </v-flex>

              <v-flex xs12>
                <subentity-list 
                  toolbarTitle="Contacts With Caregiver"  
                  entityType="PrimaryKinshipCaregiverContact" 
                  :parentCollectionId="this.docId"
                  :parentCollectionType="this.componentCollectionId"
                  :baseUrl="'/PrimaryKinshipCaregiver/'+docId+'/PrimaryKinshipCaregiverContact/'"
                  icon="phone"
                  addIcon="phone_forwarded"
                  addButtonText="Add Contact"
                ></subentity-list>
              </v-flex>
          </v-flex>

        </v-layout> 

        <template v-if="confirmDialogVisibility">
          <dialog-confirm confirmType="error" :confirmVisibilty="confirmDialogVisibility" @confirmAccept="fDelete" @confirmCancel="confirmDialogVisibility=false">
            <template slot="title">Confirm Delete</template>
            <template slot="text">Are you sure you want to delete this Primary Kinship Caregiver?</template>
            <template slot="confirmButton">Confirm Delete</template>
          </dialog-confirm> 
        </template>

    </v-container>
  </v-slide-y-transition>


</template>



<script>
import DialogConfirm from '@/components/shared/DialogConfirm';
import SubEntityList from '@/components/shared/SubEntityList';
import FormTextField from '@/components/shared/FormFields/Text';
import FormDateField from '@/components/shared/FormFields/Date';
import FormCheckboxField from '@/components/shared/FormFields/Checkbox';
import FormSelectField from '@/components/shared/FormFields/Select';

export default {
  name: 'PrimaryKinshipCaregiver',
  props:['primaryKinshipCaregiverId'],
  components:{
    'dialog-confirm':DialogConfirm,
    'subentity-list':SubEntityList,
    'text-field':FormTextField,
    'date-field':FormDateField,
    'checkbox-field':FormCheckboxField,
    'select-field':FormSelectField,
  },
  data() {
    return {
      componentCollectionId:'PrimaryKinshipCaregiver',
      confirmDialogVisibility:false,
      PrimaryKinshipCaregiverFormVisiblity:0,
      vitems:1,
      FormFieldsConfig:[
        {
          fieldType:'text',
          fieldName:"FirstName",
          fieldLabel:"First Name",
          rules:[
            v => !!v || 'Required',
            v => v.length <= 30 || 'Name must be less than 30',
          ] ,
        },
        {
          fieldType:'text',
          fieldName:"MiddleName",
          fieldLabel:"Middle Name",
          rules:[
            v => !!v || 'Required',
            v => v.length <= 30 || 'Name must be less than 30',
          ] ,
        },
        {
          fieldType:'text',
          fieldName:"LastName",
          fieldLabel:"Last Name",
          rules:[
            v => !!v || 'Required',
            v => v.length <= 30 || 'Name must be less than 30',
          ] ,
        },
        {
          fieldType:'text',
          fieldName:"PrimaryStreetAddress",
          fieldLabel:"Primary Street Address",
          rules:[
            v => !!v || 'Required',
            v => v.length <= 30 || 'Name must be less than 30',
          ] ,
        },
        {
          fieldType:'date',
          fieldName:"BirthDate",
          fieldLabel:"BirthDate",
          rules:[
            v => !!v || 'Required',
            v => v.length <= 30 || 'Name must be less than 30',
          ] ,
        },
        {
          fieldType:'checkbox',
          fieldName:"NavigatorProgram",
          fieldLabel:"Navigator Program",
        },
        {
          fieldType:'checkbox',
          fieldName:"PresentedID",
          fieldLabel:"Presented ID",
        },
        {
          fieldType:'select',
          fieldName:"ClientTypeAtIntake",
          fieldLabel:"Client Type At Intake",
          fieldItems:[
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
        },
      ],

    };
  },
  computed:{
    docId: function(){
      return this.primaryKinshipCaregiverId;
    },
  },
  methods:{
    fDelete(){
      this.confirmDialogVisibility = false;
      this.$store.dispatch('fdeleteEntity',{collectionId:this.componentCollectionId,docId:this.docId,route:{to:'/dashboard'}})
    },
  },
  created(){
    console.log('PrimaryKinshipCaregiver.vue created function. Props: ' + JSON.stringify(this.$options.propsData));
  },
  mounted(){
    console.log('PrimaryKinshipCaregiver.vue mounted function. Props: ' + JSON.stringify(this.$options.propsData));
    this.$refs.profileForm.validate();
  },
  beforeDestroy(){
    console.log('PrimaryKinshipCaregiver beforeDestroy');
  }  
};
</script>
 
<style>
</style>
