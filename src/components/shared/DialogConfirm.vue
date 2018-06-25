<template>
    <v-layout row justify-center>
        <v-dialog v-model="confirmVisibilty" persistent max-width="290">
        <v-card>
            <v-card-title :class="classType" :style="styleType"><slot name="title"></slot></v-card-title>
            <v-card-text><slot name="text"></slot></v-card-text>
            <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat @click="confirmCancel">Cancel</v-btn>
            <v-btn :color="confirmButtonColor" flat @click="confirmAccept"><slot name="confirmButton"></slot></v-btn>
            </v-card-actions>
        </v-card>
        </v-dialog>
    </v-layout>
</template>


<script>
export default {
  name: 'DialogConfirm',
  props:['confirmType', 'confirmVisibilty'],
  data() {
    return {
      deleteClientConfirmationModalVisiblity:false,
    };
  },
  computed:{
      classType(){
          if(this.confirmType=="error"){
            return "error headline";
          }
      },
      styleType(){
          if(this.confirmType=="error"){
            return "font-weight:bold; color:white;";
          }
      },
      confirmButtonColor(){
          if(this.confirmType=="error"){
            return "error";
          }
      }
  },
  methods:{
      confirmCancel(){
          this.$emit('confirmCancel');
      },
      confirmAccept(){
          this.$emit('confirmAccept');
      }
  },
}
</script>