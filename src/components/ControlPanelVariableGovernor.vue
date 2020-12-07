//This component includes the standard controls for manipulating the hardware.
//This component does the connection to the data being sent from the hardware. It includes the reconnecting websocket
//All data transfer between hardware and UI is through this script. Data is added to the store.js file from which other components access it.

//TODO:
// Need to add tooltips to all components


<template>
<div class='container-sm m-2 bg-white border rounded'>
	<div class='row align-content-center m-1'>
		<div class='col-12'>
			<canvas v-show="currentMode == 'stopped' || currentMode == 'positionPid'" id="smoothie-chart"></canvas>
		</div>
	</div>
	<div class='row align-content-center m-1'>
		<div class='col-12'>
			<canvas v-show="currentMode == 'speedRaw' || currentMode == 'speedPid'" id="smoothie-chart_omega"></canvas>
		</div>
	</div>

	<div class="panel panel-default">
		<div class='panel-heading'><h3>Current mode: {{this.currentMode}}</h3></div>
		<div class='panel-body'>{{this.message}}</div>
		<div class="panel-footer">{{this.error}}</div>
	</div>

	<div id="buttons">
		<div class='row align-content-center m-1 btn-group'>
			<div class='col-sm'>
				<button v-if='currentMode == "stopped"' id="setmode" class="btn btn-default btn-lg" v-b-tooltip.hover="{delay: {'show':3000, 'hide':0}}" title="Change hardware mode" @click="changingMode = true">Set Mode</button>
				<button id="stop" class="btn btn-default btn-lg" @click="stop">Stop</button>
				<button id="reset" class="btn btn-default btn-lg" @click="resetParameters">Reset</button>

				<label class='m-2' for="graphSelect">Input type:</label>
				<select name="inputSelect" id="inputSelect" v-model="inputMode" @change='updateStore'>
					<option value="free">Free</option>
					<option value="step">Step</option>
					<option value="ramp">Ramp</option>
				</select> 
			</div>
		</div>
		<div class='row align-content-center m-1 btn-group' v-if="changingMode">
			<div class='col-sm'>
				<button id="pidposition" class="btn btn-default btn-lg" @click="positionPid">PID Position</button>			
				<button id="pidspeed" class="btn btn-default btn-lg" @click="speedPid">PID Speed</button>
				<button id="dcmotor" class="btn btn-default btn-lg" @click="speedRaw">DC Motor</button>
				<button id="resetHeight" class="btn btn-default btn-lg" @click="resetHeight">Calibrate</button>
				<button id="configure" class="btn btn-default btn-lg" @click="configure">Configure</button>
			</div>
		</div>

	</div>


	<div v-if='inputMode == "free"'>
		
		<div v-if="currentMode != 'stopped' && currentMode != 'resetHeight'" class='row justify-content-center m-2'>
			<div class='col-12'><h2> Parameters </h2></div>
		</div>

		<div v-if='currentMode == "positionPid"' class="row justify-content-center m-2 align-items-center">
			<div v-if='angleMode == "degrees"' class="col-3 sliderlabel"> Angle ({{angleParam}}deg)</div>
			<div v-else class="col-3 sliderlabel"> Angle ({{parseFloat(Math.PI * angleParam / 180).toFixed(2)}}rad)</div>
			<div v-if='angleMode == "degrees"' class="col-7"><input type="range" min="-180" max="180" v-model="angleParam" class="slider" id="angleSlider"></div>
			<div v-else class="col-7"><input type="range" min="-180" max="180" v-model="angleParam" class="slider" id="angleSlider"></div>
			<button id="set" class="btn btn-default btn-lg col-2" @click="setPosition">Set</button>
		</div>
		<div v-if='currentMode == "speedPid"' class="row justify-content-center m-1 align-items-center">
			<div class="col-3  sliderlabel"> Speed ({{speedParam}}rpm)</div>
			<div class="col-7"><input type="range" min="0" max="1000" v-model="speedParam" class="slider" id="brakeSlider"></div>
			<button id="set" class="btn btn-default btn-lg col-2" @click="setSpeed">Set</button>
		</div>

		<div v-if='currentMode == "speedRaw"'>
			<DCMotorPanel v-bind:dataSocket="getDataSocket" />
		</div>
	
	</div>

	<div v-else-if="inputMode == 'step'">
		<StepCommand v-bind:mode='currentMode' v-bind:dataSocket='getDataSocket'/>
	</div>

	<div v-else-if="inputMode == 'ramp'">
		<RampCommand v-bind:mode='currentMode' v-bind:dataSocket='getDataSocket'/>
		<!-- <h2> RAMP MODE </h2> -->
	</div>

	<div v-if='currentMode == "configure"' class="row justify-content-center m-1 align-items-center">
			<div class="col-3  sliderlabel"> Height ({{heightParam}}mm)</div>
			<div class="col-7"><input type="range" min="0" max="30" v-model="heightParam" v-on:change="setHeight" class="slider" id="heightSlider"></div>
		</div>

	

	<div v-if='currentMode == "positionPid" || currentMode == "speedPid"' class="row justify-content-center m-1 align-items-center">
		<div class='form-group col-2'>
			<label for="kp">Kp:</label>
			<input type='text' class='form-control' id="kp" v-model="kpParam">
        </div>
		<div class='form-group col-2'>
			<label for="ki">Ki:</label>
			<input type='text' class='form-control' id="ki" v-model="kiParam">
        </div>
		<div class='form-group col-2'>
			<label for="kd">Kd:</label>
			<input type='text' class='form-control' id="kd" v-model="kdParam">
        </div>
		<div class='form-group col-2'>
			<label for="dt">dt:</label>
			<input type='text' class='form-control' id="dt" v-model="dtParam">
        </div>

		<button id="set" class="btn btn-default btn-lg col-2" @click="setParameters">Set</button>
	</div>


