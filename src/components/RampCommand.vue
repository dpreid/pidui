<template>
    <div class='m-2 p-2 bg-secondary border rounded'>
        <div class="row justify-content-center">
            <h2 for="addCommand">Ramp Input</h2>
        </div>

        <div class="row justify-content-center">  
            <label class='m-2' v-if='mode == "speedRaw"' for="ramp_start">Start V</label>
            <label class='m-2' v-else-if='mode == "speedPid"' for="ramp_start">Start rad/s</label>
            <input v-if='mode == "speedRaw" || mode == "speedPid"' id="ramp_start" class='mr-2' v-model="ramp_start" size="3">
            <!-- <b-tooltip v-if='mode == "speedRaw" || mode == "speedPid"' triggers='hover' :delay="{show:tooltip_delay,hide:0}" :disabled.sync="disableTooltips" target="ramp_start"> Set a starting value before ramp function begins.</b-tooltip> -->
            <button v-show="mode == 'speedRaw' || mode == 'speedPid'" id="set" @click="setStart">Set</button>
        </div>

        <div class="row justify-content-center m-2">    

            <label v-if='mode == "speedRaw"' class='m-2' for="ramp_gradient">Ramp gradient (V/s)</label>
            <label v-else-if='mode == "positionPid"' class='m-2' for="ramp_gradient">Ramp gradient (rad/s)</label>
            <label v-else-if='mode == "speedPid"' class='m-2' for="ramp_gradient">Ramp gradient ((rad/s)/s)</label>

            <input :class='getInputClass(ramp_gradient)' id="ramp_gradient" v-model="ramp_gradient" size="3">
            <!-- <b-tooltip triggers='hover' :delay="{show:tooltip_delay,hide:0}" :disabled.sync="disableTooltips" target="ramp_gradient" :title='checkValueRange(ramp_gradient)'></b-tooltip> -->
            
            <button id="run" v-if="mode != 'stopped'" @click="runCommand" :disabled="isRampRunning">Run</button>
            <!-- <button v-if="isDataRecorderOn && mode != 'stopped'" id="runAndRecord" @click="runRecord" :disabled="isRampRunning">Run + Record</button> -->

        </div>


     </div>   
</template>

<script>
//import ReconnectingWebSocket from 'reconnecting-websocket';
import { store } from "../simplestore.js";
import { eventBus } from "../main.js";

