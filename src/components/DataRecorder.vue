<template>
    <div class="p-3">
    <!-- <div class="row mb-5"> -->
        <button v-if="!isRecording" id="recordButton" @click="record">Record</button>
        <button v-if="isRecording" id="stopButton" @click="stopRecording">Stop</button>
        <button v-if="hasPlotted" id="clearButton" @click="clearGraph">Reset</button>
        <label for="time_interval">Every</label>
        <input id="time_interval" v-model="time_interval" size="3"> 
        <label for="time_interval">s</label>

        <button v-if="hasData" id="outputButton" @click="outputToCSV">Download CSV</button>
    <!-- </div> -->
  
  </div>
</template>

<script>
import { store } from "../store.js";
import { eventBus } from "../main.js";

export default {

  name: 'DataRecorder',
  data () {
    return {
        store: store,
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
          return this.store.getNumData() !== 0;
      }
  },
  methods: {
      record(){
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
          let angle = store.state.current_angle;
          let time = store.getTime();
          let ang_vel = store.calculateAngularVelocity();
          
          let index = store.getNumData() - 1;
          //should the ang_vel calculated this loop be placed in the previous data point? Or this one?!!!!!!!!!!!!!!!
          if(index >= 0){
              console.log("index = " + index);
              console.log("ang vel = " + ang_vel);
              store.state.data[index].omega = ang_vel;  //update previous ang_vel
          }
          
          let data_object = {id: store.state.data.length, t: parseFloat(time), theta: parseFloat(angle), omega: NaN};   //omega will be updated in next cycle
          store.addData(data_object);
          eventBus.$emit('updateGraph');
          eventBus.$emit('updatetable');
          this.hasPlotted = true;
          

      },
    //   addToGraph(){
    //       eventBus.$emit('updateGraph');
    //   },
      clearGraph(){
          store.clearAllData();
          eventBus.$emit('clearalldata');
          this.hasPlotted = false;
      },
      outputToCSV(){
          let csv = 'Time/s,Angle/rad,AngVel/rad/s\n';
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
button {
	padding: 15px 25px;
	font-size: 24px;
	text-align: center;
	cursor: pointer;
	outline: none;
	color: rgb(255, 255, 255);

	border: none;
	border-radius: 15px;
	box-shadow: 0 9px #999;
}

/*	background-color: #4CAF50;
 .button:hover {background-color: #3e8e41}*/

button:active {
	background-color: #3e8e41;
	box-shadow: 0 5px #666;
	transform: translateY(4px);
}


#recordButton       {background-color: #4CAF50FF;}
#recordButton:hover {background-color: #3e8e41} 

#stopButton       {background-color: #e13131ff;}
#stopButton:hover {background-color: #cc1e1eff;}

#clearButton  {background-color: #e17a31ff;}
#clearButton:hover  {background-color: #cc661eff;}

#outputButton        {background-color: #e1b131ff;}
#outputButton:hover  {background-color: #cc9d1eff;}

label {
    font-size:20px;
    color: #0501f7;
    font-weight: bold;
    display: inline-block;
    vertical-align: middle;
    width: 60px;
    padding-top: 20px;
    /* float: left; */
}

</style>