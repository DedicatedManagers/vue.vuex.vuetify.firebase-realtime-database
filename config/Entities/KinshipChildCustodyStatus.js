//"parentDocId","docId","DateAdded","CustodyStartDate","CustodyStatus","Notes"


export const KinshipChildCustodyStatus = {
    title:'Custody Status',
    toolbarTitle:"Custody Status", 
    collectionId:"KinshipChildCustodyStatus",
    icon:"person",
    addIcon:"person_add",
    addButtonText:"Add Status",
    evalFunctions:{
      breadCrumb:'"Custody Status - " + entityId',
      subEntityListDisplayText:'(entityFormFields.CustodyStartDate||"") + " - " + (entityFormFields.CustodyStatus||"")',
    },
    onDelete:{
      confirmMessage:"Are you sure you want to delete this Custody Status from the Kinship Child?",
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
          fieldName:"CustodyStartDate",
          fieldLabel:"Custody Start Date",
        },
        {
          fieldType:'select',
          fieldName:"CustodyStatus",
          fieldLabel:"Custody Status",
          fieldItems:[
            "Physical Custody Only",
            "Unlicensed Caregiver: Unable to be Licensed",
            "Unlicensed Relative Caregiver: Working Towards License",
            "Licensed Relative Caregiver",
            "6-Month Temporary Guardianship",
            "Court Ordered Guardianship",
            "Legal Custody (court ordered)",
            "Adoption",
            "Reunification",
            "Disruption",
            "Other",
          ],
        },
        {
            fieldType:'text',
            fieldName:"Notes",
            fieldLabel:"Notes",
        },
    ],
  }
