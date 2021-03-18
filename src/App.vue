<template>
  <div id="app" class='container-fluid-sm m-0'>
    <navigation-bar :remoteLabVersion="remoteLabVersion"/>

    
      <b-modal id="load-data-modal" title='Load data' v-model='showLoadDataModal' @ok="loadData">
              <p>Previously recorded data was saved on {{ saved_date }}. Do you want to load this previous data?</p>
          
              <template #modal-footer="{ ok, cancel }">
              <b-button size="sm" variant="success" @click="ok()">
                Load
              </b-button>
              <b-button size="sm" variant="danger" @click="cancel()">
                Cancel
              </b-button>
            </template>
          </b-modal>


        <div class='row'>
          <!-- LEFT HAND COLUMN -->
          <div class='col-sm-6'> 
              <streams />
           
            <div class='col-sm-12' v-if='isTableOn'><table-output :remoteLabVersion="remoteLabVersion"/></div>
          </div>

          <!-- RIGHT HAND COLUMN -->
          <div class='col-sm-6' > 
            <div v-if='isWorkspaceOn' class='row'>
              <instructions :isWorkspaceOn="isWorkspaceOn"/>
            </div>
            <div v-if='isSystemDiagramsOn' class='row'>
              <system-diagrams :remoteLabVersion="remoteLabVersion"/>
            </div>
            <div class='row'>
                <div class='col-sm-5' v-if='isDataRecorderOn && !isSimulationOn'><data-recorder :disableTooltips="disableTooltips"/></div> 
                <div class='col-sm-5' v-if='isStopwatchOn'><stopwatch /></div>
            </div>
            <div v-if='isSnapshotOn'><motor-snapshot /></div>
            <div v-if='isInputGraphOn'><graph-input type="graphinput" id="input0" /></div> 
            <div v-if='isGraphOn'><graph-output type="graph" id="graph0" /></div> 
            <!-- <div v-if='isGraphOn'><graph-output-v-2   /></div>  -->
            
          </div>
        </div>



        <div v-if="isWorkspaceOn">
          <workspace :mode="remoteLabVersion"/>
        </div>
      </div>
  <!-- </div> -->
</template>

<script>

import GraphOutput from "./components/GraphOutput.vue";
//import GraphOutputV2 from "./components/GraphOutputV2.vue";
import TableOutput from "./components/TableOutput.vue";
import Stopwatch from "./components/Stopwatch.vue";
import Workspace from "./components/Workspace.vue";
import DataRecorder from "./components/DataRecorder.vue";
import NavigationBar from "./components/NavigationBar.vue"; 
import GraphInput from "./components/GraphInput.vue";
import SystemDiagrams from "./components/SystemDiagrams.vue";
import MotorSnapshot from "./components/MotorSnapshot.vue";
import Instructions from "./components/Instructions.vue";
import { eventBus } from "./main.js";
import { store } from "./simplestore.js";

import Streams from './components/Streams.vue';


