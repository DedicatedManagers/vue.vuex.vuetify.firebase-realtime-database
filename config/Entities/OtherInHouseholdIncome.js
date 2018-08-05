export const OtherInHouseholdIncome = {
    title:'Income',
    toolbarTitle:"Income", 
    entityType:"OtherInHouseholdIncome",
    icon:"monetization_on",
    addIcon:"monetization_on",
    addButtonText:"Add Income",
    evalFunctions:{
      breadCrumb:'"Income - " + entityId',
      subEntityListDisplayText:'(entityFormFields.IncomeType||"") + " - $" + (entityFormFields.IncomeType||"")',
    },
    onDelete:{
      confirmMessage:"Are you sure you want to delete this Income from the Other In Household?",
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
