//This component includes the standard controls for manipulating the hardware.
//This component does the connection to the data being sent from the hardware. It includes the reconnecting websocket
//All data transfer between hardware and UI is through this script. Data is added to the store.js file from which other components access it.

//TODO:
// Need to add tooltips to all components
//Need to include a function when receiving messages from the hardware - when stopped received, UI enters stopped mode so that other modes can be selected.


<template>
<div class='container-sm m-2 bg-white border rounded'>
	<div class='row align-content-center m-1'>
		<canvas id="smoothie-chart"></canvas>
	</div>

	<div class="panel panel-default">
		<div class='panel-heading'><h3>Current mode: {{this.currentMode}}</h3></div>
		<div class='panel-body'>{{this.message}}</div>
		<div class="panel-footer">{{this.error}}</div>
	</div>

	<div id="buttons">
		<div class='row align-content-center m-1 btn-group'>
			<div class='col-sm'>
				<button id="setmode" class="btn btn-default btn-lg" v-b-tooltip.hover="{delay: {'show':3000, 'hide':0}}" title="Change hardware mode" v-if="isStopped" @click="changingMode = true">Set Mode</button>
				<button id="stop" class="btn btn-default btn-lg" @click="stop">Stop</button>
			</div>
		</div>
		<div class='row align-content-center m-1 btn-group' v-if="changingMode">
			<div class='col-sm'>
				<button id="pidposition" class="btn btn-default btn-lg" @click="positionMode">PID Position</button>			
				<button id="pidspeed" class="btn btn-default btn-lg" @click="speedMode">PID Speed</button>
				<button id="dcmotor" class="btn btn-default btn-lg" @click="DCMotorMode">DC Motor</button>
				<button id="calibrate" class="btn btn-default btn-lg" @click="calibrate">Calibrate</button>
				<button id="configure" class="btn btn-default btn-lg" @click="configure">Configure</button>
			</div>
		</div>

	</div>

	<div class='row justify-content-center m-2'>
		<div class='col-12'><h2> Parameters </h2></div>
	</div>
	<div v-if='currentMode == "pid_position"' class="row justify-content-center m-2 align-items-center">
		<div v-if='angleMode == "degrees"' class="col-3 sliderlabel"> Angle ({{angleParam}}deg)</div>
		<div v-else class="col-3 sliderlabel"> Angle ({{parseFloat(Math.PI * angleParam / 180).toFixed(2)}}rad)</div>
		<div v-if='angleMode == "degrees"' class="col-7"><input type="range" min="-180" max="180" v-model="angleParam" class="slider" id="angleSlider"></div>
		<div v-else class="col-7"><input type="range" min="-180" max="180" v-model="angleParam" class="slider" id="angleSlider"></div>
		<button id="set" class="btn btn-default btn-lg col-2" @click="setPosition">Set</button>
	</div>
	<div v-if='currentMode == "pid_speed" || currentMode == "dc_motor"' class="row justify-content-center m-1 align-items-center">
		<div v-if='currentMode == "pid_speed"' class="col-3  sliderlabel"> Speed ({{speedParam}}rpm)</div>
		<div v-else class="col-3  sliderlabel"> Speed ({{speedParam}})</div>
		<div v-if='currentMode == "pid_speed"' class="col-7"><input type="range" min="0" max="2000" v-model="speedParam" class="slider" id="brakeSlider"></div>
		<div v-else class="col-7"><input type="range" min="0" max="255" v-model="speedParam" class="slider" id="brakeSlider"></div>
		<button id="set" class="btn btn-default btn-lg col-2" @click="setSpeed">Set</button>
	</div>
	<div v-if='currentMode == "configure"' class="row justify-content-center m-1 align-items-center">
		<div class="col-3  sliderlabel"> Height ({{heightParam}}mm)</div>
		<div class="col-7"><input type="range" min="0" max="100" v-model="heightParam" class="slider" id="heightSlider"></div>
		<button id="set" class="btn btn-default btn-lg col-2" @click="setHeight">Set</button>
	</div>
	<div class="row justify-content-center m-1 align-items-center">
		<div class='form-group col-2'>
			<label for="kp">Kp:</label>
			<input type='text' class='form-control' id="kp" :value="kpParam">
        </div>
		<div class='form-group col-2'>
			<label for="ki">Ki:</label>
			<input type='text' class='form-control' id="ki" :value="kiParam">
        </div>
		<div class='form-group col-2'>
			<label for="kd">Kd:</label>
			<input type='text' class='form-control' id="kd" :value="kdParam">
        </div>
		<div class='form-group col-2'>
			<label for="dt">dt:</label>
			<input type='text' class='form-control' id="dt" :value="dtParam">
        </div>
		<div class='form-group col-2'>
			<label for="Nerrors">N_errors:</label>
			<input type='text' class='form-control' id="Nerrors" :value="N_errorsParam">
        </div>
		<button id="set" class="btn btn-default btn-lg col-2" @click="setParameters">Set</button>
	</div>


