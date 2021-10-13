//v2 update - added commandStore commands

<template>
<div class='m-0 p-0 bg-white'>
   <div class="form-group row justify-content-center align-items-center">
        <label class="col-lg-2 col-sm-6 col-form-label" for="voltage">Input voltage ({{getVoltageAsString}}V)</label>
        <div class="col-lg-4" @mousedown="setDraggable(false)" @mouseup="setDraggable(true)">
            <input type="range" class="form-range" :min="-maxV" :max="maxV" step="0.01" v-model="voltage" list='tickmarks' id="voltage" @change='setVoltage'>
            <div class='row'>
                <div class='col-4'><button type='button' class='btn btn-outline-primary btn-sm' @click='incrementVoltage(-0.1)'>-</button></div>
                <div class='col-4'><label type='label' class='col-form-label'>0.1V</label></div>
                <div class='col-4'><button type='button' class='btn btn-outline-primary btn-sm' @click='incrementVoltage(+0.1)'>+</button></div>
            </div>
            <div class='row'>
                <div class='col-4'><button type='button' class='btn btn-outline-primary btn-sm' @click='incrementVoltage(-0.01)'>-</button></div>
                <div class='col-4'><label class='col-form-label'>0.01V</label></div>
                <div class='col-4'><button type='button' class='btn btn-outline-primary btn-sm' @click='incrementVoltage(+0.01)'>+</button></div>
            </div>
        </div>

        <label class="col-lg-2 col-sm-6 col-form-label" for="ang_vel">Motor angular velocity (rad/s)</label>
        <div class='col-lg-4 col-sm-12' v-if='isAnalogueOutput'>
            <analogue-output :outputValue="getCurrentAngularVelocity" :minValue="0" :maxValue="400" :intervalValue="50" :minorIntervalValue="10"></analogue-output>
        </div>
        <div v-else class='col-lg-4 col-sm-12'>
            <input type='text' class='form-control' id="ang_velocity" :value='avgAngVel' readonly>
        </div>

    </div>
</div>

</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import AnalogueOutput from "./AnalogueOutput.vue";

export default {

  name: 'DCMotorPanel',
  props: {
      dataSocket: WebSocket,
      maxV: Number,
  },
  components: {
    AnalogueOutput
  },
  data () {
    return {
        voltage: 0,
        isAnalogueOutput: true,
    }
  },
  computed:{
      ...mapGetters([
          'getCurrentAngularVelocity',
          'calculateAverageVelocity',
      ]),
      getVoltageAsString(){
          let num = Number(this.voltage);
          return num.toFixed(2);
      },
      avgAngVel(){
          let average = this.calculateAverageVelocity;
          return average.toFixed(2);
      }
  },
  methods: {
      ...mapActions([
          'setDraggable'
      ]),
      setVoltage(){
          this.$store.dispatch('setVoltage', this.voltage);
      },
      incrementVoltage(delta){
          this.voltage = Number(this.voltage) + Number(delta);
          this.setVoltage();
      }
      
      
  }
}
</script>

<style scoped>



</style>