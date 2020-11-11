<template>
    <div class='m-2 p-2 bg-secondary border rounded'>
        <div class="row justify-content-center">
            <h2 for="addCommand">Step Input</h2>
        </div>
        <div class="row justify-content-center">    

            <label v-if='mode == "dc_motor"' for="step_size">Step size (V)</label>
            <label v-else-if='mode == "pid_position"' for="step_size">Step size (degrees)</label>
            <label v-else-if='mode == "pid_speed"' for="step_size">Step size (rpm)</label>

            <input id="step_size" v-model="step_size" size="3" @change='updateStore'>

            <label for="time_interval">After</label>
            <input id="time_interval" v-model="time_to_step" size="3" @change='updateStore'>
            <label for="time_interval">seconds</label>

            <button v-show="mode == 'dc_motor' || mode == 'pid_position' || mode == 'pid_speed'" id="run" @click="runCommand">Run</button>

        </div>


     </div>   
</template>

<script>
import ReconnectingWebSocket from 'reconnecting-websocket';
import { store } from "../simplestore.js";
import { eventBus } from "../main.js";

export default {

  name: 'StepCommand',
  props:{
      mode: String,
      dataSocket: ReconnectingWebSocket
  },
  data () {
    return {
        time_to_step: 0,
        step_size: null,            //only positive steps
        motor_max_voltage: 12,
        encoder_max: 1000,
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
         this.step_size = Math.abs(this.step_size);     //only positive steps
         //set store state for access by graph input component
        //  store.state.step.step_time = this.time_to_step;
        //  if(this.mode == "pid_position"){
        //      //store.state.step.step_start = store.state.current_angle * 180 / Math.PI;
        //     store.state.step.step_start = 0;
        //  } else{
        //      store.state.step.step_start = 0;
        //  }
        //  store.state.step.step_size = this.step_size;
         
         if(this.mode == 'pid_position'){
             eventBus.$emit('addstepfunction', 'angle');
         } else if(this.mode == 'pid_speed'){
             eventBus.$emit('addstepfunction', 'rpm');
         } else{
             eventBus.$emit('addstepfunction', 'voltage(V)');
         }
         
        
         
         await new Promise((resolve) => {
             setTimeout(() => resolve(this.sendCommand()), parseFloat(this.time_to_step)*1000);
        });

             
     },
     sendCommand(){
         
         if(this.mode == 'dc_motor'){
             let signal = (this.step_size/this.motor_max_voltage) * 255;
             this.dataSocket.send(JSON.stringify({
				cmd: "set_speed",
				param: signal
			}));
         } else if(this.mode == 'pid_position'){
             let new_ang_rad = store.state.current_angle + this.step_size*Math.PI / 180.0;
             let current_enc_pos = store.state.current_enc_pos;
             let new_enc_pos = current_enc_pos + this.encoder_max*new_ang_rad/Math.PI;

             if(new_enc_pos > 1000){
                 new_enc_pos = -(1000 - (new_enc_pos - 1000));
             } else if(new_enc_pos < -1000){
                 new_enc_pos = 1000 - (Math.abs(new_enc_pos) - 1000);
             }
             this.dataSocket.send(JSON.stringify({
				cmd: "set_position",
				param: new_enc_pos
			}));
         } else if(this.mode == 'pid_speed'){
             let rpm = store.state.current_ang_vel + this.step_size;         //this is in rpm
             //let rpm = (signal / (2.0*Math.PI))*60;                             //convert to rpm
             this.dataSocket.send(JSON.stringify({
				cmd: "set_speed",
				param: rpm
			}));
         }
         
     },
     updateStore(){
         store.state.step.step_time = this.time_to_step;

         if(this.mode == "pid_position"){
             //store.state.step.step_start = store.state.current_angle * 180 / Math.PI;
            store.state.step.step_start = 0;
         } else{
             store.state.step.step_start = 0;
         }
         store.state.step.step_size = this.step_size;
     }
  }
}
</script>

<style scoped>



#run       {background-color: #4CAF50FF;}
#run:hover {background-color: #3e8e41} 


</style>