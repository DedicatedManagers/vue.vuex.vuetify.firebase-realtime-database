import {OtherInHouseholdIncome} from '@/../config/Entities/OtherInHouseholdIncome.js';

export const OtherInHousehold = {
    title:'Other In Household',
    toolbarTitle:"Others In Household", 
    entityType:"OtherInHousehold",
    icon:"person",
    addIcon:"person_add",
    addButtonText:"Add Other",
    evalFunctions:{
        breadCrumb:'entityFormFields.LastName + ", " + entityFormFields.FirstName + " " + entityFormFields.MiddleName',
        subEntityList:'',
    },
    onDelete:{
      confirmMessage:"Are you sure you want to delete this Other Household Member from his/her Primary Kinship Caregiver?",
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
    ],
    subEntities:{
        OtherInHouseholdIncome:OtherInHouseholdIncome,
    },
}
