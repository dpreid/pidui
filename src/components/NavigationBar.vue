//NAVIGATION BAR COMPONENT: Includes menu items for adding UI components; tools menu for adding UI tools like ruler and protractor

//TODO: Include user login alerts and profile data.


<template>
    <div class='mb-5 pb-2'>
  <b-navbar toggleable="lg" type="dark" variant="primary" fixed="top">
    <b-navbar-brand href="#">Remote Lab: PID Controller</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
    
    <b-collapse id="nav-collapse" is-nav>
        <!--Left aligned menu items-->
      <b-navbar-nav>
        <b-nav-item-dropdown text="Menu" right>
            <b-dropdown-item @click='toggleComponent("graph")'>Graph</b-dropdown-item>
            <b-dropdown-item @click='toggleComponent("datarecorder")'>Data Recorder</b-dropdown-item>
            <b-dropdown-item @click='toggleComponent("stopwatch")'>Stopwatch</b-dropdown-item>
            <b-dropdown-item @click='toggleComponent("table")'>Table</b-dropdown-item>
        </b-nav-item-dropdown>

        <b-nav-item-dropdown text="Tools" right>
          <b-dropdown-item @click='addTool("ruler")'>Ruler</b-dropdown-item>
          <b-dropdown-item @click='addTool("protractor")'>Protractor</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <!-- <b-nav-form>
          <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
          <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
        </b-nav-form> -->
        <b-nav-item @click='clearWorkspace'>Clear Workspace</b-nav-item>

        <b-nav-item-dropdown right>
          <!-- Using 'button-content' slot -->
          <template #button-content>
            <em>User</em>
          </template>
          <b-dropdown-item href="#">Profile</b-dropdown-item>
          <b-dropdown-item href="#">Sign Out</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</div>
</template>

<script>
//import { store } from "../store.js";
import { eventBus } from "../main.js";

export default {

  name: 'NavigationBar',
  data () {
    return {
        
    }
  },
  components: {
    
  },
  computed:{
      
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
      }
  }
}
</script>

<style scoped>


</style>