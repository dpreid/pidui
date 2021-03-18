<template>
<div class='m-2 p-2 bg-white border rounded'>
   <div class="form-group row justify-content-center align-items-center pb-2">
        <label class="col-sm-2 col-form-label" for="voltage">Input voltage ({{voltage}}V)</label>
        <div class="col-4"><input type="range" :min="-maxV" :max="maxV" step="0.1" v-model="voltage" class="slider" list='tickmarks' id="voltage" @change='setVoltage'></div>
            
        <label class="col-sm-2 col-form-label" for="ang_vel">Motor angular velocity (rad/s)</label>

        <div class='col-sm-4' v-if='isAnalogueOutput'>
            <analogue-output :outputValue="angVel" :minValue="0" :maxValue="400" :intervalValue="50" :minorIntervalValue="10"></analogue-output>
        </div>
        <div v-else class='col-sm-4'><input type='text' class='form-control' id="ang_velocity" :value='avgAngVel'></div>

    </div>
</div>

</template>

<script>
import { store } from "../simplestore.js";
//import { eventBus } from "../main.js";
//import ReconnectingWebSocket from 'reconnecting-websocket';
import AnalogueOutput from "./AnalogueOutput.vue";

export default {

  name: 'DCMotorPanel',
  props: {
      dataSocket: WebSocket,
      maxV: Number,
  },
  data () {
    return {
        data_store: store,
        voltage: 0,
        motor_max_voltage: 12.0,
        isAnalogueOutput: true,
    }
  },
  beforeMount(){

  },
  mounted(){

  },
  components: {
    AnalogueOutput
  },
  computed:{
      angVel(){
          let data = this.data_store.state.current_ang_vel;
          //convert to rad/s
          data = data*2*Math.PI/60;
          return data;
      },
      avgAngVel(){
          let average = this.data_store.calculateAverageVelocity();
          return average.toFixed(2);
      }
  },
  methods: {
      setVoltage(){
          //let signal = (this.voltage/this.motor_max_voltage) * 255;
          //let signal = this.voltage*100/6.0;        //signal is between 0-100% with 100% -> 6V.
          let signal = this.voltage;                //send raw voltage
          this.dataSocket.send(JSON.stringify({
				set: "volts",
				to: signal
			}));
      },
      
      
  }
}
</script>

<style scoped>



</style>