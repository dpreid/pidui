//Vue3 updated
//Orthogonality

<template>
<div class="m-0 bg-white border rounded table">
    <div class="row justify-content-center">

    <table v-if='tableData.length != 0' class="table">
        <tr>
            <th v-for='heading in tableHeadings' :key="heading" scope="col">{{heading}}</th>
        </tr>
        <tr v-for="row in tableData" :id="row.id" :key="row.id" v-bind:class="[row.id == selected_row_id ? 'selected-row' : '']" @click="changeSelected(row.id)">
            <td v-for='key in Object.keys(row)' :key="key">{{row[key]}}</td>
            <!-- <td><input type="checkbox" :id="row.id" :name="row.id" :checked='row.showDataPoint' @change="toggleShowDataPoint(row.id, row.showDataPoint)"></td> -->
        </tr>
                            
    </table> 

    <table v-else class='table' id='tableData'>
         <tr>
            <th v-for='heading in tableHeadings' :key="heading" scope="col">{{heading}}</th>
        </tr>
        <tr>
            <td :colspan="tableHeadings.length"> Data will display once recording complete.</td>
        </tr>
    </table>

    </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'TableOutput',
    props:[
      'tableHeadings', 'selected_point'
    ],
    data(){
        return{
            tableData: [],
            searchData:[],
            search_field:"",
            selected_row_id: "0",
        }
    },
    created(){
        
    },
    mounted() {
        this.updateTable();
    },
    computed:{
        ...mapGetters([
            'getIsRecording',
            'getData'
        ]),
    },
    watch:{
        //to clear data table on reset.
        getData(data){
            if(data.length == 0){
                this.updateTable();
            }
        },
        //to update table once recording complete
        getIsRecording(now, prev){
            if(!now && prev){
                this.updateTable();
            }
        },
        selected_point(id){
            this.changeSelected(id);
        }
    },
    methods: {
        updateTable(){
            this.tableData = [...this.getData];     //get a clone of the data, not set tableData to the getData getter
        },
        changeSelected(id){
            this.selected_row_id = id;
            var elmnt = document.getElementById(id);
            elmnt.scrollIntoView(false); 
        },
        // toggleShowDataPoint(data_id, current_state){
        //     console.log(current_state);
        //     this.$store.dispatch('setShowDataPoint',{id: data_id, show: !current_state});
            
        // }
      },
      
}
</script>

<style scoped>

.selected-row{
    background-color: red;
    color: white;
}

.table{
    overflow: scroll;
    max-height: 500px;
}
</style>