</div>
</template>

<script>
import { store } from "../simplestore.js";
import { eventBus } from "../main";
import ReconnectingWebSocket from 'reconnecting-websocket';
import { SmoothieChart } from 'smoothie';
import { TimeSeries } from 'smoothie';
import DCMotorPanel from './DCMotorPanel.vue';
import StepCommand from './StepCommand.vue';
import RampCommand from './RampCommand.vue';

export default {
	name: "ControlPanel",
	components:{
		DCMotorPanel,
		StepCommand,
		RampCommand,
	},
    data(){
        return{
			dataSocket: null,
			angleParam: 0,			//always stores degrees, even in rad mode
			speedParam: 0,
			heightParam: 0,
			kpParam: 1,
			kiParam: 0,
			kdParam: 0,
			dtParam: 20,
			angleMode: 'degrees',		// 'radians'
			isStopped: true,
			changingMode: false,
			currentMode: "stopped",		//"positionPid", "speedPid", "speedRaw", "resetHeight", "configure"
			inputMode: 'free',		//'step', 'ramp'
			message: '',				//for sending user messages to screen
			error:'',					//for sending errors to screen
			canvas: null,
			canvas_omega: null,
			angle_max: 3.14,
			angle_min: -3.14,
			ang_vel_max: 1000,
			ang_vel_min: -1000,
			timerParam: 30,			//hardware stop timer in seconds
        }
    },
    created(){
		eventBus.$on('stop', this.stop);
		eventBus.$on('setfreeinput', this.setFreeMode);
		eventBus.$on('setstepinput', this.setStepMode);
		eventBus.$on('setrampinput', this.setRampMode);
		eventBus.$on('setdcmotormode', this.speedRaw);
		eventBus.$on('setpidpositionmode', this.positionPid);	
		eventBus.$on('setpidspeedmode', this.speedPid);	
		eventBus.$on('hardwarestop', this.hasStopped);	
		
	},
        
    async mounted(){
		await this.connect();
		console.log('connection complete');
		this.setParameters();			//resets the parameters to default settings on UI
		console.log('params set');
		await new Promise((resolve)=>{
			setTimeout(() => {resolve(console.log('waiting to resetHeight'))}, 1000);		//give the system time to send and change parameters before attempting calibration
			});
		
		this.resetHeight();
	},
	computed: {
		getDataSocket(){
			return this.dataSocket;
		},
	},
	methods:{
		stop(){
			this.clearMessages();
			this.speedParam = 0;
			this.currentMode = 'stopped';
			this.dataSocket.send(JSON.stringify({
				set: "mode",
				to: "stop"
			}));
			this.changingMode = false;
			this.updateStore();
		},
		hasStopped(){
			if(this.currentMode != 'stopped'){
				this.clearMessages();
				this.speedParam = 0;
				this.currentMode = 'stopped';
				this.changingMode = false;
				this.updateStore();
			}
			
		},
		resetHeight(){
			this.clearMessages();
			if(this.currentMode == 'stopped'){
				this.currentMode = 'resetHeight';
				this.dataSocket.send(JSON.stringify({
				set: "mode",
				to: "resetHeight"
				}));
			} else{
				this.error = 'Must STOP before resetHeight';
			}
			this.heightParam = 0;
			this.changingMode = false;
			this.updateStore();
			
		},
		configure(){
			this.clearMessages();
			if(this.currentMode == 'stopped'){
				this.currentMode = 'configure';
				this.dataSocket.send(JSON.stringify({
				set: "mode",
				to: "configure"
				}));
			} else{
				this.error = 'Must STOP before configure';
			}
			
			this.changingMode = false;
			this.updateStore();
		},
		positionPid(){
			this.clearMessages();
			if(this.currentMode == 'stopped'){
				this.currentMode = 'positionPid';
				this.dataSocket.send(JSON.stringify({
				set: "mode",
				to: "positionPid"
				}));
			} else{
				this.error = 'Must STOP before entering positionPid mode';
			}
			
			this.changingMode = false;
			this.updateStore();
		},
		speedPid(){
			this.clearMessages();
			if(this.currentMode == 'stopped'){
				this.currentMode = 'speedPid';
				this.dataSocket.send(JSON.stringify({
				set: "mode",
				to: "speedPid"
				}));
			} else{
				this.error = 'Must STOP before entering speedPid mode';
			}
			this.changingMode = false;
			this.updateStore();
		},
		speedRaw(){
			this.clearMessages();
			if(this.currentMode == 'stopped'){
				this.currentMode = 'speedRaw';
				this.dataSocket.send(JSON.stringify({
				set: "mode",
				to: "speedRaw"
				}));
			} else{
				this.error = 'Must STOP before entering speedRaw mode';
			}

			this.changingMode = false;
			this.updateStore();
		},
		setPosition(){
			this.clearMessages();
			if(this.currentMode == 'positionPid'){
				let pos = 2000 * this.angleParam / 360.0			//2000 is PPR of encoder, angleParam is always in degrees.
				this.dataSocket.send(JSON.stringify({
				set: "position",
				to: pos
				}));
			} else{
				this.error = 'Must be in positionPid mode';
			}
			
		},
		setSpeed(){
			this.clearMessages();
			if(this.currentMode == 'speedPid' || this.currentMode == 'speedRaw'){
				this.dataSocket.send(JSON.stringify({
				set: "speed",
				to: this.speedParam
				}));
			} else{
				this.error == 'Must be in speedPid or speedRaw mode';
			}
			
		},
		setHeight(){
			this.clearMessages();
			if(this.currentMode == 'configure'){
				this.dataSocket.send(JSON.stringify({
				set: "height",
				to: this.heightParam
				}));
			} else{
				this.error = 'Must be in configure mode';
			}
			
		},
		setParameters(){
			this.clearMessages();
			this.dataSocket.send(JSON.stringify({
				set: "parameters",
				kp: this.kpParam,
				ki: this.kiParam,
				kd: this.kdParam,
				dt: this.dtParam,
			}));
			this.updateStore();
		},
		setTimer(){
			this.clearMessages();
			this.dataSocket.send(JSON.stringify({
				set: "timer",
				to: this.timerParam
			}));
		},
		hotkey(event){
			if(event.key == "s"){
				this.stop();
            } else if(event.key == 'r'){
				eventBus.$emit('runrecord');
			}
		},
		clearMessages(){
			this.message = '';
			this.error = '';
		},
		updateStore(){
			store.state.pid_parameters.Kp = this.kpParam;
			store.state.pid_parameters.Ki = this.kiParam;
			store.state.pid_parameters.Kd = this.kdParam;
			store.state.pid_parameters.dt = this.dtParam
			store.state.pid_parameters.N_errors = this.N_errorsParam;
			store.state.currentMode = this.currentMode;
			store.state.inputMode = this.inputMode;
			console.log('store updated');
		},
		setFreeMode(){
			this.inputMode = 'free';
		},
		setStepMode(){
			this.inputMode = 'step';
		},
		setRampMode(){
			this.inputMode = 'ramp';
		},
		resetParameters(){
			this.kpParam = 1.0;
			this.kiParam = 0.0;
			this.kiParam = 0.0;
			this.setParameters();
		},
		async connect(){
			//dataUrl =  scheme + host + ':' + port + '/' + data;
			return new Promise((resolve) => {
				let dataUrl = 'wss://video.practable.io:443/bi/dpr/pendulum0';

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

		var chart = new SmoothieChart({responsive: responsiveSmoothie, millisPerPixel:10,grid:{fillStyle:'#ffffff'}, interpolation:"linear",maxValue:3.14,minValue:-3.14,labels:{fillStyle:'#0024ff',precision:2}}); //interpolation:'linear
		//var chart = new SmoothieChart({responsive: responsiveSmoothie, millisPerPixel:10,grid:{fillStyle:'#ffffff'}, interpolation:"linear",labels:{fillStyle:'#0024ff',precision:2}}); //interpolation:'linear
		var chart_omega = new SmoothieChart({responsive: responsiveSmoothie, millisPerPixel:10,grid:{fillStyle:'#ffffff'}, interpolation:"linear",maxValue:1000,minValue:-1000,labels:{fillStyle:'#0024ff',precision:2}});
		this.canvas = document.getElementById("smoothie-chart");
		this.canvas_omega = document.getElementById("smoothie-chart_omega");
		let series = new TimeSeries();
		let series_omega = new TimeSeries();
		chart.addTimeSeries(series, {lineWidth:2,strokeStyle:'#0024ff'});
		chart.streamTo(this.canvas, 0);
		chart_omega.addTimeSeries(series_omega, {lineWidth:2,strokeStyle:'#0024ff'});
		chart_omega.streamTo(this.canvas_omega, 0);

		this.dataSocket.onopen = function (event) {
			console.log("dataSocket open" + event);
			resolve(console.log('opened'));
			//dataOpen = true; 
			

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
				store.state.current_enc_pos = enc;			//store as a position between -1000 and 1000
				var enc_ang_vel = obj.enc_ang_vel;			//encoder reports angular velocity in specific modes

				if(obj.awaiting_stop){
					eventBus.$emit('hardwarestop');
				}


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
					//this.$store.dispatch('setCurrentAngle', enc * Math.PI / 180);		//for output graph, convert to radians
					//only save values to the data store if within the min/max range
					store.state.current_angle = enc * Math.PI / 180;
					store.state.current_ang_vel = enc_ang_vel;

				}
				else{ //convert to radians only
					enc = enc * 2* Math.PI / encoderPPR;
					//this.$store.dispatch('setCurrentAngle', enc);		//for data storage, radians
					//only save values to the data store if within the min/max range
					if(enc >= -Math.PI && enc <= Math.PI){
						store.state.current_angle = enc;
					}
					if(enc_ang_vel >= -1000 && enc_ang_vel <= 1000){					//DON'T REALLY WANT THESE VALUES IN HERE
						store.state.current_ang_vel = enc_ang_vel;
					}
			
				}

				thisTime = msgTime + delay
				
				if (!isNaN(thisTime)){
					if(!isNaN(enc)){
						series.append(msgTime + delay, enc)	
						
					}
					
					if(!isNaN(enc_ang_vel)){
						series_omega.append(msgTime + delay, enc_ang_vel)	
						
					}
					
					//this.$store.dispatch('setCurrentTime', msgTime + delay);			//for output graph
					store.state.current_time = msgTime + delay;
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

		//this.$store.dispatch('setStartTime', new Date().getTime());
		//this.$store.dispatch('setCurrentAngle', 25);
		store.state.start_time = new Date().getTime();
		window.addEventListener('keydown', this.hotkey, false);
		window.addEventListener('pagehide', this.stop);				//closing window
		window.addEventListener('beforeunload', this.stop);			//refreshing page, changing URL
			})
		
		}

		

	},
}




</script>

<style scoped>

#smoothie-chart{
	width:100%;
	height: 120px;
}

#smoothie-chart_omega{
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

#reset       {background-color: rgb(3, 248, 12);}
#reset:hover {background-color: #3e8e41} 

#stop       {background-color: rgb(255, 0, 0);}
#stop:hover {background-color: #cc1e1eff;}

#pidposition        {background-color: rgb(255, 106, 0);}
#pidposition:hover  {background-color: #cc661eff;}

#pidspeed        {background-color: rgb(255, 187, 0);}
#pidspeed:hover  {background-color: #cc9d1eff;}

#dcmotor        {background-color: rgb(217, 255, 0);}
#dcmotor:hover  {background-color: rgb(190, 187, 2);}

#resetHeight         {background-color: #5b7fa5ff;}
#resetHeight:hover   {background-color: #46627fff;}

#configure         {background-color: rgb(220, 38, 236);}
#configure:hover   {background-color: rgb(76, 19, 82);}

#set         {background-color: rgb(30, 250, 1);}
#set:hover   {background-color: rgb(30, 172, 2);}


</style>