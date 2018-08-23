import {OtherInHouseholdIncome} from '@/../config/Entities/OtherInHouseholdIncome.js';

export const OtherInHousehold = {
    title:'Other In Household',
    toolbarTitle:"Others In Household", 
    collectionId:"OtherInHousehold",
    icon:"person",
    addIcon:"person_add",
    addButtonText:"Add Other",
    evalFunctions:{
        breadCrumb:'entityFormFields.LastName + ", " + entityFormFields.FirstName + " " + (entityFormFields.MiddleName?entityFormFields.MiddleName:"")',
        subEntityListDisplayText:'entityFormFields.LastName + ", " + entityFormFields.FirstName + " " + (entityFormFields.MiddleName?entityFormFields.MiddleName:"")',
    },
    onDelete:{
      confirmMessage:"Are you sure you want to delete this Other Household Member from his/her Primary Kinship Caregiver?",
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
            fieldType:'text',
            fieldName:"Age",
            fieldLabel:"Age (Years)",
            rules:[
                "v => !!v || 'Required'",
            ],
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
            fieldType:'select',
            fieldName:"RelationToCaregiver",
            fieldLabel:"Relation To Caregiver",
            fieldItems:[
              "Daughter/Son",
              "Husband/Wife/Partner",
              "Mother/Father",
              "Sibling",
              "Roommate",
              "Other",
            ],
        },
        {
            fieldType:'text',
            fieldName:"Email",
            fieldLabel:"Email Address",
        },
        {
            fieldType:'text',
            fieldName:"Notes",
            fieldLabel:"Notes",
        },

    ],
    subEntities:{
        OtherInHouseholdIncome:OtherInHouseholdIncome,
    },
}
