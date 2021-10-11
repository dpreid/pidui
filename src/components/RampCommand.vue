//vue3 update

<template>
    <div class='m-2 p-2'>
        <div class="row justify-content-center" @mousedown="setDraggable(false)" @mouseup="setDraggable(true)">  
            <div class='col'>
                <label class='m-2' v-if='mode == "speedRaw"' for="ramp_start"><b>Start Voltage(0-12V)</b></label>
                <label class='m-2' v-else-if='mode == "speedPid"' for="ramp_start"><b>Start Ang. Vel. (rads<sup>-1</sup>)</b></label>
            </div>
            <div class='col'>
                <input v-if='mode == "speedRaw" || mode == "speedPid"' id="ramp_start" class='mr-2' v-model="ramp_start">
            </div>
            <div class='col d-grid gap-2 d-sm-block'>
                <button class='btn btn-lg' v-show="mode == 'speedRaw' || mode == 'speedPid'" id="set" @click="setStart">Set</button>
            </div>
        </div>


        <div class="row justify-content-center m-2">   
            <div class='col'> 
                <label v-if='mode == "speedRaw"' class='m-2' for="ramp_gradient"><b>Ramp gradient (Vs<sup>-1</sup>)</b></label>
                <label v-else-if='mode == "positionPid"' class='m-2' for="ramp_gradient"><b>Ramp gradient (rads<sup>-1</sup>)</b></label>
                <label v-else-if='mode == "speedPid"' class='m-2' for="ramp_gradient"><b>Ramp gradient (rads<sup>-2</sup>)</b></label>
            </div>
            <div class='col'>
                <input id="ramp_gradient" v-model="ramp_gradient">
            </div>
            <div class='col d-grid gap-2 d-sm-block'>
                <button class='btn btn-lg' id="run" v-if="mode != 'stopped'" @click="runCommand" :disabled="isRampRunning">Run</button>
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
      dataSocket: WebSocket,
  },
  emits:['showinputtype'],
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
  computed:{
      ...mapGetters([
          'getCurrentMode'
      ])
  },
  watch:{
      //may not be necessary since sendCommand checks the mode anyway and calls stopCommand if not in appropriate mode.
      getCurrentMode(mode){
          if(mode == 'stopped'){
              this.stopCommand();
          }
      }
  },
  methods: {
      ...mapActions([
          'setDraggable'
      ]),
     runCommand(){
         if(!this.isRampRunning){
             if(this.$store.getters.getIsDataRecorderOn){
                 this.$store.dispatch('setIsRecording', true);
             }
             
             this.$emit('showinputtype', false);
             this.time = 0;
            this.time_interval = parseFloat(this.time_interval);
            this.ramp_gradient = Math.abs(parseFloat(this.ramp_gradient));     //only positive gradients
            //set store state for access by graph input component
            let ramp = {
                ramp_start: 0,
                ramp_gradient: this.ramp_gradient,
                ramp_start_time: this.time_until_ramp,
                max_voltage: 12,
                max_rad_s: 200,
            }
            
            this.$store.dispatch('setRamp', ramp);
            
            this.initial_angle = this.$store.getters.getCurrentAngle;         //new!!!!!!!!!!!!!!!!!!!!!!!!!
            
            this.interval_id = setInterval(() => this.sendCommand(), this.time_interval*1000);
            
            this.isRampRunning = true;
         }
         
        
       
     },
     sendCommand(){
         this.time += this.time_interval;        //in seconds
         let ramp_value = this.ramp_gradient * this.time;

         if(this.mode == 'speedRaw'){
            let signal = parseFloat(ramp_value) + parseFloat(this.ramp_start);
             this.dataSocket.send(JSON.stringify({
				set: "volts",
				to: signal
			}));
         } else if(this.mode == 'speedPid'){  
            let rad_s = parseFloat(ramp_value) + parseFloat(this.ramp_start);  
             this.dataSocket.send(JSON.stringify({
				set: "velocity",
				to: rad_s
			}));
         } else if(this.mode == 'positionPid'){
             let new_ang_rad = parseFloat(ramp_value) + parseFloat(this.initial_angle);
             this.dataSocket.send(JSON.stringify({
				set: "position",
				to: new_ang_rad
			}));
         } else{
             this.stopCommand();
         }
         
     },
     stopCommand(){
         clearInterval(this.interval_id);
         this.isRampRunning = false;
     },
     setStart(){
        let signal = parseFloat(this.ramp_start);

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