export default {
  name: 'App',
  components: {
    GraphOutput,
    //GraphOutputV2,
    //graphtest,
    TableOutput,
    Stopwatch,
    Workspace,
    DataRecorder,
    NavigationBar,
    GraphInput,
    SystemDiagrams,
    Streams,
    MotorSnapshot,
    Instructions,
  },
  data() {
   return {
      remoteLabVersion: 'spinning_disk', //'robot_arm', //, //'variable_governor', //, //, 
      isTableOn: false,
      isGraphOn: false,
      isStopwatchOn: false,
      isWorkspaceOn: false,
      isAutoCommandOn: false,
      isDataRecorderOn: false,
      isInputGraphOn: false,
      isSystemDiagramsOn: false,
      isSimulationOn: false,
      isSnapshotOn: false,
      disableTooltips: false,             //global tooltip setting
      showLoadDataModal: false,
      saved_date: '',
    }
  },
  created(){
    eventBus.$on('togglegraph', this.toggleGraph);
    eventBus.$on('clearworkspace', this.clearWorkspace);
    eventBus.$on('toggleworkspace', this.addWorkspace);
    eventBus.$on('toggledatarecorder', this.toggleDataRecorder);
    eventBus.$on('togglestopwatch', this.toggleStopwatch);
    eventBus.$on('toggletable', this.toggleTable);
    eventBus.$on('togglegraphinput', this.toggleInputGraph);
    eventBus.$on('togglesystemdiagrams', this.toggleSystemDiagrams);
    eventBus.$on('togglesimulation', this.toggleSimulation);
     eventBus.$on('togglesnapshot', this.toggleSnapshot);


    eventBus.$on('setexercise1v1', this.setExercise1v1Interface);
    eventBus.$on('setexercise1v2', this.setExercise1v2Interface);
    eventBus.$on('setexercise1v3', this.setExercise1v3Interface);
    eventBus.$on('setexercise2v1', this.setExercise2v1Interface);

    this.$store.dispatch('setRemoteLabVersion', this.remoteLabVersion);     //NEW
    this.$store.dispatch('setDataRecorder', this.isDataRecorderOn);     //NEW
    this.$store.dispatch('setDisableTooltips', this.disableTooltips);     //NEW
  },
  mounted(){
    if(store.hasDataToLoad(this.remoteLabVersion)){
      this.saved_date = JSON.parse(window.localStorage.getItem('dateSaved'));
      this.showLoadDataModal = true;
    } else{
      this.showLoadDataModal = false;
    }
      window.addEventListener('pagehide', () => {store.saveDataToLocalStorage(this.remoteLabVersion)});				//closing window
      window.addEventListener('beforeunload', () => {store.saveDataToLocalStorage(this.remoteLabVersion)});			//refreshing page, changing URL
  },
  methods: {
    addWorkspace(){
      this.isWorkspaceOn = true;
    },
    toggleGraph(){
      this.isGraphOn = !this.isGraphOn;
      //graph requires the data recorder in order to plot data so automatically add it when graph added - don't automatically remove it.
      if(this.isGraphOn){
        if(!this.isDataRecorderOn){
          this.toggleDataRecorder();
        }
        
      }
    },
    clearWorkspace(){
      this.isWorkspaceOn = false;
    },
    toggleDataRecorder(){
      this.isDataRecorderOn = !this.isDataRecorderOn;
      if(this.isDataRecorderOn){
        this.$store.dispatch('setDataRecorder', true);
      } else{
        this.$store.dispatch('setDataRecorder', false);
      }
      
    },
    toggleStopwatch(){
      this.isStopwatchOn = !this.isStopwatchOn;
    },
    toggleTable(){
      this.isTableOn = !this.isTableOn;
      if(this.isTableOn){
        if(!this.isDataRecorderOn){
            this.toggleDataRecorder();
        }
      }
    },
    toggleInputGraph(){
      this.isInputGraphOn = !this.isInputGraphOn;
    },
    toggleSystemDiagrams(){
      this.isSystemDiagramsOn = !this.isSystemDiagramsOn;
    },
    toggleSimulation(){
      this.isSimulationOn = !this.isSimulationOn;
    },
    toggleSnapshot(){
      this.isSnapshotOn = !this.isSnapshotOn;
      if(this.isSnapshotOn){
        if(!this.isDataRecorderOn){
          this.toggleDataRecorder();
        }
        
      }
    },
    setExercise1v1Interface(){
      this.isGraphOn = false;
      this.isDataRecorderOn = false;
      this.isTableOn = false;
      this.isInputGraphOn = false;
      this.isAutoCommandOn = false;
      this.isWorkspaceOn = false;
      
      eventBus.$emit('stop');
      eventBus.$emit('setdcmotormode');
      eventBus.$emit('setfreeinput');

    },
    setExercise1v2Interface(){
      this.isGraphOn = true;
      this.isDataRecorderOn = true;
      this.isTableOn = false;
      this.isInputGraphOn = true;
      this.isAutoCommandOn = false;
      this.isWorkspaceOn = false;
      
      eventBus.$emit('stop');
      eventBus.$emit('setdcmotormode');
      eventBus.$emit('setstepinput');
    },
    setExercise1v3Interface(){
      this.isGraphOn = true;
      this.isDataRecorderOn = true;
      this.isTableOn = false;
      this.isInputGraphOn = true;
      this.isAutoCommandOn = false;
      this.isWorkspaceOn = false;
      
      eventBus.$emit('stop');
      eventBus.$emit('setpidpositionmode');
      eventBus.$emit('setstepinput');
    },
    setExercise2v1Interface(){
      this.isGraphOn = true;
      this.isDataRecorderOn = true;
      this.isTableOn = false;
      this.isInputGraphOn = true;
      this.isAutoCommandOn = false;
      this.isWorkspaceOn = false;
      
      eventBus.$emit('stop');
      eventBus.$emit('setpidpositionmode');
      eventBus.$emit('setstepinput');
    },
    loadData(){
      store.loadDataFromLocalStorage();
      this.showLoadDataModal = false;
    },
  },
}


</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  background-color: rgba(161, 161, 161, 0.39);
}

.border{
  box-shadow: 0 1px 20px 0 rgba(0, 0, 0, 0.637);
}

</style>
