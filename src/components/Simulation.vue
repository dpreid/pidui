<template>
<div class='m-2 p-2 bg-white border rounded'>
    <div class='row'>
        <div class="col-12">
            <unity src="/Build/MotorSimulationBuild.json" unityLoader="/Build/UnityLoader.js" ref="myInstance"></unity>
        </div>
    </div>
    <div class='row'>
        <div class='m-2 p-2 bg-white border rounded col'>
            <div class="row m-2 justify-content-center align-items-center">
                <button class="btn btn-default btn-xs" v-if="!isRecording" id="recordButton" @click="record">Record</button>
                <button class="btn btn-default btn-xs" v-if="isRecording" id="stopButton" @click="stopRecording">Stop</button>
                <button class="btn btn-default btn-xs" id="clearButton" @click="clearGraph">Reset</button>
                <button class="btn btn-default btn-xs" v-if='hasData' id="outputButton" @click="outputToCSV">Download CSV</button>
            </div>
        
        </div>
    </div>
</div>
</template>

<script>

import { store } from "../simplestore.js";
import { eventBus } from "../main";
import Unity from 'vue-unity-webgl';



export default {
    name: "Simulation",
    components: {
        Unity,
    },
    data(){
        return{
            dataStore: store,
            isRecording: false,
            current_mode: '',   //positionPid, speedPid, speedRaw
            start_time: 0.0,
        }
    },
    computed:{
        hasData(){
            return store.getNumData !== 0;
      },
      dataUpdate(){
          return this.dataStore.state.unityDataObject;
      }
    },
    watch:{
        dataUpdate(){
            this.getUnityData(this.dataStore.state.unityDataObject);
        },
    },
    created(){
		//window.addEventListener('unitydata', (e) => this.getUnityData(e.detail))
	},
	mounted(){
		//console.log(window.dataStore);

    },
    methods: {
        getUnityData(data){
            if(this.isRecording){
                if(store.getNumData() == 0){
                    this.start_time = data.t;
                }

                let time = data.t - this.start_time;

                let data_object = {id: store.getNumData(), t: parseFloat(time), theta: data.theta, omega: data.omega, theta_deg:data.theta_deg, omega_rad: data.omega_rad, p: data.p, i: data.i, d: data.d};
                
                if(data.mode != this.current_mode){
                    if(data.mode == "positionPid"){
                        store.state.graphDataParameter = 'theta';
                        this.current_mode = data.mode;
                    } else
                    {
                        store.state.graphDataParameter = 'omega';
                        this.current_mode = data.mode;
                    }
                }
                

                store.addData(data_object);
            }
            
        },
        record(){
            this.isRecording = true;
      },
      stopRecording(){
          this.isRecording = false;
      },
        clearGraph(){
          store.clearAllData();
          eventBus.$emit('clearalldata');
      },
        outputToCSV(){
          let csv = '';
          let filename = '';
            let date = new Date();
            filename = date.getDate().toString() + (date.getMonth() + 1).toString() + date.getFullYear().toString() + "_SIM_";
          if(store.state.graphDataParameter == 'theta'){
              filename += 'Position';
              csv = 'Time/s,Angle/rad,p,i,d\n';
            //let data = this.$store.getters.getData;
            let data = store.state.data;
            data.forEach(function(d){
                csv += d.t.toString();
                csv += ",";
                csv += d.theta.toString();
                csv += ",";
                csv += d.p.toString();
                csv += ",";
                csv += d.i.toString();
                csv += ",";
                csv += d.d.toString();
                csv += "\n";
            });
          } else if(store.state.graphDataParameter == 'omega'){
              filename += 'AngularVelocity';
              csv = 'Time/s,AngVel/rad/s,p,i,d\n';
            //let data = this.$store.getters.getData;
            let data = store.state.data;
            data.forEach(function(d){
                csv += d.t.toString();
                csv += ",";
                csv += d.omega_rad.toString();
                csv += ",";
                csv += d.p.toString();
                csv += ",";
                csv += d.i.toString();
                csv += ",";
                csv += d.d.toString();
                csv += "\n";
            });
          } else{
              csv = 'Time/s,Angle/rad,AngVel/rad/s,p,i,d\n';
            //let data = this.$store.getters.getData;
            let data = store.state.data;
            data.forEach(function(d){
                csv += d.t.toString();
                csv += ",";
                csv += d.theta.toString();
                csv += ',';
                csv += d.omega_rad.toString();
                csv += ",";
                csv += d.p.toString();
                csv += ",";
                csv += d.i.toString();
                csv += ",";
                csv += d.d.toString();
                csv += "\n";
            });
          }
            filename += '.csv';
          //console.log(csv);
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
#recordButton       {background-color: rgb(0, 255, 8);}
#recordButton:hover {background-color: #3e8e41} 

#stopButton       {background-color: #e13131ff;}
#stopButton:hover {background-color: #cc1e1eff;}

#clearButton  {background-color: #e17a31ff;}
#clearButton:hover  {background-color: #cc661eff;}

#outputButton        {background-color: #e1b131ff;}
#outputButton:hover  {background-color: #cc9d1eff;}
</style>