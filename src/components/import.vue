<template>
  <v-slide-y-transition mode="out-in">
    <v-container fluid>
        <v-layout row wrap>
          <v-flex xs12 md4>
            Import<br>
            <v-select :items="ImportEntityChoices" v-model="ImportEntityChoice" label="Entity Type"></v-select>
            <v-btn @click="importFile">Import File</v-btn>     
          </v-flex>
        </v-layout>
    </v-container>
  </v-slide-y-transition>
</template>

<script>

// NOTES:
//  Entities must be imported from top down (root entity first)
//  All imports must be done in one render - the conversion arrays are renewed with each load, so they won't match up.
//  Do not change import entity type until importing of the previous entity is complete.


import firebase from 'firebase/app';

export default {
  name: 'Dashboard',
  data() {
    return {
        conversionArrays:[],
        ImportEntityChoices:['PrimaryKinshipCaregiver', 'KinshipChild','KinshipChildCustodyStatus','KinshipChildIncome'],
        ImportEntityChoice:"",
        
        ImportEntity:{
            PrimaryKinshipCaregiver:{importCollectionName:"PrimaryKinshipCaregiver",importParentCollectionName:""},
            KinshipChild:{importCollectionName:"KinshipChild",importParentCollectionName:"PrimaryKinshipCaregiver"},
            KinshipChildCustodyStatus:{importCollectionName:"KinshipChildCustodyStatus",importParentCollectionName:"KinshipChild"},
            KinshipChildIncome:{importCollectionName:"KinshipChildIncome",importParentCollectionName:"KinshipChild"},
            PrimaryKinshipCaregiver_Income:{importCollectionName:"PrimaryKinshipCaregiver_Income",importParentCollectionName:"PrimaryKinshipCaregiver"},
        }
    };
  },
  computed:{
  },
  methods:{
    createConversionArray(){
        let conversionArray = [];

        // create array to convert old ids to firestore ids
        for (let i1=0; i1<6000; i1++){
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

            // create the random Id's
            conversionArray[i1] = "";
            for (let i2 = 0; i2 < 20; i2++) {
                conversionArray[i1] += chars.charAt(Math.floor(Math.random() * chars.length));
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

        // create the entity conversion array if not already created
        if (!this.conversionArrays[this.ImportEntity[this.ImportEntityChoice]['importCollectionName']]){
            this.conversionArrays[this.ImportEntity[this.ImportEntityChoice]['importCollectionName']] = this.createConversionArray();
        }
        if (!this.conversionArrays[this.ImportEntity[this.ImportEntityChoice]['importParentCollectionName']]){
            this.conversionArrays[this.ImportEntity[this.ImportEntityChoice]['importParentCollectionName']] = this.createConversionArray();
        }

        let parsedFileContents = Papa.parse(contents, {header:true, skipEmptyLines: true, dynamicTyping:true});

        console.log(parsedFileContents);

        (async () => {
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
                let newDocId = this.conversionArrays[this.ImportEntity[this.ImportEntityChoice]['importCollectionName']][oldDbId];
                console.log(newDocId, this.ImportEntity[this.ImportEntityChoice]['importCollectionName'], oldDbId);
        

                // put the data in entities by firestore docId as key
                let newEntity =  parsedFileContents.data[i];

                // Also tag the entity with the original database id
                newEntity.origDbId = oldDbId;
                
                // Delete the header docId
                delete newEntity.docId;


                // If this is a child of a parent entity
                if(this.ImportEntity[this.ImportEntityChoice]['importParentCollectionName']){
                    // get the original parent id from the parsed file column
                    let oldParentDbId = parsedFileContents.data[i].parentDocId;

                    // add the ParentType & ParentCollectionId
                    newEntity.ParentType = this.ImportEntity[this.ImportEntityChoice]['importParentCollectionName'];
                    newEntity.ParentCollectionId = this.conversionArrays[this.ImportEntity[this.ImportEntityChoice]['importParentCollectionName']][oldParentDbId];

                    // update the parent to know about the new child
                    let NestedCollection = {};
                    NestedCollection[this.ImportEntity[this.ImportEntityChoice]['importCollectionName']] = {};
                    NestedCollection[this.ImportEntity[this.ImportEntityChoice]['importCollectionName']][newDocId] = 1;

                    let NestedCollectionsUpdate = {};
                    NestedCollectionsUpdate['NestedCollections.' + this.ImportEntity[this.ImportEntityChoice]['importCollectionName'] + "." + newDocId] = 1;

                    await firebase.firestore().collection(newEntity.ParentType).doc(newEntity.ParentCollectionId ).update(NestedCollectionsUpdate)
                        .then(function() {    
                            console.log('firestore add call complete. added child to parent with typeID: ' + newEntity.ParentType + newEntity.ParentCollectionId);
                            console.log('NestedCollectionsUpdate');
                            console.log(NestedCollectionsUpdate);
                        })
                        .catch(function(error) {
                            console.error("Error writing document: ", error);
                        });  

                }

                // save the entity to the firestore 
                // - this must come after updating the parent above as the child link to the parent is set within
                await firebase.firestore().collection(this.ImportEntity[this.ImportEntityChoice]['importCollectionName']).doc(newDocId).set(newEntity)
                    .then(function() {    
                        console.log('firestore add call complete. added entity with ID: ' + newDocId);
                    })
                    .catch(function(error) {
                        console.error("Error writing document: ", error);
                    });  
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
