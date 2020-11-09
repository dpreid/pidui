<template>
    <div class='m-2 p-2 bg-white border rounded'>
        <div class="row justify-content-center">
            <h2 for="addCommand">Step Input</h2>
        </div>
        <div class="row justify-content-center">    

            <label v-if='mode == "dc_motor"' for="step_size">Step size (V)</label>
            <label v-if='mode == "pid_position"' for="step_size">Step size (degrees)</label>
            <label v-if='mode == "pid_speed"' for="step_size">Step size (rad/s)</label>
            <input id="step_size" size="5" v-model="step_size">
            <label for="time_interval">After</label>
            <input id="time_interval" size="5" v-model="time_to_step">
            <label for="time_interval">seconds</label>

            <button id="run" @click="runCommand">Run</button>

        </div>


     </div>   
</template>

<script>
import { store } from "../simplestore.js";
//import { eventBus } from "../main.js";

export default {

  name: 'StepCommand',
  props:{
      mode: String
  },
  data () {
    return {
        dataSocket: null,
        time_to_step: 0,
        step_size: null,
        motor_max_voltage: 12,
        encoder_max: 1000,
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
             let signal = store.state.current_ang_vel + this.step_size;         //this is in rad/s
             let rpm = (signal / (2.0*Math.PI))*60;                     
             this.dataSocket.send(JSON.stringify({
				cmd: "set_speed",
				param: rpm
			}));
         }
         
     }
  }
}
</script>

<style scoped>
.row{
    border-style: solid;
    border-width: medium;
    border-color: green;
}


button {
	padding: 2px 2px;
	font-size: 24px;
	text-align: center;
	cursor: pointer;
	outline: none;
	color: rgb(255, 255, 255);

	border: none;
	border-radius: 15px;
	/* box-shadow: 0 9px #999; */
}

/*	background-color: #4CAF50;
 .button:hover {background-color: #3e8e41}*/

button:active {
	background-color: #3e8e41;
	box-shadow: 0 5px #666;
	transform: translateY(4px);
}


#addButton       {background-color: #4CAF50FF;}
#addButton:hover {background-color: #3e8e41} 

#deleteButton       {background-color: #e13131ff;}
#deleteButton:hover {background-color: #cc1e1eff;}

#startCommands  {background-color: #4CAF50FF;}
#startCommands:hover  {background-color: #3e8e41;}

#stopCommands        {background-color: #e1b131ff;}
#stopCommands:hover  {background-color: #cc9d1eff;}

#clearCommands        {background-color: #e13131ff;}
#clearCommands:hover  {background-color: #cc1e1eff;}

label {
    font-size:20px;
    color: #0501f7;
    font-weight: bold;
    display: inline-block;
    vertical-align: middle;
    width: 100px;
    /* float: left; */
}
</style>