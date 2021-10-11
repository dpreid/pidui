//Updated to Vue3, removing eventBus implementation, instead nav bar emits up to App which then controls components and passes props to sibling components

<template>

  <nav class="navbar fixed-top navbar-expand-lg navbar-dark bg-primary">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Remote Lab: {{labName}}</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item dropdown">
                  <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                   Menu
                  </a>
                  <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                    <li><a class="dropdown-item" href="#" @click='toggleComponent("datarecorder")'>Data Recorder</a></li>
                    <li><a class="dropdown-item" href="#" @click='toggleComponent("graph")'>Graph</a></li>
                    <li><a class="dropdown-item" href="#" @click='toggleComponent("snapshot")'>Data Snapshot</a></li>
                    <li><a class="dropdown-item" href="#" @click='toggleComponent("table")'>Table</a></li>
                    <li><a class="dropdown-item" href="#" @click='toggleComponent("stopwatch")'>Stopwatch</a></li>
                    <li><a class="dropdown-item" href="#" @click='toggleComponent("systemdiagrams")'>System Diagrams</a></li>
                    
                  </ul>
              </li>

              <li class="nav-item dropdown">
                  <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown2" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                   Tools
                  </a>
                  <ul class="dropdown-menu" aria-labelledby="navbarDropdown2">
                    <li><a class="dropdown-item" href="#" @click='addTool("ruler")'>Ruler</a></li>
                    <li><a class="dropdown-item" href="#" @click='addTool("protractor")'>Protractor</a></li>
                  </ul>
              </li>

              <li class="nav-item">
                  <a class="nav-link" href="#" tabindex="-1" @click='clearWorkspace'>Clear Workspace</a>
              </li>
          </ul>

          <div class='d-flex'>
              <clock />
          </div>

      </div>
    </div>
  </nav>

</template>

<script>

import Clock from "./Clock.vue";

export default {

  name: 'NavigationBar',
  components: {
    Clock,
  },
  props:{
      
  },
  emits:[
    'togglegraph', 'toggledatarecorder', 'togglestopwatch', 'toggletable', 'togglesystemdiagrams', 'togglesnapshot', 'toggleworkspace', 'clearworkspace', 'addruler', 'addprotractor'
  ],
  data () {
    return {
        
    }
  },
  computed:{
      labName(){
        let lab = this.$store.getters.getRemoteLabVersion;
        if(lab == 'variable_governor'){
          return 'Variable Governor';
        } else if(lab == 'spinning_disk'){
          return 'Spinning Disk';
        } else{
          return 'Robot Arm';
        }
      }
  },
  methods: {
      addTool(tool){
          this.toggleComponent('workspace');
          setTimeout(() => {this.$emit('add' + tool)}, 100);  //give the workspace time to initialise and then send tool event
      },
      toggleComponent(component){
          this.$emit('toggle' + component);
      },
      clearWorkspace(){
          this.$emit('clearworkspace');
      },
  }
}
</script>

<style scoped>


</style>