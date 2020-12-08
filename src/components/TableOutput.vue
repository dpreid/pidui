<template>
<div class="m-2 bg-white border rounded">
    <div class="row justify-content-center">
    <!-- <input type="text" id="search" v-on:keyup="search" v-model="search_field" placeholder="Search the table..."> -->

    <table class="table">
        <tr>
            <!-- <th scope="col">ID</th> -->
            <th scope="col">Time/s</th>
            <th v-if='remoteLabVersion == "robot_arm"' scope="col">Angle/rad</th>
            <th v-if='remoteLabVersion == "variable_governor" || remoteLabVersion == "spinning_disk"' scope="col">Angular Velocity/rad/s</th>
        </tr>
        <tr v-for="row in tableData" :id="row.id" :key="row.id" v-bind:class="[row.id == selected_row_id ? 'selected-row' : '']" @click="changeSelected(row.id)">
            <!-- <td>{{row.id}}</td> -->
            <td>{{row.t}}</td>
            <td v-if='remoteLabVersion == "robot_arm"'>{{row.theta.toFixed(2)}}</td>
            <td v-if='remoteLabVersion == "variable_governor" || remoteLabVersion == "spinning_disk"'>{{row.omega.toFixed(2)}}</td>
        </tr>
                            
    </table> 

    </div>
</div>
</template>

<script>
import { store } from "../simplestore.js";
import { eventBus } from "../main.js";

export default {
    name: 'TableOutput',
    props:{
      remoteLabVersion: String,
  },
    data(){
        return{
            //tableData: this.$store.getters.getData,     //will update table data whenever store data updates
            tableData: store.state.data,
            searchData:[],
            search_field:"",
            selected_row_id: "0",
        }
    },
    methods: {
        getData(){
            //this.tableData = this.$store.getters.getData;
            //this.searchData = data;
            this.tableData = store.state.data;
        },
        
        search(){
            if(this.search_field == ""){
                this.searchData = Array.from(this.tableData);
            } else{
                this.searchData = [];
                let d;
                let string_data_row;
                // Loop through all tableData, create a string of all elements in the table row, search if the current search_field text is contained and set hidden appropriately.
                for (let i = 0; i < this.tableData.length; i++) {
                    d = this.tableData[i];
                    string_data_row = d.id + d.mass + d.name + d.reclat + d.reclong + d.recclass;

                    if (string_data_row.toUpperCase().indexOf(this.search_field.toUpperCase()) > -1) {
                        this.searchData.push(d);
                }    else {
                        //tr[i].style.display = "none";
            }
        
    }
            }
            
        },
        changeSelected(id){
            this.selected_row_id = id;
            var elmnt = document.getElementById(id);
            elmnt.scrollIntoView(); 
        }
      },
      computed:{
    
      },
      mounted() {
        
        
      },
      created(){
          eventBus.$on('updatetable', this.getData);                  //no longer required since Vuex store getter updates automatically
            eventBus.$on('newselectedobject', this.changeSelected)
            eventBus.$on('clearalldata', this.getData);
      }
}
</script>

<style scoped>

.selected-row{
    background-color: red;
    color: white;
}
</style>
