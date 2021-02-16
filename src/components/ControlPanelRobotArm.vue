
<template>
<div class='container-sm m-2 bg-white border rounded'>
	<div class='row align-content-center m-1'>
		<div class='col-12'>
			<canvas v-show="currentMode == 'stopped' || currentMode == 'positionPid'" id="smoothie-chart"></canvas>
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
				<button v-if='currentMode == "stopped"' id="pidposition" class="btn btn-default btn-lg" @click="positionPid">PID Position</button>
				<button id="stop" class="btn btn-default btn-lg" @click="stop">Stop</button>
				<button v-if='currentMode == "stopped"' id="setmode" class="btn btn-default btn-lg" @click="changingMode = true">Calibrate</button>
				

				<label class='m-2' for="inputSelect">Input type:</label>
				<select name="inputSelect" id="inputSelect" v-model="inputMode" @change='updateStore'>
					<option value="free">Free</option>
					<option value="step">Step</option>
					<!-- <option value="ramp">Ramp</option> -->
				</select> 
				
			</div>
		</div>
		<div class='row align-content-center m-1 btn-group' v-if="changingMode">
			<div class='col-sm'>	
				<button id="armposition" class="btn btn-default btn-lg" @click="changeArm">Set Arm</button>		
				<button id="zero" class="btn btn-default btn-lg" @click="zero">Zero</button>
				<button id="initialise" class="btn btn-default btn-lg" @click="initialise">Initialise</button>
			</div>
		</div>

	</div>

	<div v-if='currentMode == "changeArm"' class="row justify-content-center m-2 align-items-center">
		<div class="col-3 sliderlabel"> Arm(60-120) ({{armPosition}})</div>
		<div class="col-7"><input type="range" min="60" max="120" v-model="armPosition" class="slider" id="armSlider"></div>
		<button id="set" class="btn btn-default btn-lg col-2" @click="setArm">Set</button>
	</div>

	<div v-if='currentMode == "positionPid"'>

		<div v-if='inputMode == "free"'>

			<div v-if='currentMode == "positionPid"' class="row justify-content-center m-2 align-items-center">
				<div class="col-3 sliderlabel"> Angle ({{parseFloat(Math.PI * angleParam / 180).toFixed(2)}}rad)</div>
				<div class="col-7"><input type="range" min="-50" max="50" v-model="angleParam" class="slider" id="angleSlider"></div>
				<button id="set" class="btn btn-default btn-lg col-2" @click="setPosition">Set</button>
			</div>
			
		</div>

	

		<div v-else-if="inputMode == 'step'">
			<StepCommand v-bind:mode='currentMode' :remoteLabVersion="version" v-bind:dataSocket='getDataSocket' :isDataRecorderOn="dataRecorder" :disableTooltips="tooltips"/>
		</div>

		<div v-else-if="inputMode == 'ramp'">
			<RampCommand v-bind:mode='currentMode' :remoteLabVersion="version" v-bind:dataSocket='getDataSocket' :isDataRecorderOn="dataRecorder" :disableTooltips="tooltips"/>
			<!-- <h2> RAMP MODE </h2> -->
		</div>
	
	</div>

	<div v-if='currentMode == "positionPid" || currentMode == "stopped"' class="row justify-content-center m-1 align-items-center">
		<div class='form-group col-2'>
			<label for="kp">Kp:</label>
			<input type='text' :class="checkInputValid('kp', kpParam)" id="kp" v-model="kpParam">
			<b-tooltip triggers='hover' :delay="{show:tooltip_delay,hide:0}" :disabled.sync="disableTooltips" target="kp" :title='getTooltipTitle("kp", kpParam)'></b-tooltip>
        </div>
		<div class='form-group col-2'>
			<label for="ki">Ki:</label>
			<input type='text' :class="checkInputValid('ki', kiParam)" id="ki" v-model="kiParam">
			<b-tooltip triggers='hover' :delay="{show:tooltip_delay,hide:0}" :disabled.sync="disableTooltips" target="ki" :title='getTooltipTitle("ki", kiParam)'></b-tooltip>
        </div>
		<div class='form-group col-2'>
			<label for="kd">Kd:</label>
			<input type='text' :class="checkInputValid('kd', kdParam)" id="kd" v-model="kdParam">
			<b-tooltip triggers='hover' :delay="{show:tooltip_delay,hide:0}" :disabled.sync="disableTooltips" target="kd" :title='getTooltipTitle("kd", kdParam)'></b-tooltip>
        </div>
		<!-- <div class='form-group col-2'>
			<label for="dt">dt:</label>
			<input type='text' :class="checkInputValid('dt', dtParam)" id="dt" v-model="dtParam">
			<b-tooltip triggers='hover' :delay="{show:tooltip_delay,hide:0}" :disabled.sync="disableTooltips" target="dt" :title='getTooltipTitle("dt", dtParam)'></b-tooltip>
        </div> -->

		<button id="set" class="btn btn-default btn-sm mr-2" @click="setParameters">Set</button>
		<button id="reset" class="btn btn-default btn-sm" @click="resetParameters">Reset</button>
	</div>


