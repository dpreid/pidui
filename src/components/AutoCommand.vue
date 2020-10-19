<template>
    <div class="container-fluid">
        <div class="row justify-content-center">
            <label for="addCommand">Command</label>

            <select name="addCommand" id="addCommand" v-model="command_to_add" @change="checkCommandParameter">
                <option value="start">Start</option>
                <option value="updatedrive">Drive Param</option>
                <option value="brake">Brake</option>
                <option value="updatebrake">Brake Param</option>
                <option value="load">Load</option>
                <option value="free">Free</option>
                
            </select> 

            <label for="command_parameter" v-if="command_to_add == 'updatedrive' || command_to_add == 'updatebrake'">Value</label>
            <input v-if="command_to_add == 'updatedrive' || command_to_add == 'updatebrake'" id="command_parameter" size="5" v-model="command_parameter">
            <label for="time_interval">After</label>
            <input id="time_interval" size="5" v-model="time_to_add">
            <label for="time_interval">seconds</label>
            <button id="addButton" @click="addCommand">Add</button>
            <button id="deleteButton" @click="deletePreviousCommand">Delete</button>

        </div>

        <div class="row justify-content-center" v-for="command in commands" :key="command.id">     <!--command structure command = {id=0, com:"start", time: 5, parameter: 0} -->
            <h3>{{command.com}} after {{command.time}} seconds &nbsp;</h3>
            <h3 v-if="command.parameter != null">: parameter value {{command.parameter}}</h3>

        </div>

        <div class="row justify-content-center">
            <button id="startCommands" @click="runCommands">Start</button>
            <button id="stopCommands" @click="stopCommands">Stop</button>
            <button id="clearCommands" @click="clearCommands">Clear</button>
        </div>


     </div>   
</template>

<script>
//import { store } from "../store.js";
import { eventBus } from "../main.js";

export default {

  name: 'AutoCommand',
  data () {
    return {
      commands: [],
      command_to_add: "",
      time_to_add: 0,
      command_parameter: null,
      //timeout_ids: [],
      stopping: false,
      
    }
  },
  components: {
    
  },
  computed:{

  },
  mounted(){

  },
  methods: {
     addCommand(){
         let id = this.commands.length;
         let new_command = {id: id, com:this.command_to_add, time:this.time_to_add, parameter:this.command_parameter};
         this.commands.push(new_command);
     },
     async runCommands(){
         this.stopping = false;
         let time = 0;
         let eventName = "";
            for(let i=0; i<this.commands.length; i++){
                time = parseFloat(this.commands[i].time);
                eventName = this.commands[i].com + "command";

                if(this.stopping){
                    return;
                }

                await new Promise((resolve) => {
                    console.log("command param = " + this.commands[i].parameter);
                    setTimeout(() => resolve(eventBus.$emit(eventName, this.commands[i].parameter)), time*1000);
                });
            }
             
     },
     stopCommands(){
         this.stopping = true;

        //  for(let i=0; i<this.timeout_ids;i++){
        //      clearTimeout(this.timeout_ids[i]);
        //  }
     },
     deletePreviousCommand(){
         let index = this.commands.length - 1;
         this.commands.splice(index, 1);
     },
     clearCommands(){
         this.commands = [];
     },
     checkCommandParameter(){
         if(this.command_to_add != "updatedrive" && this.command_to_add != "updatebrake"){
             this.command_parameter = null;
         }
     },
  }
}
</script>

<style scoped>
.row{
    border-style: solid;
    border-width: medium;
    border-color: green;
}


button {
	padding: 2px 2px;
	font-size: 24px;
	text-align: center;
	cursor: pointer;
	outline: none;
	color: rgb(255, 255, 255);

	border: none;
	border-radius: 15px;
	/* box-shadow: 0 9px #999; */
}

/*	background-color: #4CAF50;
 .button:hover {background-color: #3e8e41}*/

button:active {
	background-color: #3e8e41;
	box-shadow: 0 5px #666;
	transform: translateY(4px);
}


#addButton       {background-color: #4CAF50FF;}
#addButton:hover {background-color: #3e8e41} 

#deleteButton       {background-color: #e13131ff;}
#deleteButton:hover {background-color: #cc1e1eff;}

#startCommands  {background-color: #4CAF50FF;}
#startCommands:hover  {background-color: #3e8e41;}

#stopCommands        {background-color: #e1b131ff;}
#stopCommands:hover  {background-color: #cc9d1eff;}

#clearCommands        {background-color: #e13131ff;}
#clearCommands:hover  {background-color: #cc1e1eff;}

label {
    font-size:20px;
    color: #0501f7;
    font-weight: bold;
    display: inline-block;
    vertical-align: middle;
    width: 100px;
    /* float: left; */
}
</style>