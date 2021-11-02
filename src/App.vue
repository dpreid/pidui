//vue3 update

<template>
  <div id="app" class='container-fluid-sm m-0'>

    <!-- Components that do not conform to draggable grid -->
    <navigation-bar @togglegraph="toggleGraph" @toggledatarecorder="toggleDataRecorder" 
            @togglesnapshot="toggleSnapshot" @togglestopwatch="toggleStopwatch" @toggleworkspace="addWorkspace" @toggletable="toggleTable" 
                    @togglesystemdiagrams="toggleSystemDiagrams" @clearworkspace="clearWorkspace" @addruler="rulerAdded = true" @addprotractor="protractorAdded = true"
                    />

      <div v-if='showLoadDataModal' class="modal" id='modal-show' tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Load data</h5>
              <button type="button" class="btn btn-close" aria-label="Close" @click='showLoadDataModal = false'>
                
              </button>
            </div>
            <div class="modal-body">
              <p>Previously recorded data was saved on {{ saved_date }}. Do you want to load this previous data?</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" @click="loadData">Load</button>
              <button type="button" class="btn btn-danger" data-dismiss="modal" data-bs-dismiss="modal" @click='showLoadDataModal = false'>Cancel</button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="isWorkspaceOn">
          <workspace :protractorAdded="protractorAdded" :rulerAdded="rulerAdded"/>
        </div>

        <streams id='streams' />

<!-- Beginning of grid layout -->

      <!-- <div class='row' id='fixed-row'>
        <div class='col drop-area' id='fixed_drop' draggable='true' @dragstart="dragComponent" @drop='dropComponent' @dragover.prevent @dragenter.prevent></div>
      </div> -->

      <div class='row' id='component-grid'>

          <div class='col-lg-6 col-sm-12' id='left-screen'>
            <div class='col drop-area' id='drop_0_0' :draggable='getDraggable' @dragstart="dragComponent" @drop='dropComponent' @dragover.prevent @dragenter.prevent><webcam-stream id='webcam-stream' /></div>
            <div class='col drop-area' id='drop_1_0' :draggable='getDraggable' @dragstart="dragComponent" @drop='dropComponent' @dragover.prevent @dragenter.prevent><data-stream id='data-stream' /></div>
            <div class='col drop-area' id='drop_2_0' :draggable='getDraggable' @dragstart="dragComponent" @drop='dropComponent' @dragover.prevent @dragenter.prevent><instructions v-if='isWorkspaceOn' id='instructions' :isWorkspaceOn="isWorkspaceOn"/></div>
            <div class='col drop-area' id='drop_3_0' :draggable='getDraggable' @dragstart="dragComponent" @drop='dropComponent' @dragover.prevent @dragenter.prevent><table-output v-if='isTableOn' id='table' :tableHeadings="['id', 'Time/s', 'Angle/rad', 'Ang. Vel./rad/s', 'Command', 'Drive', 'Error']" :selected_point="selected_graph_point"/></div>
            <div class='col drop-area' id='drop_4_0' :draggable='getDraggable' @dragstart="dragComponent" @drop='dropComponent' @dragover.prevent @dragenter.prevent><stopwatch v-if='isStopwatchOn' id='stopwatch'/></div>
          </div>

          <div class='col-lg-6 col-sm-12' id='right-screen'>
            <div class='col drop-area' id='drop_0_1' :draggable='getDraggable' @dragstart="dragComponent" @drop='dropComponent' @dragover.prevent @dragenter.prevent><data-recorder v-if='isDataRecorderOn' id='data-recorder' /></div>
            <div class='col drop-area' id='drop_1_1' :draggable='getDraggable' @dragstart="dragComponent" @drop='dropComponent' @dragover.prevent @dragenter.prevent><motor-snapshot v-if='isSnapshotOn' id='snapshot' :headings="['Time/s', 'Angle/rad', 'Ang. Vel./rad/s', 'Command', 'Drive', 'Error']"/></div>
            <div class='col drop-area' id='drop_2_1' :draggable='getDraggable' @dragstart="dragComponent" @drop='dropComponent' @dragover.prevent @dragenter.prevent><graph-output v-if='isGraphOn' id='graph' @newselectedgraphpoint="selectedGraphPoint"/></div>
            <div class='col drop-area' id='drop_3_1' :draggable='getDraggable' @dragstart="dragComponent" @drop='dropComponent' @dragover.prevent @dragenter.prevent><system-diagrams v-if='isSystemDiagramsOn' id='system-diagrams' /></div>
            <div class='col drop-area' id='drop_4_1' :draggable='getDraggable' @dragstart="dragComponent" @drop='dropComponent' @dragover.prevent @dragenter.prevent></div>
          </div>

      </div>





      <!-- <div class='row' id='row_0'>
        <div class='col drop-area' id='drop_0_0' draggable='true' @dragstart="dragComponent" @drop='dropComponent' @dragover.prevent @dragenter.prevent><streams id='streams' /></div>
        <div class='col drop-area' id='drop_0_1' draggable='true' @dragstart="dragComponent" @drop='dropComponent' @dragover.prevent @dragenter.prevent><table-output v-if='isTableOn' id='table' :tableHeadings="['id', 'Time/s', 'Angle/rad', 'Ang. Vel./rad/s', 'Command', 'Drive', 'Error']" :selected_point="selected_graph_point"/></div>
      </div>

      <div class='row' id='row_1'>
        <div class='col drop-area' id='drop_1_0' draggable='true' @dragstart="dragComponent" @drop='dropComponent' @dragover.prevent @dragenter.prevent><stopwatch v-if='isStopwatchOn' id='stopwatch'/></div>
        <div class='col drop-area' id='drop_1_1' draggable='true' @dragstart="dragComponent" @drop='dropComponent' @dragover.prevent @dragenter.prevent><motor-snapshot v-if='isSnapshotOn' id='snapshot' :headings="['Time/s', 'Angle/rad', 'Ang. Vel./rad/s', 'Command', 'Drive', 'Error']"/></div>
      </div>

      <div class='row' id='row_2'>
        <div class='col drop-area' id='drop_2_0' draggable='true' @dragstart="dragComponent" @drop='dropComponent' @dragover.prevent @dragenter.prevent><instructions v-if='isWorkspaceOn' id='instructions' :isWorkspaceOn="isWorkspaceOn"/></div>
        <div class='col drop-area' id='drop_2_1' draggable='true' @dragstart="dragComponent" @drop='dropComponent' @dragover.prevent @dragenter.prevent><graph-output v-if='isGraphOn' id='graph' type="graph" @newselectedgraphpoint="selectedGraphPoint"/></div>
      </div>

      <div class='row' id='row_3'>
        <div class='col drop-area' id='drop_3_0' draggable='true' @dragstart="dragComponent" @drop='dropComponent' @dragover.prevent @dragenter.prevent><data-recorder v-if='isDataRecorderOn' id='data-recorder' /></div>
        <div class='col drop-area' id='drop_3_1' draggable='true' @dragstart="dragComponent" @drop='dropComponent' @dragover.prevent @dragenter.prevent><system-diagrams v-if='isSystemDiagramsOn' id='system-diagrams' /></div>
      </div> -->


        
      </div>
