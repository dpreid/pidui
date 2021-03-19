<template>
<div class='m-2 p-2 bg-white border rounded'>
    <div class="row justify-content-center align-items-center">
        <button class="btn btn-default btn-xs m-1" v-if="!isRecording && inputMode == 'free'" id="recordButton" @click="record">Record</button>
        <button class="btn btn-default btn-xs m-1" v-if="isRecording" id="stopButton" @click="stopRecording">Stop</button>
        <button class="btn btn-default btn-xs m-1" id="clearButton" @click="clearGraph">Reset</button>
        <button class="btn btn-default btn-xs m-1" v-if="hasData" id="outputButton" @click="outputToCSV">Download CSV</button>
    </div>
    <div class='row m-2 justify-content-center'>
      <div v-if='isRecording' class='col-2'>
        <img id='red-light' src='../../public/images/red-light.png' width='20' height='20' :hidden='!showRedLight'>
      </div>
      <div class='col-10'>  
        <p class='m-1'>Recorded: {{numData}}/{{max_data_points}} data points</p>
      </div>
    </div>
   <!-- <div class="form-group row justify-content-center p-2">
        <label class="col-sm-2 col-form-label" for="time_interval">Every</label>
        <div class='col-sm-4 mr-4'><input type='text' :class="[{'error': hasError}, 'form-control']" id="time_interval" v-model="time_interval"></div>
        <b-tooltip triggers='hover' :delay="{show:tooltip_delay,hide:0}" :disabled.sync="disableTooltips" target="time_interval" :title='checkValueRange(time_interval)'></b-tooltip>
        <label class="col-sm-2 col-form-label" for="time_interval">seconds</label>
    </div> -->
    
</div>
</template>

<script>
import { store } from "../simplestore.js";
import { eventBus } from "../main.js";

