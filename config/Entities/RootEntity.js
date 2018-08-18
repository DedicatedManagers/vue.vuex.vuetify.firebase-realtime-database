import {FamilyAdvocacyCasePlan} from '@/../config/Entities/FamilyAdvocacyCasePlan.js';
import {PrimaryKinshipCaregiverIncome} from '@/../config/Entities/PrimaryKinshipCaregiverIncome.js';
import {KinshipChild} from '@/../config/Entities/KinshipChild.js';
import {OtherInHousehold} from '@/../config/Entities/OtherInHousehold.js';
import {PrimaryKinshipCaregiverContact} from '@/../config/Entities/PrimaryKinshipCaregiverContact.js';


//Import Columns:
// "docId","NavigatorProgram","FamilyAdvocacy","DateAdded","FollowUpDate","SpanishFollowUpNeeded","CaseComplete","FirstName","LastName","Gender","Birthdate","PrimaryPhoneNumber","SecondaryPhoneNumber","EmailAddress","StreetAddress1","City","State","Zip Code","ClientTypeAtIntake","Diversion","PrimaryReasonForKinshipCare","SecondaryReasonForKinshipCare","ThirdReasonForKinshipCare","MaritalStatus","HousingType","TransportationType","HasMedicalConditions","MedicalConditions","Ethnicity","PrimaryLanguageSpoken","ReferredBy","ReferralNotes","AttendedDFSKinshipInfoSession","FederalPovertyLevel","Below200FPL","Below275","GrantFundsUsed","HUDSection8Median"

