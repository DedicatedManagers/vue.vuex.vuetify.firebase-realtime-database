export const FamilyAdvocacyGuardianship = {
    title:'Guardianship',
    toolbarTitle:"Guardianship", 
    collectionId:"FamilyAdvocacyGuardianship",
    icon:"assignment_ind",
    addIcon:"assignment_ind",
    addButtonText:"Add Guardianship",
    evalFunctions:{
      breadCrumb:'"Guardianship - " + entityId',
      subEntityListDisplayText:'"Guardianship Type: " + entityFormFields.GuardianshipType',
    },
    onDelete:{
      confirmMessage:"Are you sure you want to delete this Guardianship from the Family Advocacy Case Plan?",
      route:"/dashboard",
    },
    formFields:[
        {
            fieldType:'text',
            fieldName:"GuardianshipType",
            fieldLabel:"Guardianship Type",
            rules:[
              "v => !!v || 'Required'",
                ] ,
        },
        {
            fieldType:'text',
            fieldName:"PaperworkProvided",
            fieldLabel:"Paperwork Provided",
            rules:[
              "v => !!v || 'Required'",
            ] ,
        },
    ],
  }
