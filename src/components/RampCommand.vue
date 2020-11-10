<template>
    <div class='m-2 p-2 bg-secondary border rounded'>
        <div class="row justify-content-center">
            <h2 for="addCommand">Ramp Input</h2>
        </div>
        <div class="row justify-content-center">    

            <label v-if='mode == "dc_motor"' for="step_size">Ramp magnitude (V)</label>
            <label v-else-if='mode == "pid_position"' for="step_size">Ramp magnitude (degrees)</label>
            <label v-else-if='mode == "pid_speed"' for="step_size">Ramp magnitude (rpm)</label>

            <input id="ramp_size" v-model.number="ramp_magnitude" size="3">

            <label for="time_interval">After</label>
            <input id="time_interval" v-model="time_to_ramp" size="3">
            <label for="time_interval">seconds</label>

            <button v-show="mode == 'dc_motor' || mode == 'pid_speed'" id="run" @click="runCommand">Run</button>

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
        time_to_ramp: 0,
        ramp_magnitude: null,            //only positive ramps
        motor_max_voltage: 12,
        encoder_max: 1000,
        time: 0,
        time_interval: 0.01,          //seconds
        max_value: 6,                   //volts or 1000 rpm
        interval_id: null,
    }
  },
  components: {
    
  },
  computed:{

  },
  mounted(){

  },
  methods: {
     async runCommand(){
         this.ramp_magnitude = Math.abs(this.ramp_magnitude);     //only positive steps
         //set store state for access by graph input component
         store.state.ramp.ramp_time = this.time_to_ramp;
         store.state.ramp.ramp_start = 0;
         store.state.ramp.ramp_size = this.ramp_size;
         
         if(this.mode == 'pid_speed'){
             eventBus.$emit('addrampfunction', 'rpm');
         } else{
             eventBus.$emit('addrampfunction', 'voltage(V)');
         }
         
        this.interval_id = setInterval(() => this.sendCommand(), this.time_interval*1000);

             
     },
     sendCommand(){
         this.time += this.time_interval;        //in seconds
         if(this.time >= this.max_value){
             this.stopCommand();
         }

         if(this.mode == 'dc_motor'){
             let signal = (this.time/this.motor_max_voltage) * 255;
             this.dataSocket.send(JSON.stringify({
				cmd: "set_speed",
				param: signal
			}));
         } else if(this.mode == 'pid_speed'){
             let rpm = this.time;         
             this.dataSocket.send(JSON.stringify({
				cmd: "set_speed",
				param: rpm
			}));
         }
         
     },
     stopCommand(){
         clearInterval(this.interval_id);
     }
  }
}
</script>

<style scoped>



#run       {background-color: #4CAF50FF;}
#run:hover {background-color: #3e8e41} 


</style>