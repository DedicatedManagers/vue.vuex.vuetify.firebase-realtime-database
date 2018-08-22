import {FamilyAdvocacyGuardianship} from '@/../config/Entities/FamilyAdvocacyGuardianship.js';
import {FamilyAdvocacyTanfDetail} from '@/../config/Entities/FamilyAdvocacyTanfDetail.js';


// "parentDocId","docId","CommunityConnectionNeeded","ListReferralsProvided","CommunityAchieved","PreTest","DateAdded","LegalNeeded","LegalGoal","LegalStatus","LegalAchieved","FinancialAssistanceNeeded","TANFStatus","KinshipLicensing","SNAPStatus","SSI","MedicaidStatus","FinancialAchieved","EmotionalSupportNeeded","EmotionalAchieved","PostTest"


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
        fieldType:'text',
        fieldName:"DateAdded",
        fieldLabel:"Date Added",
        disabled:true,
      },
        {
        fieldType:'checkbox',
        fieldName:"CommunityConnectionNeeded",
        fieldLabel:"Community Connection Needed",
      },
      {
        fieldType:'text',
        fieldName:"ListReferralsProvided",
        fieldLabel:"List Referrals Provided",
      },
      {
        fieldType:'checkbox',
        fieldName:"CommunityAchieved",
        fieldLabel:"Community Achieved",
      },
      {
        fieldType:'date',
        fieldName:"PreTest",
        fieldLabel:"Pre-Test (legal, financial, emotional goals only)",
      },
      {
        fieldType:'text',
        fieldName:"LegalNeeded",
        fieldLabel:"Legal Needed?",
      },
      {
        fieldType:'select',
        fieldName:"LegalGoal",
        fieldLabel:"Legal Goal",
        fieldItems:[
          "6-Month Temporary",
          "Legal Guardianship",
          "Licensed Caregiver",
          "Adoption",
          "N/A",
        ],
      },
      {
        fieldType:'select',
        fieldName:"LegalStatus",
        fieldLabel:"Legal Status",
        fieldItems:[
          "In Progress",
          "Granted",
          "Denied",
          "N/A",
        ],
      },
      {
        fieldType:'checkbox',
        fieldName:"LegalAchieved",
        fieldLabel:"Legal Achieved",
      },
      {
        fieldType:'checkbox',
        fieldName:"FinancialAssistanceNeeded",
        fieldLabel:"Financial Assistance Needed?",
      },
      {
        fieldType:'select',
        fieldName:"TANFStatus",
        fieldLabel:"TANFStatus",
        fieldItems:[
          "Approved",
          "Denied",
          "Pending",
          "N/A- Already complete",
          "N/A - Parents in home",
          "N/A- Income",
          "N/A- Fictive",
          "N/A- Child's Income",
          "N/A- Child not a citizen",
          "N/A-Does not wish to cooperate with Child Support",
        ],
      },
      {
        fieldType:'select',
        fieldName:"KinshipLicensing",
        fieldLabel:"Kinship Licensing",
        fieldItems:[
          "Approved",
          "Pending",
          "Denied",
          "N/A- not formal",
          "N/A- not willing",
        ],
      },
      {
        fieldType:'select',
        fieldName:"SNAPStatus",
        fieldLabel:"SNAP Status",
        fieldItems:[
          "Approved",
          "Denied",
          "Pending",
          "N/a",
        ],
      },
      {
        fieldType:'select',
        fieldName:"SSI",
        fieldLabel:"SSI",
        fieldItems:[
          "Approved",
          "Denied",
          "Pending",
          "N/a",
        ],
      },
      {
        fieldType:'select',
        fieldName:"MedicaidStatus",
        fieldLabel:"Medicaid Status",
        fieldItems:[
          "Approved",
          "Denied",
          "Pending",
          "N/A",
        ],
      },
      {
        fieldType:'checkbox',
        fieldName:"FinancialAchieved",
        fieldLabel:"Financial Achieved",
      },
      {
        fieldType:'checkbox',
        fieldName:"EmotionalSupportNeeded",
        fieldLabel:"Emotional Support Needed",
      },
      {
        fieldType:'checkbox',
        fieldName:"EmotionalAchieved",
        fieldLabel:"Emotional Achieved",
      },
      {
        fieldType:'date',
        fieldName:"PostTest",
        fieldLabel:"Post Test (only if pre-test done)",
      },
    ],
    subEntities:{
      FamilyAdvocacyGuardianship:FamilyAdvocacyGuardianship,
      FamilyAdvocacyTanfDetail:FamilyAdvocacyTanfDetail,
    },
  }
