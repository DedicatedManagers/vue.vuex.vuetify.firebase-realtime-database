export const PrimaryKinshipCaregiverIncome = {
    title:'Income',
    toolbarTitle:"Income", 
    collectionId:"PrimaryKinshipCaregiverIncome",
    icon:"monetization_on",
    addIcon:"monetization_on",
    addButtonText:"Add Income",
    evalFunctions:{
      breadCrumb:'"Income - " + entityId',
      subEntityListDisplayText:'(entityFormFields.IncomeSource||"") + " - $" + (entityFormFields.IncomePerMonth||"" + "/Month")',
    },
    onDelete:{
      confirmMessage:"Are you sure you want to delete this income from the primary kinship caregiver?",
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
          "v => !/ /.test(v) || 'Check for and remove errant spaces'",
          "v => /^[0-9]*\.?[0-9]+$/.test(v) || 'Only numbers are allowed'",
        ] ,
        subTotals:['houseHoldIncome'],
      },
      {
        fieldType:'text',
        fieldName:"Notes",
        fieldLabel:"Notes",
      },
    ],
  }
