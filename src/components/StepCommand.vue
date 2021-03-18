<template>
    <div class='m-2 p-2 bg-secondary border rounded'>
        <div class="row justify-content-center">
            <h2 for="addCommand">Step Input</h2>
        </div>
        <div class="row justify-content-center">    

            <label v-if='mode == "speedRaw"' class='m-2' for="step_raw">Step size (0 - {{max_voltage_step}}V)</label>
            <label v-else-if='mode == "positionPid"' class='m-2' for="step_speed">Step size (0 - {{max_position_step.toFixed(2)}} rad)</label>
            <label v-else-if='mode == "speedPid"' class='m-2' for="step_position">Step size (0 - {{max_speed_step}} rad/s)</label>

            <!-- NO NEED FOR ALL 3 OF THESE -->
            <input v-if='mode == "speedRaw"' :class='getInputClass(step_size)' id="step_raw" v-model="step_size" max='max_voltage_step' min='-max_voltage_step' @change='updateStore'>
            <input v-else-if='mode == "speedPid"' :class='getInputClass(step_size)' id="step_speed" v-model="step_size" max='max_speed_step' min='-max_speed_step' @change='updateStore'>
            <input v-else-if='mode == "positionPid"' :class='getInputClass(step_size)' id="step_position" v-model="step_size" max='max_position_step' min='-max_position_step' @change='updateStore'>
            <!-- <b-tooltip v-if='mode == "speedRaw"' triggers='hover' :delay="{show:tooltip_delay,hide:0}" :disabled.sync="disableTooltips" target="step_raw" :title='checkValueRange(step_size)'></b-tooltip>
            <b-tooltip v-else-if='mode == "speedPid"' triggers='hover' :delay="{show:tooltip_delay,hide:0}" :disabled.sync="disableTooltips" target="step_speed" :title='checkValueRange(step_size)'></b-tooltip>
            <b-tooltip v-else-if='mode == "positionPid"' triggers='hover' :delay="{show:tooltip_delay,hide:0}" :disabled.sync="disableTooltips" target="step_position" :title='checkValueRange(step_size)'></b-tooltip> -->
<!-- 
            <label class='mr-2' for="time_interval">After</label>
            <input class='mr-2' id="time_interval" v-model="time_to_step" size="3" @change='updateStore'>
            <label class='mr-2' for="time_interval">seconds</label> -->

            <button v-if='!position_running' id="run" @click="runCommand">Run</button>
            <button v-if='position_running' id="wait" @click="wait">Stop</button>
            <!-- <button v-if="isDataRecorderOn && mode != 'stopped'" id="run" @click="runRecord">Run+Record</button> -->

        </div>


     </div>   
</template>

<script>
//import ReconnectingWebSocket from 'reconnecting-websocket';
import { store } from "../simplestore.js";
import { eventBus } from "../main.js";

