<template>
  <v-slide-y-transition mode="out-in">
    <v-container fluid>
        <v-layout row wrap>
          <v-flex xs12 md4>
            Import<br>
            <v-select :items="ImportParentCollectionTypes" v-model="ImportParentCollectionId" label="Parent Collection Id"></v-select>
            <v-select :items="ImportCollectionTypes" v-model="ImportCollectionId"  label="Collection Id"></v-select>
            <v-btn @click="importFile">Import File</v-btn>     
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
        ImportCollectionTypes:['PrimaryKinshipCaregiver', 'KinshipChild'],
        ImportParentCollectionTypes:['','PrimaryKinshipCaregiver', 'KinshipChild'],
        ImportCollectionId:"",
        ImportParentCollectionId:"",
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
        if (!this.conversionArrays[this.ImportCollectionId]){
            this.conversionArrays[this.ImportCollectionId] = this.createConversionArray();
        }
        if (!this.conversionArrays[this.ImportParentCollectionId]){
            this.conversionArrays[this.ImportParentCollectionId] = this.createConversionArray();
        }

        let parsedFileContents = Papa.parse(contents, {header:true, skipEmptyLines: true, dynamicTyping:true});

        console.log(parsedFileContents);

        (async () => {
            let entities = {};
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
                        let matches = oldDatabaseData[oldKey].match(/^(\w\w\w) (\d\d), (\d\d\d\d)$/);
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
                let newDocId = this.conversionArrays[this.ImportCollectionId][oldDbId];
                console.log(newDocId, this.ImportCollectionId, oldDbId);
        

                // put the data in entities by firestore docId as key
                entities[newDocId] =  parsedFileContents.data[i];

                // Also tag the entity with the original database id
                entities[newDocId].origDbId = oldDbId;
                
                // Delete the header docId
                delete entities[newDocId].docId;

                if(this.ImportParentCollectionId){
                    // get the original parent id from the parsed file column
                    let oldParentDbId = parsedFileContents.data[i].parentDocId;

                    // add the ParentType & ParentCollectionId
                    entities[newDocId].ParentType = this.ImportParentCollectionId;
                    entities[newDocId].ParentCollectionId = this.conversionArrays[this.ImportParentCollectionId][oldParentDbId];

                    // TODO: update the parent's to know about the new child
                    let NestedCollection = {};
                    NestedCollection[this.ImportCollectionId] = {};
                    NestedCollection[this.ImportCollectionId][newDocId] = 1;

                    let NestedCollectionsUpdate = {};
                    NestedCollectionsUpdate['NestedCollections.' + this.ImportCollectionId + "." + newDocId] = 1;

                    await firebase.firestore().collection(entities[newDocId].ParentType).doc(entities[newDocId].ParentCollectionId ).update(NestedCollectionsUpdate)
                        .then(function() {    
                            console.log('firestore add call complete. added child to parent with typeID: ' + entities[newDocId].ParentType + entities[newDocId].ParentCollectionId);
                            console.log('NestedCollectionsUpdate');
                            console.log(NestedCollectionsUpdate);
                        })
                        .catch(function(error) {
                            console.error("Error writing document: ", error);
                        });  

                }
            }
            console.log(entities);

            // loop over entities and commit to firestore (waiting for each commit to complete)
            for (let entityDocId in entities) {
                console.log(entityDocId);
                console.log(entities[entityDocId]);

                await firebase.firestore().collection(this.ImportCollectionId).doc(entityDocId).set(entities[entityDocId])
                    .then(function() {    
                        console.log('firestore add call complete. added entity with ID: ' + entityDocId);
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