export default {

  name: 'RampCommand',
  props:{
      remoteLabVersion: String,
      mode: String,
      dataSocket: WebSocket,
      isDataRecorderOn: Boolean,
      disableTooltips: Boolean,
  },
  data () {
    return {
        time_until_ramp: 0,
        ramp_gradient: 1,            //only positive ramps
        ramp_start: 1,
        motor_max_voltage: 12,
        encoder_max: 1000,
        time: 0,
        time_interval: 0.1,          //seconds
        interval_id: null,
        max_value: 6,
        initial_angle: 0,
        tooltip_delay: 2000,
        max_position_ramp: 2*Math.PI,
        max_speed_ramp: 50,
        max_voltage_ramp: 12,
        isRampRunning: false,
    }
  },
  components: {
    
  },
  computed:{

  },
  created(){
        //eventBus.$on('runrecord', this.runCommand);
        eventBus.$on('stopramp', this.stopCommand);
	},
  mounted(){
      
  },
  methods: {
     runCommand(){
         if(!this.isRampRunning){
             if(this.isDataRecorderOn){
                 store.state.isRecording = true;
             }
             

             eventBus.$emit('showinputtype', false);
             this.time = 0;
            this.time_interval = parseFloat(this.time_interval);
            this.ramp_gradient = Math.abs(parseFloat(this.ramp_gradient));     //only positive gradients
            //set store state for access by graph input component
            store.state.ramp.ramp_start_time = this.time_until_ramp;
            store.state.ramp.ramp_start = 0;
            store.state.ramp.ramp_gradient = this.ramp_gradient;
            
            if(this.mode == 'speedPid'){
                this.max_value = store.state.ramp.max_rad_s;
                eventBus.$emit('addrampfunction', 'rad/s', this.max_value);
            } else if(this.mode == 'speedRaw'){
                this.max_value = store.state.ramp.max_voltage;
                eventBus.$emit('addrampfunction', 'voltage(V)', this.max_value);
            } else if(this.mode == 'positionPid'){
                this.max_value = 6*Math.PI;      //don't like this !!!!!!!!!!!!!!!!!!!
                eventBus.$emit('addrampfunction', 'theta', this.max_value);

            }
                this.initial_angle = store.state.current_angle;         //new!!!!!!!!!!!!!!!!!!!!!!!!!
            
            this.interval_id = setInterval(() => this.sendCommand(), this.time_interval*1000);
            
            this.isRampRunning = true;
            //this.sendCommand();
         }
         
        
       
     },
     sendCommand(){
         this.time += this.time_interval;        //in seconds
         let ramp_value = this.ramp_gradient * this.time;
        //  if(ramp_value >= this.max_value){
        //      this.stopCommand();
        //  }

         if(this.mode == 'speedRaw'){
             //let signal = ((ramp_value + parseFloat(this.ramp_start))/this.motor_max_voltage) * 255;
            //  let signal = ((ramp_value + parseFloat(this.ramp_start))/this.max_value) * 100;    //percentage of max 6V
            let signal = parseFloat(ramp_value) + parseFloat(this.ramp_start);
             this.dataSocket.send(JSON.stringify({
				set: "volts",
				to: signal
			}));
         } else if(this.mode == 'speedPid'){
            //  let rpm = ramp_value*60/(2*Math.PI) + this.ramp_start*60/(2*Math.PI);   
            let rad_s = parseFloat(ramp_value) + parseFloat(this.ramp_start);  
             this.dataSocket.send(JSON.stringify({
				set: "velocity",
				to: rad_s
			}));
         } else if(this.mode == 'positionPid'){
             let new_ang_rad = parseFloat(ramp_value) + parseFloat(this.initial_angle);
             //let new_enc_pos = this.encoder_max*new_ang_rad/Math.PI;

            //  if(new_enc_pos > 1000){
            //      let half_rots = Math.floor(new_enc_pos / 1000);        //integer number of half rotations completed
            //      let remain = new_enc_pos % 1000;
            //      if(half_rots % 2 == 0){
            //          new_enc_pos = remain;
            //      } else{
            //          new_enc_pos = -(1000 - remain);
            //      }
            //  } 
            //  //only positive rotation possible so value should never be less than -1000, but included for completeness.
            //  else if(new_enc_pos < -1000){
            //      let half_rots = Math.floor(Math.abs(new_enc_pos) / 1000);
            //      let remain = new_enc_pos % 1000;
            //      if(half_rots % 2 == 0){
            //          new_enc_pos = remain;
            //      } else{
            //          new_enc_pos = 1000 + remain;
            //      }
            //  }
             this.dataSocket.send(JSON.stringify({
				set: "position",
				to: new_ang_rad
			}));
         } else{
             this.stopCommand();
         }
         
     },
     stopCommand(){
         console.log('ramp cleared');
         clearInterval(this.interval_id);
         this.isRampRunning = false;
         //store.state.isRecording = false;
     },
     setStart(){
        //  let signal = 255*parseFloat(this.ramp_start)/this.motor_max_voltage;
        let signal = parseFloat(this.ramp_start);
        // if(this.mode == 'speedRaw'){
        //     // signal = 100*parseFloat(this.ramp_start)/this.max_value;
        //     signal = this.ramp_start
        // } else{
        //     signal = this.ramp_start*60/(2*Math.PI);  
        // }

        if(this.mode == 'speedRaw'){
            this.dataSocket.send(JSON.stringify({
				set: "volts",
				to: signal
            }));
        } else {
            this.dataSocket.send(JSON.stringify({
				set: "velocity",
				to: signal
            }));
        }
        
         
     },
    //  runRecord(){
    //      this.runCommand();
    //      eventBus.$emit('runrecord');
    //  },
     checkValueRange(value){
         if(isNaN(value) || value < 0){
             return 'Invalid ramp';
         } else{
             if(this.mode == 'positionPid'){
                    if(value > this.max_position_ramp){
                        return 'Ramp gradient is large';
                    } else {
                        return 'Ramp gradient OK';
                    }
                    

                } else if(this.mode == 'speedPid'){

                    if(value > this.max_speed_ramp){
                        return 'Ramp gradient is large';
                    } else {
                        return 'Ramp gradient OK';
                    }

                } else if(this.mode == 'speedRaw'){
                    if(value > this.max_voltage_ramp){
                        return 'Ramp gradient is large';
                    } else {
                        return 'Ramp gradient OK';
                    }
                } else {

                    return '';

                }
         }
         
         
     },
     getInputClass(value){
         let standard_class = 'mr-2 form-control';
         let additional_class = '';

			if(!isNaN(value) && value >= 0){
                if(this.mode == 'positionPid'){
                    if(value > this.max_position_ramp){
                        additional_class = ' error';
                    }
                } 
                else if(this.mode == 'speedPid'){
                    if(value > this.max_speed_ramp){
                        additional_class = ' error';
                    } 
                } 
                else {
                    if(value > this.max_voltage_ramp){
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

#set       {background-color: rgb(74, 223, 37);}
#set:hover {background-color: #0b7e0f} 

#run       {background-color:  rgb(74, 223, 37);}
#run:hover {background-color: #0b7e0f} 


</style>