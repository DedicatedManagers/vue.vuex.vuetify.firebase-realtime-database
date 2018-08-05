export const KinshipChildIncome = {
    title:'Income',
    toolbarTitle:"Income", 
    entityType:"KinshipChildIncome",
    icon:"monetization_on",
    addIcon:"monetization_on",
    addButtonText:"Add Income",
    breadCrumbFunction:'"Income - " + entityId',
    onDelete:{
      confirmMessage:"Are you sure you want to delete this Income from the Kinship Child?",
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
