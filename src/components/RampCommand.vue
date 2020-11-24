<template>
    <div class='m-2 p-2 bg-secondary border rounded'>
        <div class="row justify-content-center">
            <h2 for="addCommand">Ramp Input</h2>
        </div>

        <div class="row justify-content-center">  
            <label class='m-2' v-if='mode == "dc_motor"' for="ramp_start">Start V</label>
            <input v-if='mode == "dc_motor"' id="ramp_start" v-model="ramp_start" size="3">

            <button v-show="mode == 'dc_motor'" id="set" @click="setStart">Set</button>
        </div>
        <div class="row justify-content-center">    

            <label v-if='mode == "dc_motor"' for="ramp_gradient">Ramp gradient (V/s)</label>
            <label v-else-if='mode == "pid_position"' for="ramp_gradient">Ramp gradient (rad/s)</label>
            <label v-else-if='mode == "pid_speed"' for="ramp_gradient">Ramp gradient (rpm/s)</label>

            <input id="ramp_gradient" v-model="ramp_gradient" size="3">

            
            <button id="run" @click="runCommand">Run</button>

        </div>


     </div>   
</template>

<script>
import ReconnectingWebSocket from 'reconnecting-websocket';
import { store } from "../simplestore.js";
import { eventBus } from "../main.js";

export default {

  name: 'RampCommand',
  props:{
      mode: String,
      dataSocket: ReconnectingWebSocket
  },
  data () {
    return {
        time_until_ramp: 0,
        ramp_gradient: 1,            //only positive ramps
        ramp_start: 1,
        motor_max_voltage: 12,
        encoder_max: 1000,
        time: 0,
        time_interval: 0.01,          //seconds
        interval_id: null,
        max_value: 6,
    }
  },
  components: {
    
  },
  computed:{

  },
  created(){
		eventBus.$on('runrecord', this.runCommand);
	},
  mounted(){

  },
  methods: {
     async runCommand(){
         console.log('RUN');
         this.time = 0;
         this.time_interval = parseFloat(this.time_interval);
         this.ramp_gradient = Math.abs(parseFloat(this.ramp_gradient));     //only positive gradients
         //set store state for access by graph input component
         store.state.ramp.ramp_start_time = this.time_until_ramp;
         store.state.ramp.ramp_start = 0;
         store.state.ramp.ramp_gradient = this.ramp_gradient;
         
         if(this.mode == 'pid_speed'){
             this.max_value = store.state.ramp.max_rpm
             eventBus.$emit('addrampfunction', 'rpm', this.max_value);
         } else if(this.mode == 'dc_motor'){
             this.max_value = store.state.ramp.max_voltage;
             eventBus.$emit('addrampfunction', 'voltage(V)', this.max_value);
         } else if(this.mode == 'pid_position'){
             this.max_value = 6*Math.PI;      //don't like this !!!!!!!!!!!!!!!!!!!
             eventBus.$emit('addrampfunction', 'theta', this.max_value);

         }

         
         this.interval_id = setInterval(() => this.sendCommand(), this.time_interval*1000);
        
       
     },
     sendCommand(){
         this.time += this.time_interval;        //in seconds
         console.log('SEND COMMAND = ' + this.time);
         let ramp_value = this.ramp_gradient * this.time;
         if(ramp_value >= this.max_value){
             console.log('stopped sending ramp command');
             this.stopCommand();
         }

         if(this.mode == 'dc_motor'){
             let signal = ((ramp_value + parseFloat(this.ramp_start))/this.motor_max_voltage) * 255;
             console.log('signal = ' + signal);
             this.dataSocket.send(JSON.stringify({
				cmd: "set_speed",
				param: signal
			}));
         } else if(this.mode == 'pid_speed'){
             let rpm = ramp_value;         
             this.dataSocket.send(JSON.stringify({
				cmd: "set_speed",
				param: rpm
			}));
         } else if(this.mode == 'pid_position'){
             //console.log('sending ramp command = ' + ramp_value);
             //let new_ang_rad = store.state.current_angle + ramp_value;
             let new_ang_rad = ramp_value;
             //let current_enc_pos = store.state.current_enc_pos;
             //let new_enc_pos = current_enc_pos + this.encoder_max*new_ang_rad/Math.PI;
             let new_enc_pos = this.encoder_max*new_ang_rad/Math.PI;
            console.log('new enc pos = ' + new_enc_pos);

             if(new_enc_pos > 1000){
                 new_enc_pos = -(1000 - (new_enc_pos - 1000));
             } else if(new_enc_pos < -1000){
                 new_enc_pos = 1000 - (Math.abs(new_enc_pos) - 1000);
             }
             this.dataSocket.send(JSON.stringify({
				cmd: "set_position",
				param: new_enc_pos
			}));
         } else{
             this.stopCommand();
         }
         
     },
     stopCommand(){
         clearInterval(this.interval_id);
     },
     setStart(){
         let signal = 255*parseFloat(this.ramp_start)/this.motor_max_voltage;
         this.dataSocket.send(JSON.stringify({
				cmd: "set_speed",
				param: signal
            }));
     }
  }
}
</script>

<style scoped>



#run       {background-color: #4CAF50FF;}
#run:hover {background-color: #3e8e41} 


</style>