export default {

  name: 'StepCommand',
  props:{
      remoteLabVersion: String,
      mode: String,
      dataSocket: WebSocket,
      isDataRecorderOn: Boolean,
      disableTooltips: Boolean,
  },
  data () {
    return {
        time_to_step: 0,
        step_size: null,            
        motor_max_voltage: 12,
        encoder_max: 1000,
        tooltip_delay: 2000,
        max_position_step: 2*Math.PI, 
        max_speed_step: 100,
        max_voltage_step: 12,
        position_running: false,
    }
  },
  components: {
    
  },
  
  created(){
        //eventBus.$on('runrecord', this.runCommand);
        
        if(this.remoteLabVersion == 'variable_governor'){
            this.max_position_step = Math.PI;             //variable governor can spin full circle
        } else if(this.remoteLabVersion == 'robot_arm'){
            this.max_position_step = 3*Math.PI/10;          //robot arm is soft limited to 300 encoder steps from 0.
        }
	},
  mounted(){
      this.position_running = false;            //NEW !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  },
  methods: {
     runCommand(){
         if(this.isDataRecorderOn){
                 store.state.isRecording = true;
             }
         eventBus.$emit('showinputtype', false);
         //this.step_size = Math.abs(this.step_size);     //only positive steps
         //set store state for access by graph input component
         store.state.step.step_time = this.time_to_step;
         store.state.step.step_start = 0;
         store.state.step.step_size = this.step_size;
         
         if(this.mode == 'positionPid'){
             eventBus.$emit('addstepfunction', 'angle');
         } else if(this.mode == 'speedPid'){
             eventBus.$emit('addstepfunction', 'rpm');
         } else{
             eventBus.$emit('addstepfunction', 'voltage(V)');
         }
         
        
         
        //  await new Promise((resolve) => {
        //      setTimeout(() => resolve(this.sendCommand()), parseFloat(this.time_to_step)*1000);
        // });
        //setTimeout(() => {this.sendCommand}, parseFloat(this.time_to_step)*1000);
        this.sendCommand();
             
     },
     sendCommand(){
         if(this.mode == 'speedRaw'){
             //let signal = (this.step_size/this.motor_max_voltage) * 255;
             //let signal = this.step_size*100/6.0;        //signal is between 0-100% with 100% -> 6V.
             let signal = parseFloat(this.step_size);
             this.dataSocket.send(JSON.stringify({
				set: "volts",
				to: signal
			}));
         } else if(this.mode == 'positionPid'){
             this.position_running = true;                      //NEW !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
             let new_ang_rad = store.state.current_angle + parseFloat(this.step_size);
             //let current_enc_pos = store.state.current_enc_pos;
            //  let new_enc_pos = current_enc_pos + this.encoder_max*new_ang_rad/Math.PI;
            //let new_enc_pos = this.encoder_max*new_ang_rad/Math.PI;

            //  if(new_enc_pos > 1000){
            //      new_enc_pos = -(1000 - (new_enc_pos - 1000));
            //  } else if(new_enc_pos < -1000){
            //      new_enc_pos = 1000 - (Math.abs(new_enc_pos) - 1000);
            //  }

             this.dataSocket.send(JSON.stringify({
				set: "position",
				to: new_ang_rad
			}));
         } else if(this.mode == 'speedPid'){
             //let rpm = store.state.current_ang_vel + this.step_size*60/(2*Math.PI);         //current_ang_vel is in rpm, signal needs to be in rpm
             let rad_s = store.state.current_ang_vel*2*Math.PI/60.0 + parseFloat(this.step_size);           //needs to be in rad/s
             //let rpm = (signal / (2.0*Math.PI))*60;                             //convert to rpm
             this.dataSocket.send(JSON.stringify({
				set: "velocity",
				to: rad_s
			}));
         }
         
     },
     wait(){
            //this is an internal mode in the firmware and does not need to be reflected in the UI.
            this.position_running = false;				//NEW !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            eventBus.$emit('datarecorderstop');
			this.dataSocket.send(JSON.stringify({
				set: "mode",
				to: "wait"
				}));
		},
     //not fully useful at the moment....
     updateStore(){
         store.state.step.step_time = this.time_to_step;

         if(this.mode == "positionPid"){
             //store.state.step.step_start = store.state.current_angle * 180 / Math.PI;
            store.state.step.step_start = 0;
         } else{
             store.state.step.step_start = 0;
         }
         store.state.step.step_size = this.step_size;
     },
    //  runRecord(){
    //      eventBus.$emit('runrecord');
    //      this.runCommand();
    //  },
     checkValueRange(value){
         if(isNaN(value) || value < 0){
             return 'Invalid step';
         } else{
             if(this.remoteLabVersion == 'variable_governor' || this.remoteLabVersion == 'spinning_disk'){
                if(this.mode == 'positionPid'){
                    if(value > this.max_position_step){
                        return 'Step too large';
                    } else {
                        return 'Step size OK';
                    }
                    

                } else if(this.mode == 'speedPid'){

                    if(value > this.max_speed_step){
                        return 'Step too large';
                    } else {
                        return 'Step size OK';
                    }

                } else if(this.mode == 'speedRaw'){
                    if(value > this.max_voltage_step){
                        return 'Step too large';
                    } else {
                        return 'Step size OK';
                    }
                } else {

                    return '';

                }
            } else if(this.remoteLabVersion == 'robot_arm'){
                if(this.mode == 'positionPid'){
                    if(store.state.current_angle + value > this.max_position_step){
                        return 'Steps outside of arm range';
                    } else{
                        return 'Step size OK';
                    }
                    
                } else {
                    return '';
                }
            }
         }
         
         
     },
     getInputClass(value){
         let standard_class = 'mr-2 form-control';
         let additional_class = '';

			if(!isNaN(value) && value >= 0){
                if(this.mode == 'positionPid'){
                    if(this.remoteLabVersion == 'robot_arm'){
                        if(store.state.current_angle + value > this.max_position_step){
                            additional_class = ' error';
                        } 
                    } else {
                        if(value > this.max_position_step){
                            additional_class = ' error';
                }       
                    }
                } 
                else if(this.mode == 'speedPid'){
                    if(value > this.max_speed_step){
                        additional_class = ' error';
                    } 
                } 
                else {
                    if(value > this.max_voltage_step){
                        additional_class = ' error';
                    } 
                }
				
			} else {
				additional_class = ' error';
            }
            
            return standard_class + additional_class;
		},
  }
}
</script>

<style scoped>
input{
    width: 10%;
}
.error{
    /* border:thick solid red */
    border: auto;
}

.error:focus{
    /* border:thick solid red */
    border: auto;
}

#run       {background-color:  rgb(74, 223, 37);}
#run:hover {background-color: #0b7e0f} 
#wait       {background-color:  rgb(255, 30, 0);}
#wait:hover {background-color: #520303} 


</style>