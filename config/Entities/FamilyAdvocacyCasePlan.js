import {FamilyAdvocacyGuardianship} from '@/../config/Entities/FamilyAdvocacyGuardianship.js';


export const FamilyAdvocacyCasePlan = {
    title:'Case Plan',
    toolbarTitle:"Case Plan", 
    collectionId:"FamilyAdvocacyCasePlan",
    icon:"import_contacts",
    addIcon:"import_contacts",
    addButtonText:"Add Case Plan",
    evalFunctions:{
      breadCrumb:'"Case Plan - " + entityId',
      subEntityListDisplayText:'"Case Plan Needed: " + (entityFormFields.CommunityConnectionNeeded?"Yes":"No")',
    },
    onDelete:{
      confirmMessage:"Are you sure you want to delete case plan from the primary kinship caregiver?",
      route:"/dashboard",
    },
    formFields:[
      {
        fieldType:'checkbox',
        fieldName:"CommunityConnectionNeeded",
        fieldLabel:"Community Connection Needed",
      },
      {
        fieldType:'checkbox',
        fieldName:"CommunityConnectionAchieved",
        fieldLabel:"Community Connection Achieved",
      },
    ],
    subEntities:{
      FamilyAdvocacyGuardianship:FamilyAdvocacyGuardianship,
    },
  }
