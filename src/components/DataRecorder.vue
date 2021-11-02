//Vue3 updated
//Streamlined data to not include alternative units

<template>
<div class='m-2 p-2 bg-white border rounded'>
    <div class="d-grid gap-2 d-sm-block">
        <button type='button' class="btn btn-sm" v-if="!getIsRecording && getInputMode == 'free'" id="recordButton" @click='$store.dispatch("setIsRecording", true)'>Record</button>
        <button type='button' class="btn btn-sm" v-if="getIsRecording" id="stopButton" @click='$store.dispatch("setIsRecording", false)'>Stop</button>
        <button type='button' class="btn btn-sm" id="clearButton" @click="toggleResetModal">Reset</button>
        <button type='button' class="btn btn-sm" v-if="hasData" id="outputButton" @click="outputToCSV">Download CSV</button>
    </div>
    <div class='row m-2 justify-content-center'>
      <div v-if='getIsRecording' class='col-2'>
        <img id='red-light' src='../../public/images/red-light.png' width='20' height='20' :hidden='!showRedLight'>
      </div>
      <div class='col-10'>  
        <p class='m-1'>Recorded: {{getNumData}}/{{getMaxDataPoints}} data points</p>
      </div>
    </div>


    <div v-if='showResetConfirmModal' class="modal modal-show" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Reset Data</h5>
              <button type="button" class="btn btn-close" data-bs-dismiss="modal" aria-label="Close" @click='toggleResetModal'>
                
              </button>
            </div>
            <div class="modal-body">
              <p>Are you sure you want to Reset? This will clear all stored data.</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" @click="clearData(); toggleResetModal();">Reset</button>
              <button type="button" class="btn btn-secondary" data-dismiss="modal" data-bs-dismiss="modal" @click="toggleResetModal">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    
</div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {

  name: 'DataRecorder',
  props:{
	
	},
  data () {
    return {
        stopped_recording: false,
        showResetConfirmModal: false,
    }
  },
  components: {
    
  },
  created(){
    
	},
  computed:{
    ...mapGetters([
        'getIsRecording',
        'getCurrentTime',
        'getInputMode',
        'getNumData',
        //'getCurrentAngle',
        //'getCurrentAngularVelocity',
        'getMaxDataPoints',
        'getCurrentAngleArray',
        'getCurrentAngularVelocityArray',
        'getCurrentTimeArray',
        'getTimeArray',
        'getCommandArray',
        'getDriveArray',
        'getErrorArray'
        
    ]),
      hasData(){
          return this.getNumData !== 0;
      },
      showRedLight(){
        return this.getNumData % 100 > 50 ? true : false;
      }
  },
  watch:{
    getIsRecording(now, prev){
        if(prev && !now){
          this.stopRecording();
        } else if(now){
          this.record();
        }
    },
    getCurrentTime(){
      if(this.getIsRecording && this.getNumData < this.getMaxDataPoints){
        this.plot();
      } else if(this.getNumData == this.getMaxDataPoints && !this.stopped_recording){
          this.stopRecording();
          this.stopped_recording = true;
      }
    },
  },
  methods: {
      record(){
          this.$store.dispatch('setStartTime', this.getCurrentTimeArray[0]);
      },
      stopRecording(){
        console.log('data recording stopped');
      },
      // plot(){
      //     let angle = parseFloat(this.getCurrentAngle); //rad
      //     let time = this.$store.getters.getTime;       //s
      //     let ang_vel = parseFloat(this.getCurrentAngularVelocity);  //rad/s
      //     let command = this.$store.getters.getCommand;
      //     let drive = this.$store.getters.getDrive;
      //     let error = this.$store.getters.getError;

      //     let data_object = {id: this.getNumData, t: parseFloat(time), theta: angle.toFixed(2), omega: ang_vel.toFixed(2), command: command, drive: drive, error: error, showDataPoint: true};
      //     this.$store.dispatch('addData', data_object);
          

      // },
      plot(){
          let angles = this.getCurrentAngleArray; //rad
          let times = this.getTimeArray;       //s
          let ang_vels = this.getCurrentAngularVelocityArray;  //rad/s
          let commands = this.getCommandArray;
          let drives = this.getDriveArray;
          let errors = this.getErrorArray;

          angles.forEach((angle, index) => {
              let data_object = {id: this.getNumData, t: parseFloat(times[index]), theta: angle.toFixed(2), omega: ang_vels[index].toFixed(2), command: commands[index], drive: drives[index], error: errors[index]};
              this.$store.dispatch('addData', data_object);
          })

      },
      clearData(){
          this.$store.dispatch('clearAllData');
          //this.max_reached = false;
      },
      toggleResetModal(){
          this.showResetConfirmModal = !this.showResetConfirmModal;
      },
      outputToCSV(){
          let csv = '';
          let filename = '';
            let date = new Date();
            filename = date.getDate().toString() + (date.getMonth() + 1).toString() + date.getFullYear().toString();
              csv = 'Time/s,Angle/rad,AngVel/rad/s,Command,Drive,Error\n';
            let data = this.$store.getters.getData;
            data.forEach(function(d){
                csv += d.t.toString();
                csv += ",";
                csv += d.theta.toString();
                csv += ',';
                csv += d.omega.toString();
                if(d.command != null){
                  csv += ",";
                  csv += d.command.toString();
                } else {
                  csv += ",";
                  csv += "";
                }
                if(d.drive != null){
                  csv += ",";
                  csv += d.drive.toString();
                } else{
                  csv += ",";
                  csv += "";
                }

                if(d.error != null){
                  csv += ",";
                  csv += d.error.toString();
                } else{
                  csv += ",";
                  csv += "";
                }    
                
                csv += "\n";
            });
          
            filename += '.csv';
         
          let hiddenElement = document.createElement('a');
          hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
          hiddenElement.target = '_blank';
          hiddenElement.download = filename;
          hiddenElement.click();
      },
      
  }
}
</script>

<style scoped>

.error{
    border:thick solid red
}

.error:focus{
    border:thick solid red
}

#recordButton       {background-color: rgb(0, 255, 8);}
#recordButton:hover {background-color: #3e8e41} 

#stopButton       {background-color: #e13131ff;}
#stopButton:hover {background-color: #cc1e1eff;}

#clearButton  {background-color: #e17a31ff;}
#clearButton:hover  {background-color: #cc661eff;}

#outputButton        {background-color: #e1b131ff;}
#outputButton:hover  {background-color: #cc9d1eff;}

.modal-show{
  display: block;
}

</style>