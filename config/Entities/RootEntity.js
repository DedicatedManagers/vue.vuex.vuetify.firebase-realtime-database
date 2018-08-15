import {FamilyAdvocacyCasePlan} from '@/../config/Entities/FamilyAdvocacyCasePlan.js';
import {PrimaryKinshipCaregiverIncome} from '@/../config/Entities/PrimaryKinshipCaregiverIncome.js';
import {KinshipChild} from '@/../config/Entities/KinshipChild.js';
import {OtherInHousehold} from '@/../config/Entities/OtherInHousehold.js';
import {PrimaryKinshipCaregiverContact} from '@/../config/Entities/PrimaryKinshipCaregiverContact.js';


export const RootEntity = {
  collectionId:"PrimaryKinshipCaregiver",
  title:'Primary Kinship Caregiver',
  icon:"person",
  addIcon:"person_add",
  addButtonText:"Add New Client",
  evalFunctions:{
    breadCrumb:'entityFormFields.LastName + ", " + entityFormFields.FirstName + " " + entityFormFields.MiddleName',
    subEntityListDisplayText:'',
  },
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
        "v => !!v || 'Required'",
        "v => v.length <= 30 || 'Name must be less than 30'",
      ] ,
    },
    {
      fieldType:'text',
      fieldName:"MiddleName",
      fieldLabel:"Middle Name",
      rules:[
        "v => !!v || 'Required'",
        "v => v.length <= 30 || 'Name must be less than 30'",
      ] ,
    },
    {
      fieldType:'text',
      fieldName:"LastName",
      fieldLabel:"Last Name",
      rules:[
        "v => !!v || 'Required'",
        "v => v.length <= 30 || 'Name must be less than 30'",
      ] ,
    },
    {
      fieldType:'text',
      fieldName:"PrimaryStreetAddress",
      fieldLabel:"Primary Street Address",
      rules:[
        "v => !!v || 'Required'",
        "v => v.length <= 30 || 'Name must be less than 30'",
      ] ,
    },
    {
      fieldType:'date',
      fieldName:"BirthDate",
      fieldLabel:"BirthDate",
      rules:[
        "v => !!v || 'Required'",
        "v => v.length <= 30 || 'Name must be less than 30'",
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
  subEntities:{
    PrimaryKinshipCaregiverIncome:PrimaryKinshipCaregiverIncome,
    KinshipChild:KinshipChild,
    OtherInHousehold:OtherInHousehold,
    FamilyAdvocacyCasePlan:FamilyAdvocacyCasePlan,
    PrimaryKinshipCaregiverContact:PrimaryKinshipCaregiverContact,
  }
}