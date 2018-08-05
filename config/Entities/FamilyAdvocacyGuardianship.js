export const FamilyAdvocacyGuardianship = {
    title:'Guardianship',
    toolbarTitle:"Guardianship", 
    entityType:"FamilyAdvocacyGuardianship",
    icon:"assignment_ind",
    addIcon:"assignment_ind",
    addButtonText:"Add Guardianship",
    breadCrumbFunction:'"Guardianship - " + entityId',
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
              v => !!v || 'Required',
              v => v.length <= 30 || 'Name must be less than 30',
            ] ,
        },
        {
            fieldType:'text',
            fieldName:"PaperworkProvided",
            fieldLabel:"Paperwork Provided",
            rules:[
              v => !!v || 'Required',
              v => v.length <= 30 || 'Name must be less than 30',
            ] ,
        },
    ],
  }