</div>
</template>

<script>
import { store } from "../simplestore.js";
import { eventBus } from "../main";
//import ReconnectingWebSocket from 'reconnecting-websocket';
import { SmoothieChart } from 'smoothie';
import { TimeSeries } from 'smoothie';
//import DCMotorPanel from './DCMotorPanel.vue';
import StepCommand from './StepCommand.vue';
import RampCommand from './RampCommand.vue';

export default {
	name: "ControlPanel",
	props:{
		isDataRecorderOn: Boolean,
		disableTooltips: Boolean,
		remoteLabVersion: String,
		url: String,
	},
	components:{
		//DCMotorPanel,
		StepCommand,
		RampCommand,
	},
    data(){
        return{
			local_debug: false,
			dataSocket: null,
			angleParam: 0,			//always stores degrees, even in rad mode
			kpParam: 1,
			kiParam: 0,
			kdParam: 0,
			dtParam: 10,
			armPosition: 90,			//position between 0 - 180, 90 hanging vertically
			isStopped: true,
			changingMode: false,
			currentMode: "stopped",		//"positionPid", "zero"
			inputMode: 'free',		//'step', 'ramp'
			message: '',				//for sending user messages to screen
			error:'',					//for sending errors to screen
			canvas: null,
			angle_max: 3.14,
			angle_min: -3.14,
			timerParam: 30,			//hardware stop timer in seconds
			tooltip_delay: 2000,
			max_parameter_values:{
				kp: 10,
				ki: 20,
				kd: 5,
				dt: 20,
			},
			min_parameter_values:{
				kp: 0,
				ki: 0,
				kd: 0,
				dt: 0.01,
			},
        }
    },
    created(){
		eventBus.$on('stop', this.stop);
		eventBus.$on('setfreeinput', this.setFreeMode);
		eventBus.$on('setstepinput', this.setStepMode);
		eventBus.$on('setrampinput', this.setRampMode);
		eventBus.$on('setpidpositionmode', this.positionPid);	
		eventBus.$on('hardwarestop', this.hasStopped);	
		
	},
        
    async mounted(){
		// await this.connect();
		// console.log('connection complete');
		// this.setParameters();			//resets the parameters to default settings on UI
        // console.log('params set');
        // //set the graph data parameter in store
		// store.setGraphDataParameter('theta');
	},
	computed: {
		getDataSocket(){
			return this.dataSocket;
		},
		getUrl(){
            return this.$store.getters.getDataURL;
		},
		version(){
            return this.$store.getters.getRemoteLabVersion;
        },
        dataRecorder(){
            return this.$store.getters.getIsDataRecorderOn;
        },
        tooltips(){
            return this.$store.getters.getDisableTooltips;
        }
	},
	watch:{
        async getUrl(){
            await this.connect();
			console.log('connection complete');
			this.setParameters();			//resets the parameters to default settings on UI
			console.log('params set');
			//set the graph data parameter in store
			store.setGraphDataParameter('theta');
        }
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
				this.showInputType = true;
				if(this.currentMode == 'zero'){
					this.message = 'Hardware has been zeroed';
				} else{
					this.error = 'Hardware has automatically stopped. You are best to zero the hardware before restart';
				}
				this.speedParam = 0;
				this.currentMode = 'stopped';
				this.changingMode = false;
				this.updateStore();
			}
		},
		zero(){
			this.clearMessages();
			if(this.currentMode == 'stopped'){
				this.currentMode = 'zero';
				this.dataSocket.send(JSON.stringify({
				set: "mode",
				to: "zero"
				}));
			} else{
				this.error = 'Must STOP before ZERO';
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
		setPosition(){
			this.clearMessages();
			if(!isNaN(this.angleParam)){
				if(this.currentMode == 'positionPid'){
					let pos = 2000 * this.angleParam / 360.0			//2000 is PPR of encoder, angleParam is always in degrees.
					this.dataSocket.send(JSON.stringify({
					set: "position",
					to: pos
					}));
				} else{
					this.error = 'Must be in positionPid mode';
				}
			} else {
				this.error = 'Angle parameter is NaN';
			}
		},
		initialise(){
			this.clearMessages();
			if(this.currentMode == 'stopped'){
				this.currentMode = 'initialise';
				this.dataSocket.send(JSON.stringify({
				set: "mode",
				to: "initialise"
				}));
			} else{
				this.error = 'Must STOP before entering initialise mode';
			}
			this.changingMode = false;
			this.updateStore();
		},
		changeArm(){
			this.clearMessages();
			if(this.currentMode == 'stopped'){
				this.currentMode = 'changeArm';
				this.dataSocket.send(JSON.stringify({
				set: "mode",
				to: "changeArm"
				}));
			} else{
				this.error = 'Must STOP before entering changeArm mode';
			}
			
			this.changingMode = false;
			this.updateStore();
		},
		setArm(){
			this.clearMessages();
			if(this.currentMode == 'changeArm'){
				let pos = this.armPosition;
				this.dataSocket.send(JSON.stringify({
				set: "arm",
				to: pos
				}));
			} else{
				this.error = 'Must be in changeArm mode';
			}
		},
		setParameters(){
			//this.clearMessages();
			if(!isNaN(this.kpParam) && !isNaN(this.kiParam) && !isNaN(this.kdParam) && !isNaN(this.dtParam) && this.kpParam >= 0 && this.kiParam >= 0 && this.kdParam >= 0 && this.dtParam >= 0){
				this.dataSocket.send(JSON.stringify({
				set: "parameters",
				kp: this.kpParam,
				ki: this.kiParam,
				kd: this.kdParam,
			}));
			this.updateStore();
			} else{
				this.error = 'Cannot parse PID parameters';
			}
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
			} 
			// else if(event.key == 'r'){
			// 	eventBus.$emit('runrecord');
			// }
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
			store.state.currentMode = this.currentMode;
			store.state.inputMode = this.inputMode;
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
			this.kdParam = 0.0;
			this.dtParam = 20.0;
			this.setParameters();
		},
		async connect(){
			//dataUrl =  scheme + host + ':' + port + '/' + data;
			return new Promise((resolve) => {
				let dataUrl = this.url;

		console.log("data URL is =" + dataUrl);

		// var wsOptions = {
		// 	automaticOpen: true,
		// 	reconnectDecay: 1.5,
		// 	reconnectInterval: 500,
		// 	maxReconnectInterval: 10000,
		// }

		//this.dataSocket = new ReconnectingWebSocket(dataUrl, null,wsOptions);
		this.dataSocket = new WebSocket(this.url);
		//console.log(this.dataSocket);

		//let dataOpen = false;
		var delay = 0
		var messageCount = 0
		let a;
		let b;
		let debug = false;

		var initialSamplingCount = 1200 // 2 mins at 10Hz
		var delayWeightingFactor = 60  // 1 minute drift in 1 hour
		let encoderPPR = 2000			//500 counts per revolution, becomes 2000 pulses per revolution with encoder A and B pins

		let responsiveSmoothie = true;
		let thisTime;

		var chart = new SmoothieChart({responsive: responsiveSmoothie, millisPerPixel:10,grid:{fillStyle:'#ffffff'}, interpolation:"linear",maxValue:1.57,minValue:-1.57,labels:{fillStyle:'#0024ff',precision:2}}); //interpolation:'linear
		this.canvas = document.getElementById("smoothie-chart");
		let series = new TimeSeries();
		chart.addTimeSeries(series, {lineWidth:2,strokeStyle:'#0024ff'});
		chart.streamTo(this.canvas, 0);

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
				//var enc_ang_vel = obj.enc_ang_vel;			//encoder reports angular velocity in specific modes

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

				//encoder position in radians
				enc = enc * 2* Math.PI / encoderPPR;

				if(enc >= -Math.PI && enc <= Math.PI){
					store.state.current_angle = enc;

					//in degrees
					let enc_deg = enc*180.0/Math.PI;
					store.state.current_angle_deg = enc_deg;
				}

				thisTime = msgTime + delay
				
				if (!isNaN(thisTime)){
					if(!isNaN(enc)){
						series.append(msgTime + delay, enc)	
						
					}
					
					// if(!isNaN(enc_ang_vel)){
					// 	series_omega.append(msgTime + delay, enc_ang_vel)	
						
					// }
					
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
		
		},
		checkInputValid(id, param){
			//check that value is actually a number and is not negative
			if(!isNaN(param) && param >= 0){
				if(id == 'kp'){
					if(param > this.max_parameter_values.kp || param < this.min_parameter_values.kp){
						return 'form-control error';
					} else{
						return 'form-control';
					}
			} else if(id == 'ki'){
				if(param > this.max_parameter_values.ki || param < this.min_parameter_values.ki){
					return 'form-control error';
				} else{
					return 'form-control';
				}
			} else if(id == 'kd'){
				if(param > this.max_parameter_values.kd || param < this.min_parameter_values.kd){
					return 'form-control error';
				} else{
					return 'form-control';
				}
			} else if(id == 'dt'){
				if(param > this.max_parameter_values.dt || param < this.min_parameter_values.dt){
					return 'form-control error';
				} else{
					return 'form-control';
				}
			}

			} else {
				return ' form-control error';
			}
		},
		getTooltipTitle(id, param){
			if(!isNaN(param)){
				if(id == 'kp'){
					if(param > this.max_parameter_values.kp || param < this.min_parameter_values.kp){
						return 'Outside appropriate range';
					} else{
						return 'Value looks good!';
					}
				} else if(id == 'ki'){
					if(param > this.max_parameter_values.ki || param < this.min_parameter_values.ki){
						return 'Outside appropriate range';
					} else{
						return 'Value looks good!';
					}
				} else if(id == 'kd'){
					if(param > this.max_parameter_values.kd || param < this.min_parameter_values.kd){
						return 'Outside appropriate range';
					} else{
						return 'Value looks good!';
					}
				} else if(id == 'dt'){
					if(param > this.max_parameter_values.dt || param < this.min_parameter_values.dt){
						return 'Outside appropriate range';
					} else{
						return 'Value looks good!';
					}
				}
			} else{
				return 'Invalid input';
			}
			
		}

		

	},
}




</script>

<style scoped>
.error{
    border:thick solid red
}

.error:focus{
    border:thick solid red
}

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

#reset       {background-color: rgba(248, 72, 3, 0.658);}
#reset:hover {background-color: #5f0f04} 

#stop       {background-color: rgb(255, 0, 0);}
#stop:hover {background-color: #cc1e1eff;}

#pidposition        {background-color: rgb(255, 106, 0);}
#pidposition:hover  {background-color: #cc661eff;}

#armposition        {background-color: rgb(0, 217, 255);}
#armposition:hover  {background-color: rgb(30, 76, 204);}

#zero        {background-color: rgb(0, 255, 255);}
#zero:hover  {background-color: rgb(1, 5, 240);}


#set         {background-color: rgb(30, 250, 1);}
#set:hover   {background-color: rgb(30, 172, 2);}

#initialise         {background-color: rgb(208, 1, 250);}
#initialise:hover   {background-color: rgb(84, 3, 109);}

</style>