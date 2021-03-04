<template>
<div class="m-2 bg-white border rounded">
    <div class="row justify-content-center">
    <!-- <input type="text" id="search" v-on:keyup="search" v-model="search_field" placeholder="Search the table..."> -->

    <table class="table">
        <tr>
            <!-- <th scope="col">ID</th> -->
            <th scope="col">Time/s</th>
            <th scope="col">Angle/rad</th>
            <th scope="col">Angular Velocity/rad/s</th>
            <th scope='col'>Command</th>
            <th scope='col'>Drive</th>
            <th scope='col'>Error</th>
        </tr>
        <tr v-for="row in tableData" :id="row.id" :key="row.id" v-bind:class="[row.id == selected_row_id ? 'selected-row' : '']" @click="changeSelected(row.id)">
            <!-- <td>{{row.id}}</td> -->
            <td>{{row.t}}</td>
            <td>{{row.theta.toFixed(2)}}</td>
            <td>{{row.omega_rad.toFixed(2)}}</td>
            <td>{{row.command}}</td>
            <td>{{row.drive}}</td>
            <td>{{row.error}}</td>
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
            tableData: [], //store.state.data,
            searchData:[],
            search_field:"",
            selected_row_id: "0",
        }
    },
    computed:{
        
    },
    watch:{
        
    },
    methods: {
        getData(){
            //console.log('updating table');
            this.tableData = [...store.state.data];
        },
        getMode(){
            return store.state.currentMode;
        },
        changeSelected(id){
            this.selected_row_id = id;
            var elmnt = document.getElementById(id);
            elmnt.scrollIntoView(false); 
        }
      },
      mounted() {
        this.tableData = [...store.state.data];
        
      },
      created(){
          eventBus.$on('updatetable', this.getData);                  
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
