<template>
  <div id="app" class='container-fluid-sm m-0'>

    <div class='row'>
      <div class='col-sm-6'> <control-panel /> </div>
      <div class='col-sm-6'> <graph-output type="graph" id="0" /> </div>
    </div>
  </div>
</template>

<script>
import GraphOutput from "./components/GraphOutput.vue";
//import TableOutput from "./components/TableOutput.vue";
//import Stopwatch from "./components/Stopwatch.vue";
//import Workspace from "./components/Workspace.vue";
//import WebcamStream from "./components/WebcamStream.vue";
import ControlPanel from "./components/ControlPanel.vue";
//import DataRecorder from "./components/DataRecorder.vue";
//import AutoCommand from "./components/AutoCommand.vue";

export default {
  name: 'App',
  components: {
    GraphOutput,
    //TableOutput,
    //Stopwatch,
    //Workspace,
    //WebcamStream,
    ControlPanel,
    //DataRecorder,
    //AutoCommand,
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
  box-shadow: 0 1px 20px 0 rgba(0, 0, 0, 0.356);
}

</style>
