<template>
  <div id="app" class='container-fluid-sm m-0'>
    <navigation-bar />

    <div v-if='!getLoggedIn'>
        <login  />
    </div>
    <div v-else>
        <div class='row'>
          <!-- LEFT HAND COLUMN -->
          <div class='col-sm-6'> 
            <webcam-stream />
            <control-panel /> 
            <div class='col-sm-12' v-if='isTableOn'><table-output /></div>
          </div>

          <!-- RIGHT HAND COLUMN -->
          <div class='col-sm-6' > 
            <div class='row'>
                <div class='col-sm-5' v-if='isDataRecorderOn'><data-recorder /></div> 
                <div class='col-sm-5' v-if='isStopwatchOn'><stopwatch /></div>
            </div>
            
            <div v-if='isInputGraphOn'><graph-input type="graphinput" id="input0" /></div> 
            <div v-if='isGraphOn'><graph-output type="graph" id="0" /></div> 
          </div>
        </div>


        <div v-if="isWorkspaceOn">
          <workspace />
        </div>
      </div>
  </div>
</template>

<script>
import GraphOutput from "./components/GraphOutput.vue";
import TableOutput from "./components/TableOutput.vue";
import Stopwatch from "./components/Stopwatch.vue";
import Workspace from "./components/Workspace.vue";
import WebcamStream from "./components/WebcamStream.vue";
import ControlPanel from "./components/ControlPanel.vue";
import DataRecorder from "./components/DataRecorder.vue";
//import AutoCommand from "./components/AutoCommand.vue";
import NavigationBar from "./components/NavigationBar.vue"; 
import GraphInput from "./components/GraphInput.vue";
import Login from "./components/Login.vue";

import { eventBus } from "./main.js";
import userData from './userDataStore';

export default {
  name: 'App',
  components: {
    GraphOutput,
    TableOutput,
    Stopwatch,
    Workspace,
    WebcamStream,
    ControlPanel,
    DataRecorder,
    //AutoCommand,
    NavigationBar,
    GraphInput,
    Login,
  },
  data() {
    return {
      isTableOn: false,
      isGraphOn: false,
      isStopwatchOn: false,
      isWorkspaceOn: false,
      isAutoCommandOn: false,
      isDataRecorderOn: false,
      isInputGraphOn: false,
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

    eventBus.$on('setexercise1', this.setExercise1Interface);
    eventBus.$on('setexercise2', this.setExercise2Interface);
    eventBus.$on('setexercise3', this.setExercise3Interface);

  },
  methods: {
    addWorkspace(){
      this.isWorkspaceOn = true;
    },
    toggleGraph(){
      this.isGraphOn = !this.isGraphOn;
    },
    clearWorkspace(){
      this.isWorkspaceOn = false;
    },
    toggleDataRecorder(){
      console.log('toggling data recorder');
      this.isDataRecorderOn = !this.isDataRecorderOn;
    },
    toggleStopwatch(){
      this.isStopwatchOn = !this.isStopwatchOn;
    },
    toggleTable(){
      this.isTableOn = !this.isTableOn;
    },
    toggleInputGraph(){
      this.isInputGraphOn = !this.isInputGraphOn;
    },
    setExercise1Interface(){
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
    setExercise2Interface(){
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
    setExercise3Interface(){
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
  },
  computed: {
    getLoggedIn(){
      return userData.getters.isLoggedIn;
    }
    
  }
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
