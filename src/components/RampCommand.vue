//vue3 update
//Firmware has been updated to include a ramp function
//This component now just needs to send a slightly different command to the firmware.

<template>
    <div class="row d-flex justify-content-center m-4" @mousedown="setDraggable(false)" @mouseup="setDraggable(true)">  
            <div class='col-auto'>
                <div class='input-group' v-if='mode == "speedRaw"'>
                    <span class='input-group-text' for="ramp_gradient"><b>Ramp gradient (Vs<sup>-1</sup>)</b></span>
                    <input type="number" :max='max_voltage_ramp' :min='-max_voltage_ramp' :class="(parseFloat(ramp_gradient) >= -max_voltage_ramp && parseFloat(ramp_gradient) <= max_voltage_ramp) ? 'form-control' : 'form-control is-invalid'" id="ramp_gradient" v-model="ramp_gradient">
                    <button class='btn btn-lg' id="run" v-if='!isPositionRampRunning' @click="runRamp">Run</button>
                </div>

                <div class='input-group' v-else-if='mode == "speedPid"'>
                    <span class='input-group-text' for="ramp_gradient"><b>Ramp gradient (rads<sup>-2</sup>)</b></span>
                     <input type="number" :max='max_speed_ramp' :min='-max_speed_ramp' :class="(parseFloat(ramp_gradient) >= -max_speed_ramp && parseFloat(ramp_gradient) <= max_speed_ramp) ? 'form-control' : 'form-control is-invalid'" id="ramp_gradient" v-model="ramp_gradient">
                     <button class='btn btn-lg' id="run" v-if='!isPositionRampRunning' @click="runRamp">Run</button>
                </div>

                <div class='input-group' v-else-if='mode == "positionPid"'>
                    <span class='input-group-text' for="ramp_gradient"><b>Ramp gradient (rads<sup>-1</sup>)</b></span>
                    <input type="number" :max='max_position_ramp' :min='-max_position_ramp' :class="(parseFloat(ramp_gradient) >= -max_position_ramp && parseFloat(ramp_gradient) <= max_position_ramp) ? 'form-control' : 'form-control is-invalid'" id="ramp_gradient" v-model="ramp_gradient">
                    <button class='btn btn-lg' id="run" v-if='!isPositionRampRunning' @click="runRamp">Run</button>
                    <button class='btn btn-lg btn-danger' v-else-if='isPositionRampRunning' id="stop" @click="stopRamp">Stop</button>
                </div>


            </div>


     </div>   
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {

  name: 'RampCommand',
  props:{
      mode: String,
  },
  emits:['showinputtype'],
  data () {
    return {
        ramp_gradient: 1.00,            
        max_position_ramp: 6.00,
        max_speed_ramp: 100,
        max_voltage_ramp: 10,
        isPositionRampRunning: false,
    }
  },
  computed:{
      ...mapGetters([
          'getCurrentMode'
      ])
  },
  watch:{
    
  },
  methods: {
      ...mapActions([
          'setDraggable'
      ]),
    runRamp(){

        this.$emit('showinputtype', false);

        if(this.$store.getters.getIsDataRecorderOn){
            this.$store.dispatch('setIsRecording', true);
        }

        if(this.mode == 'positionPid'){
            this.isPositionRampRunning = true;
            this.$store.dispatch('setPositionRamp', this.ramp_gradient);
        } 
        else if(this.mode == 'speedPid'){
            this.isPositionRampRunning = false;
            this.$store.dispatch('setSpeedRamp', this.ramp_gradient);
        } 
        else if(this.mode == 'speedRaw'){
            this.isPositionRampRunning = false;
            this.$store.dispatch('setVoltageRamp', this.ramp_gradient);
        } else{
            this.isPositionRampRunning = false;
            this.$store.dispatch('setIsRecording', false);
        }
    

        
    },
    //only accessible in positionPid mode
    stopRamp(){
        this.isPositionRampRunning = false;

        this.$emit('showinputtype', true);

        if(this.$store.getters.getIsRecording){
            this.$store.dispatch('setIsRecording', false);
        }

        this.$store.dispatch('wait');   //wait state only exists for positionPid in firmware
        
    }
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

#set       {background-color: rgb(74, 223, 37);}
#set:hover {background-color: #0b7e0f} 

#run       {background-color:  rgb(74, 223, 37);}
#run:hover {background-color: #0b7e0f} 


</style>