export const RootEntity = {
  collectionId:"PrimaryKinshipCaregiver",
  title:'Primary Kinship Caregiver',
  icon:"person",
  addIcon:"person_add",
  addButtonText:"Add New Client",
  evalFunctions:{
    breadCrumb:'entityFormFields.LastName + ", " + entityFormFields.FirstName + " " + (entityFormFields.MiddleName?entityFormFields.MiddleName:"")',
    subEntityListDisplayText:'',
  },
  onDelete:{
    confirmMessage:"Are you sure you want to delete this Primary Kinship Caregiver?",
    route:"/dashboard",
  },
  formFields:[
    {
      fieldType:'checkbox',
      fieldName:"NavigatorProgram",
      fieldLabel:"Navigator Program",
    },
    {
      fieldType:'checkbox',
      fieldName:"FamilyAdvocacy",
      fieldLabel:"Family Advocacy",
    },
    {
      fieldType:'text',
      fieldName:"DateAdded",
      fieldLabel:"Date Added",
      disabled:true,
    },
    {
      fieldType:'date',
      fieldName:"FollowUpDate",
      fieldLabel:"Follow Up Date",
    },
    {
      fieldType:'checkbox',
      fieldName:"SpanishFollowUpNeeded",
      fieldLabel:"Spanish Follow Up Needed",
    },
    {
      fieldType:'date',
      fieldName:"CaseComplete",
      fieldLabel:"Case Complete",
    },
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
      fieldType:'select',
      fieldName:"Gender",
      fieldLabel:"Gender",
      fieldItems:[
        "M",
        "F",
      ],
    },
    {
      fieldType:'date',
      fieldName:"Birthdate",
      fieldLabel:"BirthDate",
    },
    {
      fieldType:'text',
      fieldName:"PrimaryPhoneNumber",
      fieldLabel:"Primary Phone Number",
      rules:[
        "v => !!v || 'Required'",
      ] ,
    },
    {
      fieldType:'text',
      fieldName:"SecondaryPhoneNumber",
      fieldLabel:"Secondary Phone Number",
    },
    {
      fieldType:'text',
      fieldName:"EmailAddress",
      fieldLabel:"EmailAddress",
      rules:[
        "v => !!v || 'Required'",
      ] ,
    },
    {
      fieldType:'text',
      fieldName:"StreetAddress1",
      fieldLabel:"Street Address",
      rules:[
        "v => !!v || 'Required'",
      ] ,
    },
    {
      fieldType:'text',
      fieldName:"City",
      fieldLabel:"City",
      rules:[
        "v => !!v || 'Required'",
      ] ,
    },
    {
      fieldType:'text',
      fieldName:"State",
      fieldLabel:"State",
      rules:[
        "v => !!v || 'Required'",
      ] ,
    },
    {
      fieldType:'text',
      fieldName:"ZipCode",
      fieldLabel:"ZipCode",
      rules:[
        "v => !!v || 'Required'",
      ] ,
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
    {
      fieldType:'checkbox',
      fieldName:"Diversion",
      fieldLabel:"Diversion?",
    },
    {
      fieldType:'select',
      fieldName:"PrimaryReasonForKinshipCare",
      fieldLabel:"Primary Reason For Kinship Care",
      fieldItems:[
        "Substance Abuse",
        "Mental Health",
        "Domestic Violence",
        "Child Abuse/Neglect",
        "Incarceration",
        "Homelessness",
        "Poverty",
        "Unwillingness to Parent",
        "Death",
        "Military Service",
        "Deportation",
      ],
    },
    {
      fieldType:'select',
      fieldName:"SecondaryReasonForKinshipCare",
      fieldLabel:"Secondary Reason For Kinship Care",
      fieldItems:[
        "Substance Abuse",
        "Mental Health",
        "Domestic Violence",
        "Child Abuse/Neglect",
        "Incarceration",
        "Homelessness",
        "Poverty",
        "Unwillingness to Parent",
        "Death",
        "Military Service",
        "Deportation",
      ],
    },
    {
      fieldType:'select',
      fieldName:"ThirdReasonForKinshipCare",
      fieldLabel:"Third Reason For Kinship Care",
      fieldItems:[
        "Substance Abuse",
        "Mental Health",
        "Domestic Violence",
        "Child Abuse/Neglect",
        "Incarceration",
        "Homelessness",
        "Poverty",
        "Unwillingness to Parent",
        "Death",
        "Military Service",
        "Deportation",
      ],
    },
    {
      fieldType:'select',
      fieldName:"MaritalStatus",
      fieldLabel:"Marital Status",
      fieldItems:[
        "Divorced",
        "Engaged",
        "Married",
        "Partnered",
        "Separated",
        "Single",
        "Widowed",
      ],
    },
    {
      fieldType:'select',
      fieldName:"HousingType",
      fieldLabel:"Housing Type",
      fieldItems:[
        "Friends/Family",
        "Other",
        "Own",
        "Rent",
      ],
    },
    {
      fieldType:'select',
      fieldName:"TransportationType",
      fieldLabel:"Transportation Type",
      fieldItems:[
        "Bus",
        "None",
        "Other",
        "Own vehicle",
        "Rides",
      ],
    },
    {
      fieldType:'checkbox',
      fieldName:"HasMedicalConditions",
      fieldLabel:"Has Medical Conditions",
    },
    {
      fieldType:'text',
      fieldName:"MedicalConditions",
      fieldLabel:"Medical Conditions",
    },
    {
      fieldType:'select',
      fieldName:"Ethnicity",
      fieldLabel:"Ethnicity",
      fieldItems:[
        "A",
        "AA",
        "C",
        "H",
        "NA",
        "PI",
        "2 or more",
        "Decline to answer",
      ],
    },
    {
      fieldType:'select',
      fieldName:"PrimaryLanguageSpoken",
      fieldLabel:"Primary Language Spoken",
      fieldItems:[
        "Chinese",
        "English",
        "English/Spanis",
        "Spanish",
      ],
    },
    {
      fieldType:'select',
      fieldName:"ReferredBy",
      fieldLabel:"Referred By",
      fieldItems:[
        "DFS- FPC",
        "DFS- Kinship Licensing",
        "DFS- CPS",
        "DFS- Permanency",
        "Legal Aid- Family Court Self Help",
        "Legal Aid- Guardianship Clinic",
        "Family Resource Center",
        "211",
        "Internet",
        "FK Client (please note)",
        "Other",
      ],
    },
    {
      fieldType:'text',
      fieldName:"ReferralNotes",
      fieldLabel:"Referral Notes",
    },
    {
      fieldType:'date',
      fieldName:"AttendedDFSKinshipInfoSession",
      fieldLabel:"Attended DFS Kinship InfoSession",
    },
    {
      fieldType:'checkbox',
      fieldName:"FederalPovertyLevel",
      fieldLabel:"Federal Poverty Level",
    },
    {
      fieldType:'checkbox',
      fieldName:"Below200FPL",
      fieldLabel:"Below 200% FPL",
    },
    {
      fieldType:'checkbox',
      fieldName:"Below275",
      fieldLabel:"Below 275 %",
    },
    {
      fieldType:'select',
      fieldName:"GrantFundsUsed",
      fieldLabel:"Grant Funds Used",
      fieldItems:[
        "X",
        "Y",
        "Z",
      ],
    },
    {
      fieldType:'select',
      fieldName:"HUDSection8Median",
      fieldLabel:"HUD Section 8 Median %",
      fieldItems:[
        "30%",
        "50%",
        "80%",
        "100%",
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