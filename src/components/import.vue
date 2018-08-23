<template>
  <v-slide-y-transition mode="out-in">
    <v-container fluid>
        <v-layout row wrap>
          <v-flex xs12>
            Import<br>
            <v-radio-group v-model="ImportEntityChoice" >
                <v-radio :label="Key" :value="Key"  v-for="(ImportEntityChoiceLoop, Key) in ImportEntity" :key="Key"></v-radio>
            </v-radio-group>
            <v-btn @click="importFile">Import File</v-btn><br>
            <br>
            <v-btn @click="fCommit">Commit To Firebase</v-btn><br>
            <br>
            IMPORT NOTES:<br>
                * Within the imported files: <br>
                &nbsp; &nbsp; ^ File type is csv (comma separated variables)<br>
                &nbsp; &nbsp; ^ Entity id column should be named "docId"<br>
                &nbsp; &nbsp; &nbsp; &nbsp; ^ Example Header Row: "docId","DateAdded","FirstName","LastName",<br>
                &nbsp; &nbsp; ^ Parent entity column (if nested entity) should be named "parentDocId"<br>
                &nbsp; &nbsp; &nbsp; &nbsp; ^ Example Header Row: "parentDocId","docId","DateAdded","FirstName","LastName",<br>
                * Entities must be imported from top down (root entity first)<br>
                * Import will fail if child entity is imported and referenced parent id is not found (ie data needs to be verified)
                * All imports must be done in one render<br>
                * Entity Names in "ImportEntity" object (this code) should match the Config>>Entities "collectionId" within the file for the object
                &nbsp; &nbsp; ^ Do save project file or hot reload will rerender<br>
                &nbsp; &nbsp; ^ The conversion arrays are renewed with each load, so firebase docId's won't match up.<br>
                * Do not run next entity type import until importing of the previous entity is complete.(see dugger/console for output) <br>
                <br>
          </v-flex>
        </v-layout>
    </v-container>
  </v-slide-y-transition>
</template>

<script>



import firebase from 'firebase/app';

