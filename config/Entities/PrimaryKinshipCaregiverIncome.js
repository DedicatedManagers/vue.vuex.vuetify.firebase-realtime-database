export const PrimaryKinshipCaregiverIncome = {
    title:'Income',
    toolbarTitle:"Income", 
    entityType:"PrimaryKinshipCaregiverIncome",
    icon:"monetization_on",
    addIcon:"monetization_on",
    addButtonText:"Add Income",
    breadCrumbFunction:'"Income - " + entityId',
    onDelete:{
      confirmMessage:"Are you sure you want to delete this income from the primary kinship caregiver?",
      route:"/dashboard",
    },
    formFields:[
        {
            fieldType:'text',
            fieldName:"IncomeType",
            fieldLabel:"Income Type",
            rules:[
              v => !!v || 'Required',
              v => v.length <= 30 || 'Name must be less than 30',
            ] ,
        },
        {
            fieldType:'text',
            fieldName:"IncomeAmount",
            fieldLabel:"Income Amount",
            rules:[
              v => !!v || 'Required',
              v => v.length <= 30 || 'Name must be less than 30',
            ] ,
        },
    ],
  }
