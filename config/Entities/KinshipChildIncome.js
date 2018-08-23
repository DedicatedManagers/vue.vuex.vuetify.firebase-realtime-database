export const KinshipChildIncome = {
    title:'Income',
    toolbarTitle:"Income", 
    collectionId:"KinshipChildIncome",
    icon:"monetization_on",
    addIcon:"monetization_on",
    addButtonText:"Add Income",
    evalFunctions:{
      breadCrumb:'"Income - " + entityId',
      subEntityListDisplayText:'(entityFormFields.IncomeSource||"") + " - $" + (entityFormFields.IncomePerMonth||"" + "/Month")',
    },
    onDelete:{
      confirmMessage:"Are you sure you want to delete this Income from the Kinship Child?",
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
        fieldName:"IncomeSource",
        fieldLabel:"Income Source",
        rules:[
          "v => !!v || 'Required'",
        ] ,
      },
      {
        fieldType:'text',
        fieldName:"IncomePerMonth",
        fieldLabel:"Income / Month",
        rules:[
          "v => !!v || 'Required'",
        ] ,
      },
      {
        fieldType:'text',
        fieldName:"Notes",
        fieldLabel:"Notes",
      },
    ],
  }