export default {

  name: 'DataRecorder',
  props:{
		disableTooltips: Boolean,
	},
  data () {
    return {
        //store: this.$store,
        data_store: store,
        isRecording: false,
        time_interval: 0.05,
        time_interval_min: 0.01,
        interval_id: 0,
        data_points_count: 0,
        hasPlotted: false,
        previous_angle: 0,
        wrap_index: 0,
        tooltip_delay: 2000,
        starting_angle: 0,
        max_data_points: 5000,
        max_reached: false,
    }
  },
  components: {
    
  },
  created(){
    eventBus.$on('datarecorderstop', this.stopRecording);
		//eventBus.$on('maxdatapointsreached', this.stopRecording);
	},
  computed:{
      hasData(){
            return store.getNumData !== 0;
      },
      hasError(){
        if(!isNaN(this.time_interval) && this.time_interval >= this.time_interval_min){
          return false;
        } else { 
          return true;
        }
      },
      newTime(){
        return this.data_store.state.current_time;
      },
      startRecord(){
        return this.data_store.state.isRecording;
      },
      inputMode(){
        return this.data_store.state.inputMode;
      },
      numData(){
        return this.data_store.getNumData();
      },
      showRedLight(){
        return this.data_store.getNumData() % 20 > 10 ? true : false;
      }
  },
  watch:{
    newTime(){
      if(this.isRecording && store.getNumData() < this.max_data_points){
        this.plot();
      } else if(store.getNumData() == this.max_data_points && !this.max_reached){
          this.stopRecording();
          this.max_reached = true;
      }
    },
    startRecord(){
      if(this.data_store.state.isRecording){
        this.record();
      } 
    }
  },
  methods: {
      record(){
          if(!this.hasError){
            this.wrap_index = 0;
            this.starting_angle = store.state.current_angle;    //in rad    NEW.
            this.previous_angle = this.starting_angle;
            store.state.start_time = store.state.current_time;
            this.data_points_count = 0;
            this.isRecording = true;
            this.data_store.state.isRecording = true;    //NEW, SET THE DATA STORE RECORD IN HERE TOO.
          } 
          
      },
      stopRecording(){
          this.isRecording = false;
          store.state.isRecording = false;
          this.wrap_index = 0;
          eventBus.$emit('updatetable');
      },
      plot(){
          this.data_points_count++;
          let angle = parseFloat(store.state.current_angle);
          let time = store.getTime();
          let ang_vel = parseFloat(store.state.current_ang_vel);
          

          //in step and ramp mode, angle value should start from 0 no matter the initial position of encoder.   NEW
          // if(store.state.inputMode == 'ramp' || store.state.inputMode == 'step'){
          //   angle = angle - this.starting_angle;
          // }

          // if(store.state.inputMode == 'step'){
          //   if(angle < -Math.PI/2.0){
          //     angle = angle + 2*Math.PI;
          //   }
          // }


          //=================================ramp mode needs to unwrap the angle=========
          // if(store.state.inputMode == 'ramp'){
          //   // if(angle < 0){
          //   //   angle = angle + 2*Math.PI;
          //   // }

          //   if(Math.abs(angle - this.previous_angle) > (3/2)*Math.PI){
          //     this.wrap_index++;
          //   }
            
          //   this.previous_angle = angle;

          //   angle = this.wrap_index*2*Math.PI + angle;
            
          // }

          

          //==================================================

          //get values in different units
          //angle in degrees
          let angle_deg = angle*180.0/Math.PI;
          //ang_vel in rad/s
          let ang_vel_rad = 2*Math.PI*ang_vel/60.0;

          
          //let data_object = {id: store.getNumData(), t: parseFloat(time), theta: angle, omega: ang_vel, theta_deg:angle_deg, omega_rad: ang_vel_rad, p: store.state.current_p_value, i: store.state.current_i_value, d: store.state.current_d_value};
          let data_object = {id: store.getNumData(), t: parseFloat(time), theta: angle, omega: ang_vel, theta_deg:angle_deg, omega_rad: ang_vel_rad, command: store.state.current_command_value, drive: store.state.current_drive, error: store.state.current_error};
          //this.$store.dispatch('addData', data_object);
          store.addData(data_object);
          //eventBus.$emit('updateGraph');
          //eventBus.$emit('updatetable');
          this.hasPlotted = true;
          

      },
    //   addToGraph(){
    //       eventBus.$emit('updateGraph');
    //   },
      clearGraph(){
          //this.$store.dispatch('clearAllData');
          store.clearAllData();
          this.max_reached = false;
          eventBus.$emit('clearalldata');
          this.hasPlotted = false;
          this.wrap_index = 0;
          if(store.state.current_angle < 0){
            this.previous_angle = store.state.current_angle + 2*Math.PI;
          } else{
            this.previous_angle = store.state.current_angle;
          }
          
      },
      outputToCSV(){
          let csv = '';
          let filename = '';
            let date = new Date();
            filename = date.getDate().toString() + (date.getMonth() + 1).toString() + date.getFullYear().toString();
          // if(store.state.graphDataParameter == 'theta'){
          //     filename += 'Position';
          //     csv = 'Time/s,Angle/rad,p,i,d\n';
          //   //let data = this.$store.getters.getData;
          //   let data = store.state.data;
          //   data.forEach(function(d){
          //       csv += d.t.toString();
          //       csv += ",";
          //       csv += d.theta.toString();
          //       if(d.p != null){
          //         csv += ",";
          //       csv += d.p.toString();
          //       csv += ",";
          //       csv += d.i.toString();
          //       csv += ",";
          //       csv += d.d.toString();
          //       }
                
          //       csv += "\n";
          //   });
          // } else if(store.state.graphDataParameter == 'omega'){
          //     filename += 'AngularVelocity';
          //     csv = 'Time/s,AngVel/rad/s,p,i,d\n';
          //   //let data = this.$store.getters.getData;
          //   let data = store.state.data;
          //   data.forEach(function(d){
          //       csv += d.t.toString();
          //       csv += ",";
          //       csv += d.omega_rad.toString();
          //       if(d.p != null){
          //         csv += ",";
          //       csv += d.p.toString();
          //       csv += ",";
          //       csv += d.i.toString();
          //       csv += ",";
          //       csv += d.d.toString();
          //       }
          //       csv += "\n";
          //   });
          // } else{
              csv = 'Time/s,Angle/rad,AngVel/rad/s,Command,Drive,Error\n';
            //let data = this.$store.getters.getData;
            let data = store.state.data;
            data.forEach(function(d){
                csv += d.t.toString();
                csv += ",";
                csv += d.theta.toString();
                csv += ',';
                csv += d.omega_rad.toString();
                if(d.command != null){
                  csv += ",";
                  csv += d.command.toString();
                } else {
                  csv += ",";
                  csv += "";
                }
                if(d.drive != null){
                  csv += ",";
                  csv += d.drive.toString();
                } else{
                  csv += ",";
                  csv += "";
                }

                if(d.error != null){
                  csv += ",";
                  csv += d.error.toString();
                } else{
                  csv += ",";
                  csv += "";
                }
                
                
                
                
                csv += "\n";
            });
          //}
            filename += '.csv';
          //console.log(csv);
          let hiddenElement = document.createElement('a');
          hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
          hiddenElement.target = '_blank';
          hiddenElement.download = filename;
          hiddenElement.click();
      },
      checkValueRange(value){
        if(value >= this.time_interval_min){
          return 'OK';
        } else{
          return 'Too small';
        }
      },
      
  }
}
</script>

<style scoped>

.error{
    border:thick solid red
}

.error:focus{
    border:thick solid red
}

#recordButton       {background-color: rgb(0, 255, 8);}
#recordButton:hover {background-color: #3e8e41} 

#stopButton       {background-color: #e13131ff;}
#stopButton:hover {background-color: #cc1e1eff;}

#clearButton  {background-color: #e17a31ff;}
#clearButton:hover  {background-color: #cc661eff;}

#outputButton        {background-color: #e1b131ff;}
#outputButton:hover  {background-color: #cc9d1eff;}

</style>