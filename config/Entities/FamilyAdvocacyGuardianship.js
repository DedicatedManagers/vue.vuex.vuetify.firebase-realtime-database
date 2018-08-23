export const FamilyAdvocacyGuardianship = {
    title:'Guardianship',
    toolbarTitle:"Guardianship", 
    collectionId:"FamilyAdvocacyGuardianship",
    icon:"assignment_ind",
    addIcon:"assignment_ind",
    addButtonText:"Add Guardianship",
    evalFunctions:{
      breadCrumb:'"Guardianship - " + entityId',
      subEntityListDisplayText:'"Guardianship Type: " + entityFormFields.GuardianshipAdoptionType',
    },
    onDelete:{
      confirmMessage:"Are you sure you want to delete this Guardianship from the Family Advocacy Case Plan?",
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
        fieldType:'select',
        fieldName:"GuardianshipAdoptionType",
        fieldLabel:"Guardianship/Adoption Type",
        fieldItems:[
          "Consent",
          "No-Consent",
        ],
      },
      {
        fieldType:'date',
        fieldName:"PaperworkProvided",
        fieldLabel:"Paperwork Provided",
      },
      {
        fieldType:'date',
        fieldName:"PaperworkCompleted",
        fieldLabel:"Paperwork Completed",
      },
      {
        fieldType:'date',
        fieldName:"PaperworkSubmitted",
        fieldLabel:"Paperwork Submitted",
      },
      {
        fieldType:'date',
        fieldName:"CourtDate",
        fieldLabel:"Court Date",
      },
    ],
  }
