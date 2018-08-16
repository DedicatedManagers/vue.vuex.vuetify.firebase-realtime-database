<template>
  <v-slide-y-transition mode="out-in">
    <v-container fluid>
        <v-layout row wrap>
          <v-flex xs12 md4>
            
            Import<br>
            <v-btn @click="importFile">Import File</v-btn>     
          </v-flex>
        </v-layout>
    </v-container>
  </v-slide-y-transition>
</template>


<script>

export default {
  name: 'Dashboard',
  data() {
    return {
        idConversionArray:null,
    };
  },
  computed:{
  },
  methods:{
    importFile(){
        function dispFile(contents) {
            console.log(Papa.parse(contents, {header:true}));
        }
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
        openFile(dispFile);
    }
  },
  created(){
    console.log(Papa.parse("1,2,3,4"));

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
