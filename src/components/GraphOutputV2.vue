
<template>
<div class='container-sm m-2 bg-white border rounded'>
  <div class='row'>
      <button id="add" class="btn btn-default btn-lg" @click="add">Add data</button>
    </div>
  <div class="row m-0 justify-content-center">
        <div id="chartContainer" style="width: 100%;"></div>
    </div>
</div>
</template>

<script>
import { store } from "../simplestore.js";
import * as CanvasJS from 'canvasjs';
//CanvasJS = CanvasJS.Chart ? CanvasJS : window.CanvasJS;

export default {

  name: 'GraphOutputV2',
  props:{
      
  },
  data () {
    return {
      dataStore: store,
       chartOptions: {
           title: {
               text: "CanvasJS Chart in Vue.js"
          },
          data: [
            {
              type: "scatter",
              dataPoints: [
                { x: 0, y: 0 },
              ]
            }					
          ]
    },
    chart : null,
    unit: 'rad',
    }
  },
  components: {
    
  },
  mounted(){
    this.chart = new CanvasJS.Chart("chartContainer", this.chartOptions);
    this.chart.render();
    setInterval(this.getLatestData, 20);
  },
  computed:{
      // newData(){
      //   return this.dataStore.state.data;
      // }
  },
  watch:{
      // newData(){
      //       this.getLatestData();
      //   }
  },
  methods: {
    add(){
      let x = Math.random()*100;
      let y = Math.random()*100;
      this.addDataToChart({x: x, y: y})
    },
    addDataToChart(data) {
            this.chartOptions.data[0].dataPoints.push(data);
            this.chart.render();
  
        },
      getLatestData(){
                //let index = this.$store.getters.getNumData - 1;
                let index = store.getNumData() - 1;
                let y_data;
                if(index >= 0){
                    //let data = this.$store.getters.getData[index];
                    let x_data = store.state.data[index].t;
                    //let x_data = data.t;
                    switch(store.state.graphDataParameter){
                            case 'theta':
                            if(this.unit == 'deg'){
                                y_data = store.state.data[index].theta_deg;
                            } else {
                                y_data = store.state.data[index].theta;
                                
                            }
                            break;
                        case 'omega':
                            if(this.unit == 'rpm'){
                                y_data = store.state.data[index].omega;
                            } else{
                                y_data = store.state.data[index].omega_rad;
                            }
                            break;

                        }
                        this.addDataToChart({x: x_data, y: y_data});
                    } else{
                        //console.log("no data");
                    }
                
            },
  }
}
</script>

<style scoped>


</style>