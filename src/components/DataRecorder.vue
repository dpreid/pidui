<template>
<div class='m-2 p-2 bg-white border rounded'>
    <div class="row m-2 justify-content-center align-items-center">
        <button class="btn btn-default btn-xs" v-if="!isRecording" id="recordButton" @click="record">Record</button>
        <button class="btn btn-default btn-xs" v-if="isRecording" id="stopButton" @click="stopRecording">Stop</button>
        <button class="btn btn-default btn-xs" v-if="hasPlotted" id="clearButton" @click="clearGraph">Reset</button>
        <button class="btn btn-default btn-xs" v-if="hasData" id="outputButton" @click="outputToCSV">Download CSV</button>
    </div>
   <div class="form-group row justify-content-center pb-2">
        <label class="col-sm-2 col-form-label" for="time_interval">Every</label>
        <div class='col-sm-4'><input type='text' class='form-control' id="time_interval" v-model="time_interval"></div>
        <label class="col-sm-2 col-form-label" for="time_interval">seconds</label>
    </div>
</div>
</template>

<script>
import { store } from "../simplestore.js";
import { eventBus } from "../main.js";

export default {

  name: 'DataRecorder',
  data () {
    return {
        //store: this.$store,
        isRecording: false,
        time_interval: 0.5,
        interval_id: 0,
        data_points_count: 0,
        hasPlotted: false,
    }
  },
  components: {
    
  },
  computed:{
      hasData(){
          //return this.$store.getters.getNumData !== 0;
            return store.getNumData !== 0;
      }
  },
  methods: {
      record(){
          //this.$store.dispatch('setStartTime', new Date().getTime());
          store.state.start_time = new Date().getTime();
          this.data_points_count = 0;
          this.isRecording = true;
          console.log("record");
          this.interval_id = setInterval(() => {
                this.plot()
            }, parseFloat(this.time_interval)*1000);
      },
      stopRecording(){
          this.isRecording = false;
          console.log("stop recording");
          clearInterval(this.interval_id);
      },
      plot(){
          this.data_points_count++;
          //let angle = this.$store.getters.getCurrentAngle;
          let angle = store.state.current_angle;
          //let time = this.$store.getters.getTime;
          let time = store.getTime();
          //let ang_vel = this.$store.getters.calculateAngularVelocity;
          let ang_vel = store.calculateAngularVelocity();
          //let index = this.$store.getters.getNumData - 1;
          let index = store.getNumData() -1;
          //should the ang_vel calculated this loop be placed in the previous data point? Or this one?!!!!!!!!!!!!!!!
          if(index >= 0){
              console.log("index = " + index);
              console.log("ang vel = " + ang_vel);
              //this.$store.dispatch('updateAngularVelocity', index, ang_vel);  //update previous ang_vel
              store.state.data[index].omega = ang_vel;  //update previous ang_vel
          }
          
          let data_object = {id: this.$store.getters.getNumData, t: parseFloat(time), theta: parseFloat(angle), omega: NaN};   //omega will be updated in next cycle
          //this.$store.dispatch('addData', data_object);
          store.addData(data_object);
          eventBus.$emit('updateGraph');
          eventBus.$emit('updatetable');
          this.hasPlotted = true;
          

      },
    //   addToGraph(){
    //       eventBus.$emit('updateGraph');
    //   },
      clearGraph(){
          //this.$store.dispatch('clearAllData');
          store.clearAllData();
          eventBus.$emit('clearalldata');
          this.hasPlotted = false;
      },
      outputToCSV(){
          let csv = 'Time/s,Angle/rad,AngVel/rad/s\n';
          //let data = this.$store.getters.getData;
          let data = store.state.data;
          data.forEach(function(d){
              csv += d.t.toString();
              csv += ",";
              csv += d.theta.toString();
              csv += ',';
              csv += d.omega.toString();
              csv += "\n";
          });
          //console.log(csv);
          let hiddenElement = document.createElement('a');
          hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
          hiddenElement.target = '_blank';
          hiddenElement.download = 'pendulum.csv';
          hiddenElement.click();
      },
      
  }
}
</script>

<style scoped>

#recordButton       {background-color: rgb(0, 255, 8);}
#recordButton:hover {background-color: #3e8e41} 

#stopButton       {background-color: #e13131ff;}
#stopButton:hover {background-color: #cc1e1eff;}

#clearButton  {background-color: #e17a31ff;}
#clearButton:hover  {background-color: #cc661eff;}

#outputButton        {background-color: #e1b131ff;}
#outputButton:hover  {background-color: #cc9d1eff;}

</style>