export const KinshipChildCustodyStatus = {
    title:'Custody Status',
    toolbarTitle:"Custody Status", 
    collectionId:"KinshipChildCustodyStatus",
    icon:"person",
    addIcon:"person_add",
    addButtonText:"Add Status",
    evalFunctions:{
      breadCrumb:'"Custody Status - " + entityId',
      subEntityListDisplayText:'(entityFormFields.CustodyDate||"") + " - " + (entityFormFields.CustodyStatus||"")',
    },
    onDelete:{
      confirmMessage:"Are you sure you want to delete this Custody Status from the Kinship Child?",
      route:"/dashboard",
    },
    formFields:[
        {
            fieldType:'text',
            fieldName:"CustodyDate",
            fieldLabel:"Custody Date",
            rules:[
              "v => !!v || 'Required'",
            ] ,
        },
        {
            fieldType:'text',
            fieldName:"CustodyStatus",
            fieldLabel:"Custody Status",
            rules:[
              "v => !!v || 'Required'",
            ] ,
        },
        {
            fieldType:'text',
            fieldName:"CustodyNotes",
            fieldLabel:"Custody Notes",
            rules:[
              "v => !!v || 'Required'",
            ] ,
        },
    ],
  }
