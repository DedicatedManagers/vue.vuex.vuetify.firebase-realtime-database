export const PrimaryKinshipCaregiverContact = {
    title:'Contacts',
    toolbarTitle:"Contacts With Caregiver", 
    entityType:"PrimaryKinshipCaregiverContact",
    icon:"phone",
    addIcon:"phone_forwarded",
    addButtonText:"Add Contact",
    evalFunctions:{
      breadCrumb:'"Contact - " + entityId',
      subEntityList:'',
    },
    onDelete:{
      confirmMessage:"Are you sure you want to delete this contact from the primary kinship caregiver?",
      route:"/dashboard",
    },
    formFields:[
        {
            fieldType:'text',
            fieldName:"ContactDate",
            fieldLabel:"Contact Date",
            rules:[
              v => !!v || 'Required',
              v => v.length <= 30 || 'Name must be less than 30',
            ] ,
        },
        {
            fieldType:'text',
            fieldName:"ContactType",
            fieldLabel:"Contact Type",
            rules:[
              v => !!v || 'Required',
              v => v.length <= 30 || 'Name must be less than 30',
            ] ,
        },
    ],
  }
