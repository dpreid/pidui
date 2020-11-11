<template>
    <div class='m-2 p-2 bg-secondary border rounded'>
        <div class="row justify-content-center">
            <h2 for="addCommand">Ramp Input</h2>
        </div>
        <div class="row justify-content-center">    

            <label v-if='mode == "dc_motor"' for="step_size">Ramp gradient (V/s)</label>
            <label v-else-if='mode == "pid_position"' for="step_size">Ramp gradient (degree/s)</label>
            <label v-else-if='mode == "pid_speed"' for="step_size">Ramp gradient (rpm/s)</label>

            <input id="ramp_size" v-model.number="ramp_gradient" size="3">


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
        time_until_ramp: 0,
        ramp_gradient: 1,            //only positive ramps
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
         this.time = 0;
         this.ramp_gradient = Math.abs(this.ramp_gradient);     //only positive gradients
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
         }
         
         this.interval_id = setInterval(() => this.sendCommand(), this.time_interval*1000);
        
        

             
     },
     sendCommand(){
         this.time += this.time_interval;        //in seconds
         let ramp_value = this.ramp_gradient * this.time;
         if(ramp_value >= this.max_value){
             this.stopCommand();
         }

         if(this.mode == 'dc_motor'){
             let signal = (ramp_value/this.motor_max_voltage) * 255;
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