</div>
</template>

<script>
//import { store } from "../store.js";
import { eventBus } from "../main";
import ReconnectingWebSocket from 'reconnecting-websocket';
import { SmoothieChart } from 'smoothie';
import { TimeSeries } from 'smoothie';

export default {
	name: "ControlPanel",
	components:{
		
	},
    data(){
        return{
			dataSocket: null,
			angleParam: 0,			//always stores degrees, even in rad mode
			speedParam: 0,
			heightParam: 0,
			kpParam: 0,
			kiParam: 0,
			kdParam: 0,
			dtParam: 0,
			N_errorsParam: 10,
			angleMode: 'degrees',		// 'radians'
			isStopped: true,
			changingMode: false,
			currentMode: "stopped",		//"pid_position", "pid_speed", "dc_motor", "calibrate", "configure"
			message: '',				//for sending user messages to screen
			error:'',					//for sending errors to screen
			canvas: null,

        }
    },
    created(){
		eventBus.$on('stop', this.stop);
		
	},
        
    mounted(){
        //dataUrl =  scheme + host + ':' + port + '/' + data;
		let dataUrl = '';		//NEED THE DATA URL

		//console.log(dataUrl)

		var wsOptions = {
			automaticOpen: true,
			reconnectDecay: 1.5,
			reconnectInterval: 500,
			maxReconnectInterval: 10000,
		}

		this.dataSocket = new ReconnectingWebSocket(dataUrl, null,wsOptions);
		//console.log(this.dataSocket);

		//let dataOpen = false;
		var delay = 0
		var messageCount = 0
		let a;
		let b;
		let debug = false;
		let wrapEncoder = false;			//NO WRAPPING OF ENCODER?

		var initialSamplingCount = 1200 // 2 mins at 10Hz
		var delayWeightingFactor = 60  // 1 minute drift in 1 hour
		let encoderPPR = 2000			//500 counts per revolution, becomes 2000 pulses per revolution with encoder A and B pins

		let responsiveSmoothie = true;
		let thisTime;

		var chart = new SmoothieChart({responsive: responsiveSmoothie, millisPerPixel:10,grid:{fillStyle:'#ffffff'}, interpolation:"linear",maxValue:3.14,minValue:-3.14,labels:{fillStyle:'#0024ff',precision:0}}); //interpolation:'linear
		this.canvas = document.getElementById("smoothie-chart");
		let series = new TimeSeries();
		console.log("created");
		chart.addTimeSeries(series, {lineWidth:2,strokeStyle:'#0024ff'});
		chart.streamTo(this.canvas, 0);

		this.dataSocket.onopen = function (event) {
			console.log("dataSocket open" + event);
			//dataOpen = true; 
			
			this.dataSocket.send(JSON.stringify({
				cmd: "set_mode",
				param: "CALIBRATE"
			}));
			
			//DO I WANT TO SEND DEFAULT PARAMETERS HERE?

		};

		this.dataSocket.onmessage = function (event) {
			
			try {
				var obj = JSON.parse(event.data);
				var msgTime = obj.time
				var thisDelay = new Date().getTime() - msgTime

				// if (testNaN){
				// console.log("appending NaNs")
				// series.append(msgTime + delay, NaN)
				// series.append(NaN, 0)
				// series.append(NaN, NaN)
				// }

				var enc = obj.enc

				if (messageCount == 0){
					delay = thisDelay
				}

				
				a = 1 / delayWeightingFactor
				b = 1 - a

				
				if (messageCount < initialSamplingCount) {
					thisDelay = ((delay * messageCount) + thisDelay) / (messageCount + 1)
				} else {
					thisDelay = (delay * b) + (thisDelay * a)
				}
				
				messageCount += 1

				//https://stackoverflow.com/questions/4633177/c-how-to-wrap-a-float-to-the-interval-pi-pi
				if (wrapEncoder){ //wrap and convert to degrees
				enc = Math.atan2(Math.sin(obj.enc / (encoderPPR/2) * Math.PI), Math.cos(obj.enc / (encoderPPR/2) * Math.PI)) / Math.PI * 180
				enc = Math.min(180, enc)
				enc = Math.max(-180, enc)
				this.$store.dispatch('setCurrentAngle', enc * Math.PI / 180);		//for output graph, convert to radians
				}
				else{ //convert to radians only
					enc = enc * 2* Math.PI / encoderPPR;
					this.$store.dispatch('setCurrentAngle', enc);		//for data storage, radians
				}

				thisTime = msgTime + delay
				
				if (!isNaN(thisTime) && !isNaN(enc)){
					series.append(msgTime + delay, enc)
					this.$store.dispatch('setCurrentTime', msgTime + delay);			//for output graph

					if(debug) {
						console.log(delay,thisDelay,msgTime, enc)
					}
				}
				else {
					if (debug) {
						console.log("NaN so not logging to smoothie",delay,thisDelay,msgTime, enc)
					}
				} 

			} catch (e) {
				if (debug){
					console.log(e)
				}
			}
		}

		this.$store.dispatch('setStartTime', new Date().getTime());
		window.addEventListener('keydown', this.hotkey, false);
		
	},
	methods:{
		//
		stop(){
			this.clearMessages();
			console.log("STOP");
			this.currentMode = 'stopped';
			this.dataSocket.send(JSON.stringify({
				cmd: "set_mode",
				param: "STOP"
			}));
			this.changingMode = false;
		},
		calibrate(){
			this.clearMessages();
			if(this.currentMode == 'stopped'){
				console.log("CALIBRATE");
				this.currentMode = 'calibrate';
				this.dataSocket.send(JSON.stringify({
				cmd: "set_mode",
				param: "CALIBRATE"
				}));
			} else{
				this.error = 'Must STOP before CALIBRATION';
			}

			this.changingMode = false;
			
		},
		configure(){
			this.clearMessages();
			if(this.currentMode == 'stopped'){
				console.log("CONFIGURE");
				this.currentMode = 'configure';
				this.dataSocket.send(JSON.stringify({
				cmd: "set_mode",
				param: "CONFIGURE"
				}));
			} else{
				this.error = 'Must STOP before CONFIGURATION';
			}
			
			this.changingMode = false;
		},
		positionMode(){
			this.clearMessages();
			if(this.currentMode == 'stopped'){
				console.log("PID_POSITION_MODE");
				this.currentMode = 'pid_position';
				this.dataSocket.send(JSON.stringify({
				cmd: "set_mode",
				param: "PID_POSITION_MODE"
				}));
			} else{
				this.error = 'Must STOP before entering PID_Position mode';
			}
			
			this.changingMode = false;
		},
		speedMode(){
			this.clearMessages();
			if(this.currentMode == 'stopped'){
				console.log("PID_SPEED_MODE");
				this.currentMode = 'pid_speed';
				this.dataSocket.send(JSON.stringify({
				cmd: "set_mode",
				param: "PID_SPEED_MODE"
				}));
			} else{
				this.error = 'Must STOP before entering PID_Speed mode';
			}

			this.changingMode = false;
		},
		DCMotorMode(){
			this.clearMessages();
			if(this.currentMode == 'stopped'){
				console.log("DC_MOTOR_MODE");
				this.currentMode = 'dc_motor';
				this.dataSocket.send(JSON.stringify({
				cmd: "set_mode",
				param: "DC_MOTOR_MODE"
				}));
			} else{
				this.error = 'Must STOP before entering DC Motor mode';
			}

			this.changingMode = false;
		},
		setPosition(){
			this.clearMessages();
			if(this.currentMode == 'pid_position'){
				console.log("Set position");
				let pos = 2000 * this.angleParam / 360.0			//2000 is PPR of encoder, angleParam is always in degrees.
				this.dataSocket.send(JSON.stringify({
				cmd: "set_position",
				param: pos
				}));
			} else{
				this.error = 'Must be in PID Position mode';
			}
			
		},
		setSpeed(){
			this.clearMessages();
			if(this.currentMode == 'pid_speed' || this.currentMode == 'dc_motor'){
				console.log("Set speed");
				this.dataSocket.send(JSON.stringify({
				cmd: "set_speed",
				param: this.speedParam
				}));
			} else{
				this.error == 'Must be in PID Speed or DC Motor mode';
			}
			
		},
		setHeight(){
			this.clearMessages();
			if(this.currentMode == 'configure'){
				console.log("Set height");
				this.dataSocket.send(JSON.stringify({
				cmd: "set_height",
				param: this.heightParam
				}));
			} else{
				this.error = 'Must be in CONFIGURATION mode';
			}
			
		},
		setParameters(){
			this.clearMessages();
			console.log("Set parameters");
			this.dataSocket.send(JSON.stringify({
				cmd: "set_parameters",
				Kp: this.kpParam,
				Ki: this.kiParam,
				Kd: this.kdParam,
				dt: this.dtParam,
				N_errors: this.N_errorsParam
			}));
		},

		hotkey(event){
			if(event.key == "s"){
				this.stop();
            } 
		},
		clearMessages(){
			this.message = '';
			this.error = '';
		}

	},
}




