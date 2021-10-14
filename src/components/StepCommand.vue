//vue3 update

<template>
        
        <div class="row d-flex justify-content-center m-4" @mousedown="setDraggable(false)" @mouseup="setDraggable(true)">  
            <div class='col-auto'>
                <div class='input-group' v-if='mode == "speedRaw"'>
                    <span class='input-group-text' for="step_raw">Step size (0 - {{max_voltage_step}}V)</span>
                    <input type="number" :max='max_voltage_step' :min='-max_voltage_step' :class="(parseFloat(step_size) >= -max_voltage_step && parseFloat(step_size) <= max_voltage_step) ? 'form-control' : 'form-control is-invalid'" id="step_raw" v-model="step_size">
                    <button class='btn btn-lg' id="run" @click="runStep">Run</button>
                </div>
            

                <div class='input-group' v-else-if='mode == "speedPid"'>
                    <span class='input-group-text' for="step_speed">Step size (0 - {{max_speed_step}} rad/s)</span>
                    <input type="number" :max='max_speed_step' :min='-max_speed_step' :class="(parseFloat(step_size) >= -max_speed_step && parseFloat(step_size) <= max_speed_step) ? 'form-control' : 'form-control is-invalid'" id="step_speed" v-model="step_size">
                    <button class='btn btn-lg' id="run" @click="runStep">Run</button>
                </div>

                <div class='input-group' v-else-if='mode == "positionPid"'>
                    <span class='input-group-text' for="step_speed">Step size (0 - {{max_position_step.toFixed(2)}} rad)</span>
                    <input type="number" step='0.01' :max='max_position_step.toFixed(2)' :min='-max_position_step.toFixed(2)' :class="(parseFloat(step_size) >= -max_position_step && parseFloat(step_size) <= max_position_step) ? 'form-control' : 'form-control is-invalid'" id="step_position" v-model="step_size" >
                    <button class='btn btn-lg' v-if='!isPositionStepRunning' id="run" @click="runStep">Run</button>
                    <button class='btn btn-lg btn-danger' v-else-if='isPositionStepRunning' id="wait" @click="stopStep">Stop</button>
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
  },
  emits:['showinputtype'],
  data () {
    return {
        step_size: 0.00,            
        max_position_step: 6, 
        max_speed_step: 100,
        max_voltage_step: 10,
        isPositionStepRunning: false,
    }
  },
  created(){
      let version = this.$store.getters.getRemoteLabVersion;
        if( version == 'variable_governor'){
            this.max_position_step = Math.PI;             //variable governor can spin full circle
        } else if(version == 'robot_arm'){
            this.max_position_step = 3*Math.PI/10;          //robot arm is soft limited to 300 encoder steps from 0.
        }
	},
  methods: {
      ...mapActions([
          'setDraggable'
      ]),
     runStep(){
         if(this.$store.getters.getIsDataRecorderOn){
                 this.$store.dispatch('setIsRecording', true);
             }

         this.$emit('showinputtype', false);
         
        //  let step = {
        //      step_time: this.time_to_step,
        //      step_start: 0,
        //      step_size: this.step_size
        //  }
        //  this.$store.dispatch('setStep', step);
         
        this.sendCommand();
             
     },
     sendCommand(){
         if(this.mode == 'speedRaw'){
             
             this.isPositionStepRunning = false; 
             let signal = parseFloat(this.step_size);
             this.$store.dispatch('setVoltage', signal);

         } else if(this.mode == 'positionPid'){

             this.isPositionStepRunning = true;                      //NEW !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
             let new_ang_rad = this.$store.getters.getCurrentAngle + parseFloat(this.step_size);
             this.$store.dispatch('setPosition', new_ang_rad);

         } else if(this.mode == 'speedPid'){

             this.isPositionStepRunning = false; 
             let rad_s = this.$store.getters.getCurrentAngularVelocity + parseFloat(this.step_size);           //needs to be in rad/s
             this.$store.dispatch('setSpeed', rad_s);

         }
         
     },
     stopStep(){
            //this is an internal mode in the firmware and does not need to be reflected in the UI.
            this.isPositionStepRunning = false;				//NEW !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			
            this.$emit('showinputtype', true);

            if(this.$store.getters.getIsRecording){
                 this.$store.dispatch('setIsRecording', false);
             }

             this.$store.dispatch('wait');
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