import {KinshipChildIncome} from '@/../config/Entities/KinshipChildIncome.js';
import {KinshipChildCustodyStatus} from '@/../config/Entities/KinshipChildCustodyStatus.js';


//Import Columns:
// "parentDocId","docId","DateAdded","FirstName","LastName","Birthdate","RelationOfCaregiver","FamilySideOfCaregiver","FatherOnBirthCertificate","BioFatherInvolved","BioMotherInvolved","CPSInvolved","Gender","AgeYears"


export const KinshipChild = {
    title:'Kinship Child',
    toolbarTitle:"Kinship Children", 
    collectionId:"KinshipChild",
    icon:"person",
    addIcon:"person_add",
    addButtonText:"Add Child",
    evalFunctions:{
        breadCrumb:'entityFormFields.LastName + ", " + entityFormFields.FirstName + " " + entityFormFields.MiddleName',
        subEntityListDisplayText:'entityFormFields.LastName + ", " + entityFormFields.FirstName + " " + (entityFormFields.MiddleName?entityFormFields.MiddleName:"")',
    },
    onDelete:{
      confirmMessage:"Are you sure you want to delete this Kinship Child from his/her Primary Kinship Caregiver?",
      route:"/dashboard",
    },
    formFields:[
        {
            fieldType:'text',
            fieldName:"DateAdded",
            fieldLabel:"Date Added",
            disabled:true,
        },
        {
            fieldType:'text',
            fieldName:"FirstName",
            fieldLabel:"First Name",
            rules:[
                "v => !!v || 'Required'",
                "v => v.length <= 30 || 'Name must be less than 30'",
            ],
        },
        {
            fieldType:'text',
            fieldName:"MiddleName",
            fieldLabel:"Middle Name",
            rules:[
                "v => v.length <= 30 || 'Name must be less than 30'",
            ],
        },
        {
            fieldType:'text',
            fieldName:"LastName",
            fieldLabel:"Last Name",
            rules:[
                "v => !!v || 'Required'",
                "v => v.length <= 30 || 'Name must be less than 30'",
            ],
        },
        {
            fieldType:'date',
            fieldName:"Birthdate",
            fieldLabel:"BirthDate",
        },
        {
            fieldType:'select',
            fieldName:"RelationOfCaregiver",
            fieldLabel:"Relation Of Caregiver",
            fieldItems:[
              "Grandmother",
              "Grandfather",
              "Aunt",
              "Uncle",
              "Great Aunt",
              "Great Uncle",
              "Great Grandmother",
              "Great Grandfather",
              "Cousin",
              "Sibling",
              "Step-parent",
              "Fictive Kin",
            ],
        },
        {
            fieldType:'select',
            fieldName:"FamilySideOfCaregiver",
            fieldLabel:"Family Side Of Caregiver",
            fieldItems:[
              "Paternal",
              "Maternal",
              "Fictive",
              "Sibling",
            ],
        },
        {
            fieldType:'checkbox',
            fieldName:"FatherOnBirthCertificate",
            fieldLabel:"Father On Birth Certificate",
        },
        {
            fieldType:'checkbox',
            fieldName:"BioFatherInvolved",
            fieldLabel:"Bio Father Involved",
        },
        {
            fieldType:'checkbox',
            fieldName:"BioMotherInvolved",
            fieldLabel:"Bio Mother Involved",
        },
        {
            fieldType:'checkbox',
            fieldName:"CPSInvolved",
            fieldLabel:"CPS Involved",
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
            fieldType:'text',
            fieldName:"AgeYears",
            fieldLabel:"Age (Years)",
            rules:[
                "v => !!v || 'Required'",
            ],
        },
    ],
    subEntities:{
        KinshipChildIncome:KinshipChildIncome,
        KinshipChildCustodyStatus:KinshipChildCustodyStatus,
    },
}
