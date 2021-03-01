<template>
<div class="m-2 bg-white border rounded">
    <div class="row justify-content-center align-items-center">

        <div class='form-group col-1'>
			<label for="time">t/s</label>
			<div class='current border border-right-0'>
                    <p>{{time.toFixed(2)}}</p>
            </div>
            <p v-for='row in snaps' :id="row.time" :key="row.time">
                {{row.time}}
            </p>
            <!-- <p>{{snapshot_time}}</p> -->
            
        </div>

		<div class='form-group col-2 v-divider'>
			<label for="position">Angle/rad</label>
            <div class='current border border-right-0 border-left-0'>
                    <p>{{position.toFixed(2)}}</p>
            </div>
            <p v-for='row in snaps' :id="row.position" :key="row.position">
                {{row.position}}
            </p>
            <!-- <p>{{snapshot_position}}</p> -->
        </div>
		<div class='form-group col-2 v-divider'>
			<label for="velocity">Ang. Vel/(rad/s)</label>
			<div class='current border border-right-0 border-left-0'>
                    <p>{{velocity.toFixed(2)}}</p>
            </div>
            <p v-for='row in snaps' :id="row.velocity" :key="row.velocity">
                {{row.velocity}}
            </p>
            <!-- <p>{{snapshot_velocity}}</p> -->
        </div>
        <div class='form-group col-2 v-divider'>
			<label for="command">Command</label>
			<div class='current border border-right-0 border-left-0'>
                    <p>{{command.toFixed(2)}}</p>
            </div>
            <p v-for='row in snaps' :id="row.command" :key="row.command">
                {{row.command}}
            </p>
            <!-- <p>{{snapshot_command}}</p> -->
        </div>
        <div class='form-group col-2 v-divider'>
			<label for="drive">Drive</label>
			<div class='current border border-right-0 border-left-0'>
                    <p>{{drive.toFixed(2)}}</p>
            </div>
             <p v-for='row in snaps' :id="row.drive" :key="row.drive">
                {{row.drive}}
            </p>
            <!-- <p>{{snapshot_drive}}</p> -->
        </div>
        <div class='form-group col-2 v-divider'>
			<label for="error">Error</label>
			<div class='current border border-left-0'>
                    <p>{{error.toFixed(2)}}</p>
            </div>
            <p v-for='row in snaps' :id="row.error" :key="row.error">
                {{row.error}}
            </p>
            <!-- <p>{{snapshot_error}}</p> -->
        </div>
	</div>

    <!-- <table class="table">
        <tr v-for="row in snaps" :id="row.id" :key="row.id">
            <td>{{row.time}}</td>
            <td>{{row.position.toFixed(2)}}</td>
            <td>{{row.velocity.toFixed(2)}}</td>
            <td>{{row.command}}</td>
            <td>{{row.drive}}</td>
            <td>{{row.error}}</td>
        </tr>
                            
    </table>  -->

    <div class='row justify-content-center align-items-center'>
        <button id="snapshot" class="btn btn-default btn-sm m-3" @click="takeSnapshot">Record Snapshot</button>
        <button id="reset_snaps" class="btn btn-default btn-sm m-3" @click="resetSnaps">Reset</button>
    </div>
    


</div>
</template>

<script>
import { store } from "../simplestore.js";


export default {
    name: 'MotorSnapshot',
    props:{
      
  },
    data(){
        return{
            dataStore: store,
            time: 0,
            position: 0,
            velocity: 0,
            command: 0,
            drive: 0,
            error: 0,
            snapshot_time: 0,
            snapshot_position: 0,
            snapshot_velocity: 0,
            snapshot_command: 0,
            snapshot_drive: 0,
            snapshot_error: 0,
            snaps: [],
        }
    },
    computed:{
        newData(){
            return this.dataStore.state.data;
        }
    },
    watch:{
        newData(){
            this.time = store.getTime();
            this.position = store.state.current_angle;
            this.velocity = store.state.current_ang_vel * 2* Math.PI/60.0;
            if(store.state.current_error != null){
                this.error = store.state.current_error;
            } else{
                this.error = 0;
            }

            if(store.state.current_drive != null){
                this.drive = store.state.current_drive;
            } else{
                this.drive = 0;
            }

            if(store.state.current_command_value != null){
                this.command = store.state.current_command_value;
            } else{
                this.command = 0;
            }
            
            
            
        }
    },
    methods: {
        takeSnapshot(){
            this.snapshot_time = this.time;
            this.snapshot_position = this.position;
            this.snapshot_velocity = this.velocity;
            if(this.command != null){
                this.snapshot_command = this.command;
            } else{
                this.snapshot_command = 0;
            }
            if(this.drive != null){
                this.snapshot_drive = this.drive;
            } else{
                this.snapshot_drive = 0;
            }
            if(this.error != null){
                this.snapshot_error = this.error;
            } else{
                this.snapshot_error = 0;
            }
            
            let new_snap = {time: (this.snapshot_time).toFixed(2), position: (this.snapshot_position).toFixed(2), velocity: (this.snapshot_velocity).toFixed(2), command: (this.snapshot_command).toFixed(2), drive: (this.snapshot_drive).toFixed(2), error: (this.snapshot_error).toFixed(2)};
            this.snaps.push(new_snap);
            
            
        },
        resetSnaps(){
            this.snaps = [];
        }
      },
      mounted() {
        
        
      },
      created(){
          
      }
}
</script>

<style scoped>
#snapshot        {background-color: rgb(217, 255, 0);}
#snapshot:hover  {background-color: rgb(190, 187, 2);}
#reset_snaps        {background-color: rgb(243, 117, 44);}
#reset_snaps:hover  {background-color: rgb(243, 7, 7);}

.current{
    border: thin;
	box-shadow: 0px 0px;
    color: green
}

.h-divider{
 margin-top:5px;
 margin-bottom:5px;
 height:1px;
 width:100%;
 border-top:1px solid gray;
}

.v-divider{
 margin-left:5px;
 margin-right:5px;
 width:1px;
 height:100%;
 border-left:1px solid gray;
}
</style>
