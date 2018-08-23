export const FamilyAdvocacyTanfDetail = {
    title:'TANF Details',
    toolbarTitle:"TANF Details", 
    collectionId:"FamilyAdvocacyTanfDetail",
    icon:"assignment_ind",
    addIcon:"assignment_ind",
    addButtonText:"Add TANF Detail",
    evalFunctions:{
      breadCrumb:'"TANF Detail - " + entityId',
      subEntityListDisplayText:'"TANF Detail: " + entityFormFields.ApplicationCompleted',
    },
    onDelete:{
      confirmMessage:"Are you sure you want to delete this TANF Detail from the Family Advocacy Case Plan?",
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
        fieldName:"ApplicationCompleted",
        fieldLabel:"Application Completed",
      },
      {
        fieldType:'date',
        fieldName:"ApplicationSubmitted",
        fieldLabel:"ApplicationSubmitted",
      },
      {
        fieldType:'date',
        fieldName:"ApplicationApprovalDenial",
        fieldLabel:"Application Approval Denial",
      },
      {
        fieldType:'text',
        fieldName:"DenialReasons",
        fieldLabel:"Denial Reasons",
      },
      {
        fieldType:'date',
        fieldName:"ResubmitAppeal",
        fieldLabel:"Resubmit Appeal",
      },
      {
        fieldType:'text',
        fieldName:"AppealInfo",
        fieldLabel:"Appeal Info",
      },
      {
        fieldType:'text',
        fieldName:"LocationOfDenial",
        fieldLabel:"Location Of Denial",
      },
      {
        fieldType:'text',
        fieldName:"WorkerName",
        fieldLabel:"Worker Name",
      },
    ],
  }
