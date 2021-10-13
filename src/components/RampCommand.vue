//vue3 update
//Firmware has been updated to include a ramp function
//This component now just needs to send a slightly different command to the firmware.

<template>
    <div class="row d-flex justify-content-center m-4" @mousedown="setDraggable(false)" @mouseup="setDraggable(true)">  
            <div class='col-auto'>
                <div class='input-group' v-if='mode == "speedRaw"'>
                    <span class='input-group-text' for="ramp_gradient"><b>Ramp gradient (Vs<sup>-1</sup>)</b></span>
                    <input class='form-control' id="ramp_gradient" v-model="ramp_gradient">
                    <button class='btn btn-lg' id="run" v-if='!isPositionRampRunning' @click="runRamp">Run</button>
                </div>

                <div class='input-group' v-else-if='mode == "speedPid"'>
                    <span class='input-group-text' for="ramp_gradient"><b>Ramp gradient (rads<sup>-2</sup>)</b></span>
                     <input class='form-control' id="ramp_gradient" v-model="ramp_gradient">
                     <button class='btn btn-lg' id="run" v-if='!isPositionRampRunning' @click="runRamp">Run</button>
                </div>

                <div class='input-group' v-else-if='mode == "positionPid"'>
                    <span class='input-group-text' for="ramp_gradient"><b>Ramp gradient (rads<sup>-1</sup>)</b></span>
                    <input class='form-control' id="ramp_gradient" v-model="ramp_gradient">
                    <button class='btn btn-lg' id="run" v-if='!isPositionRampRunning' @click="runRamp">Run</button>
                    <button class='btn btn-lg btn-danger' v-else-if='isPositionRampRunning' id="stop" @click="stopRamp">Stop</button>
                </div>


            </div>


        <!-- <div class="row justify-content-center m-2" @mousedown="setDraggable(false)" @mouseup="setDraggable(true)">   
            <div class='col'> 
                <label v-if='mode == "speedRaw"' class='m-2' for="ramp_gradient"><b>Ramp gradient (Vs<sup>-1</sup>)</b></label>
                <label v-else-if='mode == "positionPid"' class='m-2' for="ramp_gradient"><b>Ramp gradient (rads<sup>-1</sup>)</b></label>
                <label v-else-if='mode == "speedPid"' class='m-2' for="ramp_gradient"><b>Ramp gradient (rads<sup>-2</sup>)</b></label>
            </div>
            <div class='col'>
                <input id="ramp_gradient" v-model="ramp_gradient">
            </div>
            <div class='col d-grid gap-2 d-sm-block'>
                <button class='btn btn-lg' id="run" v-if='!isPositionRampRunning' @click="runRamp">Run</button>
                <button class='btn btn-lg btn-danger' v-else-if='isPositionRampRunning' id="stop" @click="stopRamp">Stop</button>
            </div>
        </div> -->


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
        //time_until_ramp: 0,
        ramp_gradient: 1,            
        //ramp_start: 1,
        //motor_max_voltage: 12,
        //encoder_max: 1000,
        //time: 0,
        //time_interval: 0.1,          //seconds
        //interval_id: null,
        //max_value: 6,
        //initial_angle: 0,
        //tooltip_delay: 2000,
        //max_position_ramp: 2*Math.PI,
        //max_speed_ramp: 50,
        //max_voltage_ramp: 12,
        isPositionRampRunning: false,
    }
  },
  computed:{
      ...mapGetters([
          'getCurrentMode'
      ])
  },
  watch:{
      //may not be necessary since sendCommand checks the mode anyway and calls stopCommand if not in appropriate mode.
    //   getCurrentMode(mode){
    //       if(mode == 'stopped'){
    //           this.stopCommand();
    //       }
    //   }
  },
  methods: {
      ...mapActions([
          'setDraggable'
      ]),
    //  runCommand(){
    //      if(!this.isRampRunning){
    //          if(this.$store.getters.getIsDataRecorderOn){
    //              this.$store.dispatch('setIsRecording', true);
    //          }
             
    //          this.$emit('showinputtype', false);
    //          this.time = 0;
    //         this.time_interval = parseFloat(this.time_interval);
    //         this.ramp_gradient = Math.abs(parseFloat(this.ramp_gradient));     //only positive gradients
    //         //set store state for access by graph input component
    //         let ramp = {
    //             ramp_start: 0,
    //             ramp_gradient: this.ramp_gradient,
    //             ramp_start_time: this.time_until_ramp,
    //             max_voltage: 12,
    //             max_rad_s: 200,
    //         }
            
    //         this.$store.dispatch('setRamp', ramp);
            
    //         this.initial_angle = this.$store.getters.getCurrentAngle;         //new!!!!!!!!!!!!!!!!!!!!!!!!!
            
    //         this.interval_id = setInterval(() => this.sendCommand(), this.time_interval*1000);
            
    //         this.isRampRunning = true;
    //      }
         
        
       
    //  },
    //firmware implementation of ramp means just need to send appropriate command to firmware to set ramp mode and then enter the correct mode -> voltage, position, speed
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
    //  sendCommand(){
    //      this.time += this.time_interval;        //in seconds
    //      let ramp_value = this.ramp_gradient * this.time;

    //      if(this.mode == 'speedRaw'){
             
    //          let signal = parseFloat(ramp_value) + parseFloat(this.ramp_start);
    //          this.$store.dispatch('setVoltage', signal);

    //      } else if(this.mode == 'speedPid'){  
             
    //          let rad_s = parseFloat(ramp_value) + parseFloat(this.ramp_start);  
    //          this.$store.dispatch('setSpeed', rad_s);

    //      } else if(this.mode == 'positionPid'){

    //          let new_ang_rad = parseFloat(ramp_value) + parseFloat(this.initial_angle);
    //          this.$store.dispatch('setPosition', new_ang_rad);

    //      } else{
    //          this.stopCommand();
    //      }
         
    //  },
    //  stopCommand(){
    //      clearInterval(this.interval_id);
    //      this.isRampRunning = false;
    //  },
    //  setStart(){
    //     let signal = parseFloat(this.ramp_start);

    //     if(this.mode == 'speedRaw'){
    //         this.$store.dispatch('setVoltage', signal);
    //     } else {
    //         this.$store.dispatch('setSpeed', signal);
    //     }
    //  },
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