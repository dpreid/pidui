//NAVIGATION BAR COMPONENT: Includes menu items for adding UI components; tools menu for adding UI tools like ruler and protractor

//TODO: Include user login alerts and profile data.


<template>
    <div class='mb-5 pb-2'>
  <b-navbar toggleable="lg" type="dark" variant="primary" fixed="top">
    <b-navbar-brand href="#">Remote Lab: {{labName}} </b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
    
    <b-collapse id="nav-collapse" is-nav>
        <!--Left aligned menu items-->
      <b-navbar-nav>
        <b-nav-item-dropdown text="Menu" right>
            <b-dropdown-item @click='toggleComponent("graph")'>Graph</b-dropdown-item>
            <b-dropdown-item @click='toggleComponent("graphinput")'>Graph Input</b-dropdown-item>
            <b-dropdown-item @click='toggleComponent("datarecorder")'>Data Recorder</b-dropdown-item>
            <b-dropdown-item @click='toggleComponent("stopwatch")'>Stopwatch</b-dropdown-item>
            <b-dropdown-item @click='toggleComponent("table")'>Table</b-dropdown-item>
            <b-dropdown-item @click='toggleComponent("systemdiagrams")'>System Diagrams</b-dropdown-item>
            <b-dropdown-item @click='toggleComponent("snapshot")'>Data Snapshot</b-dropdown-item>
            
            
        </b-nav-item-dropdown>

        <b-nav-item-dropdown text="Tools" right>
          <b-dropdown-item @click='addTool("ruler")'>Ruler</b-dropdown-item>
          <b-dropdown-item @click='addTool("protractor")'>Protractor</b-dropdown-item>
        </b-nav-item-dropdown>

        <!-- <b-nav-item-dropdown v-if='taskOptionsAvailable' text="Tasks" right>
          <b-dropdown-item v-if='remoteLabVersion == "variable_governor" || remoteLabVersion == "spinning_disk"' @click='setExercise1v1'>Exercise 1.1</b-dropdown-item>
          <b-dropdown-item v-if='remoteLabVersion == "variable_governor"' @click='setExercise1v2'>Exercise 1.2</b-dropdown-item>
          <b-dropdown-item v-if='remoteLabVersion == "robot_arm"' @click='setExercise1v3'>Exercise 1.3</b-dropdown-item>
          <b-dropdown-item v-if='remoteLabVersion == "robot_arm"' @click='setExercise2v1'>Exercise 2.1</b-dropdown-item>
        </b-nav-item-dropdown> -->

        <b-nav-item @click='clearWorkspace'>Clear Workspace</b-nav-item>


      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <!-- <b-nav-form>
          <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
          <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
        </b-nav-form> -->
        
        <b-nav-text><clock /></b-nav-text>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</div>
</template>

<script>
//import { store } from "../simplestore.js";
import { eventBus } from "../main.js";
//import userData from '../userDataStore';
import Clock from "./Clock.vue";

export default {

  name: 'NavigationBar',
  props:{
      remoteLabVersion: String,
  },
  data () {
    return {
        taskOptionsAvailable: true,         //remove option for tasks to be preset.
    }
  },
  components: {
    Clock,
  },
  mounted(){
    
  },
  computed:{
      // getUserEmail(){
      //   return userData.getters.getUserEmail;
      // },
      labName(){
        if(this.remoteLabVersion == 'variable_governor'){
          return 'Variable Governor';
        } else if(this.remoteLabVersion == 'spinning_disk'){
          return 'Spinning Disk';
        } else{
          return 'Robot Arm';
        }
      }
  },
  methods: {
      addTool(tool){
          this.toggleComponent('workspace');
          setTimeout(function(){
              eventBus.$emit('add' + tool), 100});  //give the workspace time to initialise and then send tool event
          
      },
      toggleComponent(component){
          eventBus.$emit('toggle' + component);
      },
      clearWorkspace(){
          eventBus.$emit('clearworkspace');
      },
      // logout(){
      //   userData.dispatch('logout');
      // },
      setExercise1v1(){
        eventBus.$emit('setexercise1v1');
      },
      setExercise1v2(){
        eventBus.$emit('setexercise1v2');
      },
      setExercise1v3(){
        eventBus.$emit('setexercise1v3');
      },
      setExercise2v1(){
        eventBus.$emit('setexercise2v1');
      }
  }
}
</script>

<style scoped>


</style>