</script>

<style scoped>

#smoothie-chart{
	width:100%;
	height: 120px;
}

.slidecontainer {
	width: 100%; /* Width of the outside container */
}
.slider {
	-webkit-appearance: none;
	width: 100%;
	height: 15px;
	border-radius: 5px;  
	background: #d3d3d3;
	outline: none;
	opacity: 0.7;
	-webkit-transition: .2s;
	transition: opacity .2s;
}

.slider::-webkit-slider-thumb {
	-webkit-appearance: none;
	appearance: none;
	width: 25px;
	height: 25px;
	border-radius: 50%; 
	background: #5b7fa5ff; 
	cursor: pointer;
}

.slider::-moz-range-thumb {
	width: 25px;
	height: 25px;
	border-radius: 50%;
	background: #5b7fa5ff;
	cursor: pointer;
}

/* Mouse-over effects */
.slider:hover {
	opacity: 1; /* Fully shown on mouse-over */
}

.sliderlabel{ text-align: left;}


#setmode       {background-color: rgb(3, 248, 12);}
#setmode:hover {background-color: #3e8e41} 

#stop       {background-color: rgb(255, 0, 0);}
#stop:hover {background-color: #cc1e1eff;}

#pidposition        {background-color: rgb(255, 106, 0);}
#pidposition:hover  {background-color: #cc661eff;}

#pidspeed        {background-color: rgb(255, 187, 0);}
#pidspeed:hover  {background-color: #cc9d1eff;}

#dcmotor        {background-color: rgb(217, 255, 0);}
#dcmotor:hover  {background-color: rgb(190, 187, 2);}

#calibrate         {background-color: #5b7fa5ff;}
#calibrate:hover   {background-color: #46627fff;}

#configure         {background-color: rgb(220, 38, 236);}
#configure:hover   {background-color: rgb(76, 19, 82);}

#set         {background-color: rgb(30, 250, 1);}
#set:hover   {background-color: rgb(30, 172, 2);}


</style>