<template>
  <v-slide-y-transition mode="out-in">
    <v-container fluid>
        <v-layout row wrap>
          <v-flex xs12 md4>
            Import<br>
            <v-text-field v-model="ImportCollectionId" label="Collection Id"></v-text-field>
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
        idConversionArray:null,
        ImportCollectionId:"PrimaryKinshipCaregiver",
    };
  },
  computed:{
  },
  methods:{
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
        let parsedFileContents = Papa.parse(contents, {header:true, skipEmptyLines: true, dynamicTyping:true});

        let entities = {};
        // Loop over the parsed database entries and give them a new firestore style docId
        for(let i=0; i<parsedFileContents.data.length; i++){
            let oldDbId = parsedFileContents.data[i].docId;

            // refactor any date data types
            let oldDatabaseData = parsedFileContents.data[i];
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

            // put the data in entities by firestore docId as key
            entities[this.idConversionArray[oldDbId]] =  parsedFileContents.data[i];

            // Also tag the entity with the original database id
            entities[this.idConversionArray[oldDbId]].origDbId = oldDbId;
            
            // Delete the header docId
            delete entities[this.idConversionArray[oldDbId]].docId;
        }
        console.log(entities);

        // loop over entities and commit to firestore (waiting for each commit to complete)
        (async () => {
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

    // create array to convert old ids to firestore ids
    this.idConversionArray = [];
    for (let i1=0; i1<4000; i1++){
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let autoId = '';
        for (let i2 = 0; i2 < 20; i2++) {
            autoId += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        this.idConversionArray[i1] = autoId;
    }
    //console.log(this.idConversionArray);
  },
};
</script>
 
<style>
</style>
