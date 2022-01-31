//Updated to Vue3, removing eventBus implementation, instead nav bar emits up to App which then controls components and passes props to sibling components

<template>

  <nav class="navbar fixed-top navbar-expand-lg navbar-light primary-colour rounded">
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
                  <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarDropdown">
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
                  <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarDropdown2">
                    <li><a class="dropdown-item" href="#" @click='addTool("ruler")'>Ruler</a></li>
                    <li><a class="dropdown-item" href="#" @click='addTool("protractor")'>Protractor</a></li>
                  </ul>
              </li>

              <li class="nav-item">
                  <a class="nav-link" href="#" tabindex="-1" @click='clearWorkspace'>Clear Workspace</a>
              </li>

               <li class="nav-item dropdown">
                  <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown2" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                   Layout
                  </a>
                  <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarDropdown2">
                    <li><a class="dropdown-item" href="#" @click='toggleLayout(1)'>Single Column</a></li>
                    <li><a class="dropdown-item" href="#" @click='toggleLayout(0.25)'>25%:75%</a></li>
                    <li><a class="dropdown-item" href="#" @click='toggleLayout(0.5)'>50%:50%</a></li>
                    <li><a class="dropdown-item" href="#" @click='toggleLayout(0.75)'>75%:25%</a></li>
                  </ul>
              </li>

          </ul>

          <div class='d-flex'>
              <ul class="navbar-nav dropstart">
                  
                  <rasa-bot v-if='getIsChatbotAvailable' />
                  <!-- <logging /> -->
                  <achievements />
                  <!-- <checklist /> -->

                  <li class="nav-item">
                    <clock class='nav-link' />
                  </li>

              </ul>




              
          </div>

      </div>
    </div>
  </nav>

</template>

<script>

import Clock from "./Clock.vue";
//import Checklist from './Checklist.vue';
import Achievements from './Achievements.vue';
//import Logging from './Logging.vue';
//import Prompts from './Prompts.vue';
import RasaBot from './RasaBot.vue';
import { mapGetters } from 'vuex';

export default {

  name: 'NavigationBar',
  components: {
    Clock,
    //Checklist,
    Achievements,
    //Logging,
    //Prompts,
    RasaBot,
  },
  props:{
      
  },
  emits:[
    'togglelayout', 'togglegraph', 'toggledatarecorder', 'togglestopwatch', 'toggletable', 'togglesystemdiagrams', 'togglesnapshot', 'toggleworkspace', 'clearworkspace', 'addruler', 'addprotractor'
  ],
  data () {
    return {
        
    }
  },
  computed:{
    ...mapGetters([
      'getIsChatbotAvailable',
    ]),
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

          if(tool == 'ruler'){
            if(this.$store.getters.getPromptByName('PROMPT_inertia_check').count < 1){
              this.$store.dispatch('triggerIntent', 'PROMPT_inertia_check');
            }
          }
      },
      toggleComponent(component){
          this.$emit('toggle' + component);

          //prompt chatbot to ask about useful components
          if(this.$store.getters.getAchievementByName('open-all').n > 2 && this.$store.getters.getLogTotalTime > 1800000){
            this.$store.dispatch('triggerIntent', 'PROMPT_useful_component');
          }
      },
      clearWorkspace(){
          this.$emit('clearworkspace');
      },
       toggleLayout(ratio){
        if(ratio == 0.25)
        {
          this.$emit('togglelayout', 0.25);
        }
        else if(ratio == 0.5)
        {
          this.$emit('togglelayout', 0.5);
        }
        else if(ratio == 0.75)
        {
          this.$emit('togglelayout', 0.75);
        }
        else 
        {
          this.$emit('togglelayout', 1);
        }
      }
  }
}
</script>

<style scoped>


</style>