</template>

<script>
import WebcamStream from "./components/WebcamStream.vue";
import DataStream from "./components/DataStream.vue";
import GraphOutput from "./components/GraphOutput.vue";
import TableOutput from "./components/TableOutput.vue";
import Stopwatch from "./components/Stopwatch.vue";
import Workspace from "./components/Workspace.vue";
import DataRecorder from "./components/DataRecorder.vue";
import NavigationBar from "./components/NavigationBar.vue"; 
import SystemDiagrams from "./components/SystemDiagrams.vue";
import MotorSnapshot from "./components/MotorSnapshot.vue";
import Instructions from "./components/Instructions.vue";
import Streams from './components/Streams.vue';

import { mapGetters } from 'vuex';

export default {
  name: 'App',
  components: {
    WebcamStream,
    DataStream,
    GraphOutput,
    TableOutput,
    Stopwatch,
    Workspace,
    DataRecorder,
    NavigationBar,
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
      isSystemDiagramsOn: false,
      isSnapshotOn: false,
      protractorAdded: false,
      rulerAdded: false,
      disableTooltips: false,             //global tooltip setting
      showLoadDataModal: false,
      saved_date: '',
      selected_graph_point: null,

      
    }
  },
  created(){
    this.$store.dispatch('setRemoteLabVersion', this.remoteLabVersion);     //NEW
    this.$store.dispatch('setDataRecorder', this.isDataRecorderOn);     //NEW
  },
  mounted(){
    if(this.hasDataToLoad(this.remoteLabVersion)){
      this.saved_date = JSON.parse(window.localStorage.getItem('dateSaved'));
      this.showLoadDataModal = true;
    } else{
      this.showLoadDataModal = false;
    }
      window.addEventListener('pagehide', () => {this.saveDataToLocalStorage(this.remoteLabVersion)});				//closing window
      window.addEventListener('beforeunload', () => {this.saveDataToLocalStorage(this.remoteLabVersion)});			//refreshing page, changing URL
  },
  computed:{
    ...mapGetters([
			'getDraggable'
		]),
  },
  methods: {
    dragComponent(event){
        event.dataTransfer.effectAllowed = 'move';
         console.log(event.target.id);
         let element = event.target;
         if(element.classList.contains('drop-area')){
           console.log(element.id);
            event.dataTransfer.setData("text/html", element.id + "|" + element.childNodes[0].id);
            console.log(element.childNodes[0]);
         } else{
           while(element.parentNode){
              element = element.parentNode;
              console.log(element.id);
              if(element.classList.contains('drop-area')){
                event.dataTransfer.setData("text/html", element.id + "|" + element.childNodes[0].id);
                console.log(element.childNodes[0]);
                break;
              }
            }
         }
    },
    dropComponent(event){
      event.preventDefault();
      event.stopPropagation();
      let dropData = event.dataTransfer.getData('text/html');
      let dropItems = dropData.split("|");
      let draggedZone = document.getElementById(dropItems[0]);
      let droppedElement = document.getElementById(event.target.id);
      let draggedID = dropItems[1];
      
      if(droppedElement != null && droppedElement.classList.contains('drop-area')){
        if(event.target.childNodes.length > 0){
          draggedZone.appendChild(event.target.childNodes[0]);
        }
        console.log(draggedID);
        droppedElement.appendChild(document.getElementById(draggedID));
      } 
      else if(droppedElement){
        let element = droppedElement;
        while(element.parentNode){
          element = element.parentNode;
          if(element.classList.contains('drop-area')){
            console.log(element.childNodes[0]);
            draggedZone.appendChild(element.childNodes[0]);
            element.appendChild(document.getElementById(draggedID));
            
            break;
          }
        }
      }
      return false;
    },
    selectedGraphPoint(point){
      this.selected_graph_point = point;
    },
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
    toggleSnapshot(){
      this.isSnapshotOn = !this.isSnapshotOn;
      if(this.isSnapshotOn){
        if(!this.isDataRecorderOn){
          this.toggleDataRecorder();
        }
        
      }
    },
    loadData(){
      this.loadDataFromLocalStorage();
      this.showLoadDataModal = false;
    },
    hasStorage(){
        try {
            window.localStorage.setItem('test', 'storage');
            window.localStorage.removeItem('test');
            return true;
        } catch (exception) {
            return false;
          }
      },
    hasDataToLoad(remoteLabVersion){
        if(window.localStorage.getItem('savedData')){
          if(window.localStorage.getItem('remoteLabVersion') == remoteLabVersion){
              return true;
          } else {
              return false;
          }
        } else{
          return false;
        }
    },
     loadDataFromLocalStorage(){
        if(this.hasStorage()){
            if(window.localStorage.getItem('savedData')){
              let data = window.localStorage.getItem('savedData');
              data = JSON.parse(data)
              this.$store.dispatch('clearAllData');
              for(let i=0; i<data.length;i++){
                  this.$store.dispatch('addData', data[i]);
              }

              return true;

            } else {
              console.log('no saved data');
              return false;
            }
        } else{
            console.log('no saved data');
            return false;
        }
          
      },
      saveDataToLocalStorage(remoteLabVersion){
         if(this.hasStorage()){
            if(this.$store.getters.getNumData > 0){
               let data_string = JSON.stringify(this.$store.getters.getData);
               window.localStorage.setItem('savedData', data_string);
               let date = JSON.stringify(new Date());
               window.localStorage.setItem('dateSaved', date);
               window.localStorage.setItem('remoteLabVersion', remoteLabVersion);

               return true;

            } else{
               console.log('no data to save');
               return false;
            }
            
         } else{
            console.log('no localStorage allowed');
            return false;
         }
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
  margin-top: 50px;
  background-color: rgba(161, 161, 161, 0.39);
}


.border{
  box-shadow: 0 1px 20px 0 rgba(0, 0, 0, 0.637);
}
.drop-area {
    background-color: auto;
    margin: 5px;
    padding: 20px;
    border-style: dashed;
    border-radius:12px;
    border-width: 2px;
    border-color: rgba(0, 0, 255, 0.4);
  }


#left-screen{
  overflow: scroll;
  max-height: 100vh;
}

#right-screen{
  overflow: scroll;
  max-height: 100vh;
}

#modal-show{
  display: block;
  
}

</style>
