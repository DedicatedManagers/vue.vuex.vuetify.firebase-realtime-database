// "parentDocId","docId","DateAdded","DateGiven","TypeOfAssistance","AssistanceCategory","Value","ResourceProvided","ReceiptReceived","Notes"

export const PrimaryKinshipCaregiverFundsDispersed = {
    title:'FK Funds & Resources Dispersed',
    toolbarTitle:"FK Funds & Resources Dispersed", 
    collectionId:"PrimaryKinshipCaregiverFundsDispersed",
    icon:"monetization_on",
    addIcon:"monetization_on",
    addButtonText:"Add Funds Dispersed",
    evalFunctions:{
      breadCrumb:'"Dispersed Detail - " + entityId',
      subEntityListDisplayText:'entityFormFields.TypeOfAssistance +" - " + entityFormFields.Value',
    },
    onDelete:{
      confirmMessage:"Are you sure you want to delete this Funds Dispersed Detail from the Primary Kinship Caregiver",
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
        fieldType:'date',
        fieldName:"DateGiven",
        fieldLabel:"Date Given",
      },
      {
        fieldType:'select',
        fieldName:"TypeOfAssistance",
        fieldLabel:"Type Of Assistance",
        fieldItems:[
          "Cash",
          "Debit/Credit Card",
          "Check",
          "Gift Card",
          "Hard Goods",
        ],
      },            
      {
        fieldType:'select',
        fieldName:"AssistanceCategory",
        fieldLabel:"Assistance Category",
        fieldItems:[
          "Birth Certificates",
          "Food",
          "Housing",
          "Clothing",
          "Hygiene",
          "Safety Items",
          "Bed/Crib",
          "Furniture",
          "Car Seat",
          "Legal Forms",
          "Transportation",
          "Utilities",
          "Rent",
          "School Supplies",
          "Books/Toys",
          "Holiday",
          "Other",
        ],
      },
      {
        fieldType:'text',
        fieldName:"Value",
        fieldLabel:"Value",
      },
      {
        fieldType:'text',
        fieldName:"ResourceProvided",
        fieldLabel:"Resource Provided",
      },
      {
        fieldType:'select',
        fieldName:"ReceiptReceived",
        fieldLabel:"Receipt Received?",
        fieldItems:[
          "Yes",
          "No",
          "N/A",
        ],
      },            
      {
        fieldType:'text',
        fieldName:"Notes",
        fieldLabel:"Notes",
      },
    ],
  }