export default {
    name: 'Dashboard',
    data() {
        return {
            conversionArrays:[],
            databaseEntities:[],
            ImportEntityChoice:"",

            ImportEntity:{
                // PrimaryKinshipCaregiver: "docId","NavigatorProgram","FamilyAdvocacy","DateAdded","FollowUpDate","SpanishFollowUpNeeded","CaseComplete","FirstName","LastName","Gender","Birthdate","PrimaryPhoneNumber","SecondaryPhoneNumber","EmailAddress","StreetAddress1","City","State","ZipCode","ClientTypeAtIntake","Diversion","PrimaryReasonForKinshipCare","SecondaryReasonForKinshipCare","ThirdReasonForKinshipCare","MaritalStatus","HousingType","TransportationType","HasMedicalConditions","MedicalConditions","Ethnicity","PrimaryLanguageSpoken","ReferredBy","ReferralNotes","AttendedDFSKinshipInfoSession","FederalPovertyLevel","Below200FPL","Below275","GrantFundsUsed","HUDSection8Median"
                '1. PrimaryKinshipCaregiver':{importCollectionName:"PrimaryKinshipCaregiver",importParentCollectionName:""},
                // PrimaryKinshipCaregiverIncome: "parentDocId","docId","DateAdded","IncomeSource","IncomePerMonth","Notes"
                '1.1 PrimaryKinshipCaregiverIncome':{importCollectionName:"PrimaryKinshipCaregiverIncome",importParentCollectionName:"PrimaryKinshipCaregiver"},
                // OtherInHousehold: "parentDocId","docId","DateAdded","FirstName","LastName","Birthdate","Age","Gender","RelationToCaregiver","Email","Notes"
                '1.2 PrimaryKinshipCaregiverOtherInhousehold':{importCollectionName:"OtherInHousehold",importParentCollectionName:"PrimaryKinshipCaregiver"},
                // OtherInHouseholdIncome: "parentDocId","docId","DateAdded","IncomeSource","IncomePerMonth","Notes"
                '1.2.1 PrimaryKinshipCaregiverOtherInhouseholdIncome':{importCollectionName:"OtherInHouseholdIncome",importParentCollectionName:"OtherInHousehold"},
                // PrimaryKinshipCaregiverContact: "parentDocId","docId","DateAdded","ContactDate","ContactLocation","ContactType","ContactNotes","FosterKinshipEmployee","TimeSpentMinutes"
                '1.3 PrimaryKinshipCaregiverContact':{importCollectionName:"PrimaryKinshipCaregiverContact",importParentCollectionName:"PrimaryKinshipCaregiver"},
                // FamilyAdvocacyCasePlan: "parentDocId","docId","CommunityConnectionNeeded","ListReferralsProvided","CommunityAchieved","PreTest","DateAdded","LegalNeeded","LegalGoal","LegalStatus","LegalAchieved","FinancialAssistanceNeeded","TANFStatus","KinshipLicensing","SNAPStatus","SSI","MedicaidStatus","FinancialAchieved","EmotionalSupportNeeded","EmotionalAchieved","PostTest"
                '1.4 PrimaryKinshipCaregiverFamilyAdvocacyCasePlan':{importCollectionName:"FamilyAdvocacyCasePlan",importParentCollectionName:"PrimaryKinshipCaregiver"},
                // "parentDocId","GuardianshipAdoptionType","docId","DateAdded","PaperworkProvided","PaperworkCompleted","PaperworkSubmitted","CourtDate"
                '1.4.1 PrimaryKinshipCaregiverFamilyAdvocacyCasePlanFamilyAdvocacyGuardianship':{importCollectionName:"FamilyAdvocacyGuardianship",importParentCollectionName:"FamilyAdvocacyCasePlan"},
                // FamilyAdvocacyTanfDetail: "parentDocId","docId","DateAdded","ApplicationCompleted","ApplicationSubmitted","ApplicationApprovalDenial","DenialReasons","ResubmitAppeal","AppealInfo","LocationOfDenial","WorkerName"
                '1.4.2 PrimaryKinshipCaregiverFamilyAdvocacyCasePlanFamilyAdvocacyTanfDetail':{importCollectionName:"FamilyAdvocacyTanfDetail",importParentCollectionName:"FamilyAdvocacyCasePlan"},
                // PrimaryKinshipCaregiverFundsDispersed: "parentDocId","docId","DateAdded","DateGiven","TypeOfAssistance","AssistanceCategory","Value","ResourceProvided","ReceiptReceived","Notes"
                '1.5 PrimaryKinshipCaregiverFundsDispersed':{importCollectionName:"PrimaryKinshipCaregiverFundsDispersed",importParentCollectionName:"PrimaryKinshipCaregiver"},
                // KinshipChild: "parentDocId","docId","DateAdded","FirstName","LastName","Birthdate","RelationOfCaregiver","FamilySideOfCaregiver","FatherOnBirthCertificate","BioFatherInvolved","BioMotherInvolved","CPSInvolved","Gender","AgeYears"
                '1.6 KinshipChild':{importCollectionName:"KinshipChild",importParentCollectionName:"PrimaryKinshipCaregiver"},
                // KinshipChildIncome: "parentDocId","docId","DateAdded","IncomeSource","IncomePerMonth","Notes"
                '1.6.1 KinshipChildIncome':{importCollectionName:"KinshipChildIncome",importParentCollectionName:"KinshipChild"},
                // KinshipChildCustodyStatus: "parentDocId","docId","DateAdded","CustodyStartDate","CustodyStatus","Notes"
                '1.6.2 KinshipChildCustodyStatus':{importCollectionName:"KinshipChildCustodyStatus",importParentCollectionName:"KinshipChild"},
            }
        };
    },
    computed:{
    },
    methods:{
        createConversionArray(dataArray){
            let conversionArray = {};

            // create array to convert old ids to firestore ids
            for (let key  of Object.keys(dataArray)){
                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

                // create the random Id's
                conversionArray[dataArray[key].docId] = "";
                for (let i2 = 0; i2 < 20; i2++) {
                    conversionArray[dataArray[key].docId] += chars.charAt(Math.floor(Math.random() * chars.length));
                }
            }
            return conversionArray;     
        },
        importFile(){
            function clickElem(elem) {
                // Thx user1601638 on Stack Overflow (6/6/2018 - https://stackoverflow.com/questions/13405129/javascript-create-and-save-file )
                var eventMouse = document.createEvent("MouseEvents")
                eventMouse.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
                elem.dispatchEvent(eventMouse)
            }
            function openFile(func) {
                var readFile = function(e) {
                    var file = e.target.files[0];
                    if (!file) {
                        return;
                    }
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        var contents = e.target.result;
                        fileInput.func(contents)
                        document.body.removeChild(fileInput)
                    }
                    reader.readAsText(file)
                }
                var fileInput = document.createElement("input")
                fileInput.type='file'
                fileInput.style.display='none'
                fileInput.onchange=readFile
                fileInput.func=func
                document.body.appendChild(fileInput)
                console.log(fileInput);
                clickElem(fileInput)
            }
            openFile(this.parseFile);
        },
        parseFile(contents) {
            console.log(contents);

            let currentImportCollectionName = this.ImportEntity[this.ImportEntityChoice]['importCollectionName'];
            let currentImportParentCollectionName = this.ImportEntity[this.ImportEntityChoice]['importParentCollectionName'];

            let parsedFileContents = Papa.parse(contents, {header:true, skipEmptyLines: true, dynamicTyping:true});

            console.log(parsedFileContents);
            
            // create the entity conversion array if not already created
            if (!this.conversionArrays[currentImportCollectionName]){
                this.conversionArrays[currentImportCollectionName] = this.createConversionArray(parsedFileContents.data);
            }

            console.log(this.conversionArrays[currentImportCollectionName]);


            // Loop over the parsed database entries and give them a new firestore style docId
            for(let i=0; i<parsedFileContents.data.length; i++){

                // get the original database ID
                let oldDbId = parsedFileContents.data[i].docId;

                // get the data object of the original database entry
                let oldDatabaseData = parsedFileContents.data[i];

                // refactor any date data types
                const monthsConversionArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']; // TODO - need to verify this is the month strings used
                for (let oldKey in oldDatabaseData){

                    // convert month from obvibase format (Jun 01, 2018) to Vuetify format (2018-06-01)
                    if (typeof oldDatabaseData[oldKey] === "string"){
                        let matches = oldDatabaseData[oldKey].match(/^(\w\w\w) (\d\d?), (\d\d\d\d)$/);
                        if(matches){
                            let month = monthsConversionArray.indexOf(matches[1]) + 1;
                            month = month.toString().padStart(2, '0');

                            let day = matches[2].toString().padStart(2, '0');
                            let year = matches[3].toString();

                            let date = year + "-" + month + "-" + day;

                            // change the date format on the parsedFileContents
                            oldDatabaseData[oldKey] = date;

                        }
                    }
                }


                // get the converted ID
                let newDocId = this.conversionArrays[currentImportCollectionName][oldDbId];
                console.log(newDocId, currentImportCollectionName, oldDbId);


                // put the data in entities by firestore docId as key
                let newEntity =  parsedFileContents.data[i];

                // Also tag the entity with the original database id
                newEntity.origDbId = oldDbId;
                
                // Delete the header docId 
                delete newEntity.docId;

                let oldParentDbId = "";

                // If this is a child of a parent entity
                if(currentImportParentCollectionName){
                    // get the original parent id from the parsed file column
                    oldParentDbId = parsedFileContents.data[i].parentDocId;

                    // add the ParentType & ParentCollectionId
                    newEntity.ParentType = currentImportParentCollectionName;
                    newEntity.ParentCollectionId = this.conversionArrays[currentImportParentCollectionName][oldParentDbId];

                    // Also tag the entity with the original database id
                    newEntity.origParentDbId = oldParentDbId;

                    // Delete the header parentDocId 
                    delete newEntity.parentDocId;

                }

                console.log('saving entity' , currentImportCollectionName, newDocId);
                // save the entity  
                // - this must come after updating the parent above as the child link to the parent is set within
                if(!this.databaseEntities[currentImportCollectionName]) 
                this.databaseEntities[currentImportCollectionName] = {};
                if(!this.databaseEntities[currentImportCollectionName][newDocId]) 
                this.databaseEntities[currentImportCollectionName][newDocId] = newEntity;


                // If this is a child of a parent entity
                // - update the parent entity with the child info
                if(currentImportParentCollectionName){
                    console.log('updating parent entity', newEntity.ParentType, newEntity.ParentCollectionId)
                    if(!this.databaseEntities[newEntity.ParentType][newEntity.ParentCollectionId].NestedCollections) 
                        this.databaseEntities[newEntity.ParentType][newEntity.ParentCollectionId].NestedCollections = {};
                    if(!this.databaseEntities[newEntity.ParentType][newEntity.ParentCollectionId].NestedCollections[currentImportCollectionName]) 
                        this.databaseEntities[newEntity.ParentType][newEntity.ParentCollectionId].NestedCollections[currentImportCollectionName] = {};
                    if(!this.databaseEntities[newEntity.ParentType][newEntity.ParentCollectionId].NestedCollections[currentImportCollectionName][newDocId]) 
                        this.databaseEntities[newEntity.ParentType][newEntity.ParentCollectionId].NestedCollections[currentImportCollectionName][newDocId] = 1;
                }



            }


            console.log('databaseEntities');
            console.log(this.databaseEntities);


        },
        fCommit(){
            (async () => {
                for (let collectionName in this.databaseEntities){
                    console.log('collectionName',collectionName);
                    for (let docId in this.databaseEntities[collectionName]){
                        console.log('docId', docId);
                        await firebase.firestore().collection(collectionName).doc(docId).set(this.databaseEntities[collectionName][docId])
                            .then(function() {    
                                console.log('firestore add call complete. added entity' , collectionName ,  docId);
                            })
                            .catch(function(error) {
                                console.error("Error writing document: ", error);
                            });  
                    }
                }
            })(); // immediately invoked async arrow function
        }

    },
    created(){
        //console.log(this.PrimaryKinshipCaregiver_ID_ConversionArray);
    },
};
</script>
 
<style>
</style>
