export const KinshipChildIncome = {
    title:'Income',
    toolbarTitle:"Income", 
    entityType:"KinshipChildIncome",
    icon:"monetization_on",
    addIcon:"monetization_on",
    addButtonText:"Add Income",
    evalFunctions:{
      breadCrumb:'"Income - " + entityId',
      subEntityListDisplayText:'(entityFormFields.IncomeType||"") + " - $" + (entityFormFields.IncomeType||"")',
    },
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
              "v => !!v || 'Required'",
            ] ,
        },
        {
            fieldType:'text',
            fieldName:"IncomeAmount",
            fieldLabel:"Income Amount",
            rules:[
              "v => !!v || 'Required'",
            ] ,
        },
    ],
  }
