<template>
  <v-slide-y-transition mode="out-in">
    <v-container fluid>
        <v-layout row wrap>
          <v-flex xs12 sm6 md4 px-1 class="customListExpandable">
            <entity-form :entityConfig="entityConfig"></entity-form>
          </v-flex>

          <v-flex xs12 sm6 md4 px-1>

            <v-layout row wrap>
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
import SubEntityList from '@/components/shared/SubEntityList';
import EntityForm from '@/components/shared/EntityForm';

export default {
  name: 'PrimaryKinshipCaregiver',
  props:['primaryKinshipCaregiverId'],
  components:{
    'subentity-list':SubEntityList,
    'entity-form':EntityForm,
  },
  data() {
    return {
      componentCollectionId:'PrimaryKinshipCaregiver',
    }
  },
  computed:{
    docId: function(){
      return this.primaryKinshipCaregiverId;
    },
    entityConfig:function(){
      return {
        collectionId:this.componentCollectionId,
        docId:this.docId,
        title:'Primary Kinship Caregiver',
        onDelete:{
          confirmMessage:"Are you sure you want to delete this Primary Kinship Caregiver?",
          route:"/dashboard",
        },
        formFields:[
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
        subEntities:[
          {
            toolbarTitle:"Primary Kinship Caregiver Income", 
            entityType:"PrimaryKinshipCaregiverIncome",
            baseUrl:'/PrimaryKinshipCaregiver/'+this.docId+'/PrimaryKinshipCaregiverIncome/',
            icon:"monetization_on",
            addIcon:"monetization_on",
            addButtonText:"Add Income",
          },
          {
            toolbarTitle:"Kinship Children", 
            entityType:"KinshipChild",
            baseUrl:'/PrimaryKinshipCaregiver/'+this.docId+'/KinshipChild/',
            icon:"person",
            addIcon:"person_add",
            addButtonText:"Add Child",
          },
           {
            toolbarTitle:"Others In Household", 
            entityType:"OtherInHousehold",
            baseUrl:'/PrimaryKinshipCaregiver/'+this.docId+'/OtherInHousehold/',
            icon:"person",
            addIcon:"person_add",
            addButtonText:"Add Other",
          },
          {
            toolbarTitle:"Case Plan", 
            entityType:"FamilyAdvocacyCasePlan",
            baseUrl:'/PrimaryKinshipCaregiver/'+this.docId+'/FamilyAdvocacyCasePlan/',
            icon:"import_contacts",
            addIcon:"import_contacts",
            addButtonText:"Add Case Plan",
          },
          {
            toolbarTitle:"Contacts With Caregiver", 
            entityType:"PrimaryKinshipCaregiverContact",
            baseUrl:'/PrimaryKinshipCaregiver/'+this.docId+'/PrimaryKinshipCaregiverContact/',
            icon:"phone",
            addIcon:"phone_forwarded",
            addButtonText:"Add Contact",
          },
        ]
      }
    }
  },
  methods:{
  },
  created(){
    console.log('PrimaryKinshipCaregiver.vue created function. Props: ' + JSON.stringify(this.$options.propsData));
  },
  mounted(){
    console.log('PrimaryKinshipCaregiver.vue mounted function. Props: ' + JSON.stringify(this.$options.propsData));
  },
  beforeDestroy(){
    console.log('PrimaryKinshipCaregiver beforeDestroy');
  }  
};
</script>
 
<style>
</style>
