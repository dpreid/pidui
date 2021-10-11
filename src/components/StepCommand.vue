//vue3 update

<template>
    <div class='m-2 p-2'>
        <div class="row justify-content-center" @mousedown="setDraggable(false)" @mouseup="setDraggable(true)">    
            <div class='col-4'>
                <label v-if='mode == "speedRaw"' class='m-2' for="step_raw">Step size (0 - {{max_voltage_step}}V)</label>
                <label v-else-if='mode == "positionPid"' class='m-2' for="step_speed">Step size (0 - {{max_position_step.toFixed(2)}} rad)</label>
                <label v-else-if='mode == "speedPid"' class='m-2' for="step_position">Step size (0 - {{max_speed_step}} rad/s)</label>
            </div>
            <div class='col-4'>
                <input v-if='mode == "speedRaw"' id="step_raw" v-model="step_size" max='max_voltage_step' min='-max_voltage_step'>
                <input v-else-if='mode == "speedPid"' id="step_speed" v-model="step_size" max='max_speed_step' min='-max_speed_step'>
                <input v-else-if='mode == "positionPid"' id="step_position" v-model="step_size" max='max_position_step' min='-max_position_step'>
            </div>

            <div class='col-4 d-grid gap-2 d-sm-block'>
                <button class='btn btn-sm' v-if='!position_running' id="run" @click="runCommand">Run</button>
                <button class='btn btn-sm' v-if='position_running' id="wait" @click="wait">Stop</button>
            </div>
        </div>


     </div>   
</template>

<script>
import { mapActions } from 'vuex';

export default {

  name: 'StepCommand',
  props:{
      mode: String,
      dataSocket: WebSocket,
  },
  emits:['showinputtype'],
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
      let version = this.$store.getters.getRemoteLabVersion;
        if( version == 'variable_governor'){
            this.max_position_step = Math.PI;             //variable governor can spin full circle
        } else if(version == 'robot_arm'){
            this.max_position_step = 3*Math.PI/10;          //robot arm is soft limited to 300 encoder steps from 0.
        }
	},
  mounted(){
      this.position_running = false;      
  },
  methods: {
      ...mapActions([
          'setDraggable'
      ]),
     runCommand(){
         if(this.$store.getters.getIsDataRecorderOn){
                 this.$store.dispatch('setIsRecording', true);
             }
         this.$emit('showinputtype', false);
         
         let step = {
             step_time: this.time_to_step,
             step_start: 0,
             step_size: this.step_size
         }
         this.$store.dispatch('setStep', step);
         
        this.sendCommand();
             
     },
     sendCommand(){
         if(this.mode == 'speedRaw'){
             let signal = parseFloat(this.step_size);
             this.dataSocket.send(JSON.stringify({
				set: "volts",
				to: signal
			}));
         } else if(this.mode == 'positionPid'){
             this.position_running = true;                      //NEW !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
             let new_ang_rad = this.$store.getters.getCurrentAngle + parseFloat(this.step_size);

             this.dataSocket.send(JSON.stringify({
				set: "position",
				to: new_ang_rad
			}));
         } else if(this.mode == 'speedPid'){
             let rad_s = this.$store.getters.getCurrentAngularVelocity*2*Math.PI/60.0 + parseFloat(this.step_size);           //needs to be in rad/s
             this.dataSocket.send(JSON.stringify({
				set: "velocity",
				to: rad_s
			}));
         }
         
     },
     wait(){
            //this is an internal mode in the firmware and does not need to be reflected in the UI.
            this.position_running = false;				//NEW !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			this.dataSocket.send(JSON.stringify({
				set: "mode",
				to: "wait"
				}));
		},
     
  }
}
</script>

<style scoped>
input{
    min-width: 20%;
    max-width: 50%;
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