//This component includes the standard controls for manipulating the hardware.
//This component does the connection to the data being sent from the hardware. It includes the reconnecting websocket
//All data transfer between hardware and UI is through this script. Data is added to the store.js file from which other components access it.

//TODO:
// Need to add tooltips to all components


<template>
<div class='container-sm m-2 bg-white border rounded'>
	<div class='row align-content-center m-1'>
		<div class='col-12'>
			<canvas v-show='currentMode == "positionPid"' id="smoothie-chart_theta"></canvas>
			<canvas v-show='currentMode != "positionPid"' id="smoothie-chart_omega"></canvas>
		</div>
	</div>

	<div class="panel panel-default">
		<div class='panel-heading'><h3>Current mode: {{getModeName}}</h3></div>
		<div class='panel-body'>{{message}}</div>
		<div :class='getErrorClass'><h3>{{error}}</h3></div>
	</div>

	<div id="buttons">
		<div class='row align-content-center m-1 btn-group'>
			<div class='col-sm'>
				<button v-if='currentMode == "stopped"' id="pidspeed" class="btn btn-default btn-lg mr-1" @click="speedPid">Velocity (PID)</button>
				<button v-if='currentMode == "stopped"' id="pidposition" class="btn btn-default btn-lg mr-1" @click="positionPid">Position (PID)</button>	
				<button v-if='currentMode == "stopped"' id="dcmotor" class="btn btn-default btn-lg mr-1" @click="speedRaw">Voltage (open loop)</button>
				<button id="stop" class="btn btn-default btn-lg" @click="stop">Exit mode</button>

				<div v-show='showInputType'>
					<label class='m-2' for="inputSelect">Input type:</label>
					<select name="inputSelect" id="inputSelect" v-model="inputMode" @change='updateStore'>
						<option value="free">Free</option>
						<option value="step">Step</option>
						<option v-if='remoteLabVersion != "robot_arm"' value="ramp">Ramp</option>
					</select> 
				</div>
			</div>
		</div>

	</div>

<div v-if='currentMode == "positionPid" || currentMode == "speedPid" || currentMode == "speedRaw"'>

	<div v-if='inputMode == "free"'>

		<div v-if='currentMode == "positionPid"' class="row justify-content-center m-2 align-items-center">
			<div class="col-3 sliderlabel"> Angle ({{parseFloat(angleParam).toFixed(2)}}rad)</div>
			<div class="col-7"><input type="range" min="-1.57" max="1.57" step="0.01" v-model="angleParam" class="slider" id="angleSlider"></div>
			<button v-if='!position_running' id="set" class="btn btn-default btn-lg col-2" @click="setPosition">Set</button>
			<button v-if='position_running' id="wait" class="btn btn-default btn-lg col-2" @click="wait">Stop</button>
		</div>

		<div v-if='currentMode == "speedPid"' class="row justify-content-center m-1 align-items-center">
			<div class="col-3  sliderlabel"> Speed ({{parseFloat(speedParam).toFixed(2)}}rad/s)</div>
			<div class="col-7"><input type="range" min="0" max="200" v-model="speedParam" class="slider" id="brakeSlider"></div>
			<button id="set" class="btn btn-default btn-lg col-2" @click="setSpeed">Set</button>
		</div>

		<div v-if='currentMode == "speedRaw"'>
			<DCMotorPanel v-bind:dataSocket="getDataSocket" :maxV="12" />
		</div>
	
	</div>

	<div v-else-if="inputMode == 'step'">
		<StepCommand v-bind:mode='currentMode' :remoteLabVersion="remoteLabVersion" v-bind:dataSocket='getDataSocket' :isDataRecorderOn="isDataRecorderOn" :disableTooltips="disableTooltips"/>
	</div>

	<div v-else-if="inputMode == 'ramp'">
		<RampCommand v-bind:mode='currentMode' :remoteLabVersion="remoteLabVersion" v-bind:dataSocket='getDataSocket' :isDataRecorderOn="isDataRecorderOn" :disableTooltips="disableTooltips"/>
	</div>

</div>
	

	<div v-if='currentMode == "speedPid" || currentMode == "positionPid"' class="row justify-content-center m-1 align-items-center">
		<div class='form-group col-2'>
			<label for="kp">K<sub>p</sub>:</label>
			<input type='text' :class="checkInputValid('kp', kpParam)" id="kp" v-model="kpParam" @keyup.enter='setParameters' @blur='setParameters'>
			<!-- <b-tooltip triggers='hover' :delay="{show:tooltip_delay,hide:0}" :disabled.sync="disableTooltips" target="kp" :title='getTooltipTitle("kp", kpParam)'></b-tooltip> -->
        </div>
		<div class='form-group col-2'>
			<label for="ki">K<sub>i</sub>:</label>
			<input type='text' :class="checkInputValid('ki', kiParam)" id="ki" v-model="kiParam" @keyup.enter='setParameters' @blur='setParameters'>
			<!-- <b-tooltip triggers='hover' :delay="{show:tooltip_delay,hide:0}" :disabled.sync="disableTooltips" target="ki" :title='getTooltipTitle("ki", kiParam)'></b-tooltip> -->
        </div>
		<div class='form-group col-2'>
			<label for="kd">K<sub>d</sub>:</label>
			<input type='text' :class="checkInputValid('kd', kdParam)" id="kd" v-model="kdParam" @keyup.enter='setParameters' @blur='setParameters'>
			<!-- <b-tooltip triggers='hover' :delay="{show:tooltip_delay,hide:0}" :disabled.sync="disableTooltips" target="kd" :title='getTooltipTitle("kd", kdParam)'></b-tooltip> -->
        </div>
		<!-- <div class='form-group col-2'>
			<label for="dt">dt:</label>
			<input type='text' :class="checkInputValid('dt', dtParam)" id="dt" v-model="dtParam">
			<b-tooltip triggers='hover' :delay="{show:tooltip_delay,hide:0}" :disabled.sync="disableTooltips" target="dt" :title='getTooltipTitle("dt", dtParam)'></b-tooltip>
        </div> -->

		<!-- <button id="set" class="btn btn-default btn-sm mr-2" @click="setParameters">Set</button> -->
		<button id="reset" class="btn btn-default btn-sm mt-3" @click="resetParameters">Reset</button>
	</div>


</div>
</template>

<script>
import { store } from "../simplestore.js";
import { eventBus } from "../main";
//import ReconnectingWebSocket from 'reconnecting-websocket';
import { SmoothieChart } from 'smoothie';
import { TimeSeries } from 'smoothie';
import DCMotorPanel from './DCMotorPanel.vue';
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
		DCMotorPanel,
		StepCommand,
		RampCommand,
	},
    data(){
        return{
			dataSocket: null,
			speedParam: 0,			//in rad/sec FOR NEW FIRMWARE
			angleParam: 0,			//in rads for new firmware
			kpParam: 1,
			kiParam: 0,
			kdParam: 0,
			dtParam: 20,
			isStopped: true,
			changingMode: false,
			currentMode: "stopped",		//"speedPid", "speedRaw"
			inputMode: 'step',		//'step', 'ramp'
			message: '',				//for sending user messages to screen
			error:'',					//for sending errors to screen
			canvas_omega: null,
			canvas_theta: null,
			ang_vel_max: 1000,
			ang_vel_min: -1000,
			angle_max: 3.14,
			angle_min: -3.14,
			timerParam: 30,			//hardware stop timer in seconds
			tooltip_delay: 2000,
			showInputType: true,
			max_parameter_values:{		//default values, but setMaxParameters function changes these depending on mode.
				kp: 10,
				ki: 10,
				kd: 5,
				dt: 20,
			},
			min_parameter_values:{
				kp: 0,
				ki: 0,
				kd: 0,
				dt: 0.01,
			},
			position_running: false,
			// avg_delay: 0,
			// delays: [],
        }
    },
    created(){
		eventBus.$on('stop', this.stop);
		eventBus.$on('setfreeinput', this.setFreeMode);
		eventBus.$on('setstepinput', this.setStepMode);
		eventBus.$on('setrampinput', this.setRampMode);
		eventBus.$on('setdcmotormode', this.speedRaw);	
		eventBus.$on('setpidspeedmode', this.speedPid);	
		eventBus.$on('setpidpositionmode', this.positionPid);
		eventBus.$on('hardwarestop', this.hasStopped);	
		eventBus.$on('showinputtype', (on) => {this.showInputType = on});

		eventBus.$on('maxdatapointsreached', () => {this.error = 'Max graph points reached, graphing automatically stopped'});
	},
	mounted(){
		
		
		
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
		},
		getModeName(){
			if(this.currentMode == 'positionPid'){
				return 'position (PID)';
			} else if (this.currentMode == 'speedPid'){
				return 'velocity (PID)';
			} else if(this.currentMode == 'speedRaw'){
				return 'voltage (open loop)';
			} else {
				return this.currentMode;
			}
		},
		getErrorClass(){
			if(this.error == ''){
				return ""
			} else {
				return "error-message border border-danger";
			}
		}
	},
	watch:{
        async getUrl(){
            await this.connect();
			console.log('connection complete');
			//setTimeout(this.setParameters, 2000);
			//this.setParameters();			//resets the parameters to default settings on UI
			//console.log('params set');

			//set the graph data parameter in store
			store.setGraphDataParameter('omega');
			},
		// getDataSocket(){
		// 	if(this.dataSocket != null){
		// 		setTimeout(this.setParameters, 500);
		// 	}
			
		// }
    },
	methods:{
		stop(){
			this.clearMessages();
			this.position_running = false;				//NEW !!!!!!!!!!!!!!!!!!!!!!!!!!!!
			if(this.inputMode == 'ramp'){
				eventBus.$emit('stopramp');
			}
			this.showInputType = true;
			this.speedParam = 0;
			this.currentMode = 'stopped';
			this.dataSocket.send(JSON.stringify({
				set: "mode",
				to: "stop"
			}));
			this.changingMode = false;
			this.updateStore();
		},
		hasStopped(message){
			if(this.currentMode != 'stopped'){
				this.stop();								//firmware does not automatically stop
				this.clearMessages();
				this.position_running = false;				//NEW !!!!!!!!!!!!!!!!!!!!!!!!!!!!
				this.showInputType = true;
				this.error = 'Automatic stop: ' + message + ". Select a mode to continue.";
				if(this.inputMode == 'ramp'){
					eventBus.$emit('stopramp');
					eventBus.$emit('datarecorderstop');
				}
				this.speedParam = 0;
				this.currentMode = 'stopped';
				this.changingMode = false;
				this.updateStore();
			}
		},
		wait(){
			//this is an internal mode in the firmware and does not need to be reflected in the UI.
			this.position_running = false;				//NEW !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			eventBus.$emit('datarecorderstop');
			this.dataSocket.send(JSON.stringify({
				set: "mode",
				to: "wait"
				}));
		},
		speedPid(){
			this.clearMessages();
			this.setMaxParameters('speedPid');
			if(this.currentMode == 'stopped'){
				store.setGraphDataParameter('omega');
				this.currentMode = 'speedPid';
				this.dataSocket.send(JSON.stringify({
				set: "mode",
				to: "velocity"
				}));
			} else{
				this.error = 'Must STOP before entering speedPid mode';
			}
			this.changingMode = false;
			this.updateStore();
			setTimeout(this.setParameters, 500);					//when entering pid mode ensure parameters are set
		},
		speedRaw(){
			this.clearMessages();
			if(this.currentMode == 'stopped'){
				store.setGraphDataParameter('omega');
				this.currentMode = 'speedRaw';
				this.dataSocket.send(JSON.stringify({
				set: "mode",
				to: "motor"
				}));
			} else{
				this.error = 'Must STOP before entering speedRaw mode';
			}
			
			this.changingMode = false;
			this.updateStore();
		},
		setSpeed(){
			this.clearMessages();
			this.showInputType = false;
			if(!isNaN(this.speedParam)){
				if(this.currentMode == 'speedPid'){
					let speed = parseFloat(this.speedParam);
					this.dataSocket.send(JSON.stringify({
						set: "velocity",
						to: speed
			}));
				} else{
					this.error == 'Must be in speedPid mode';
				}
			} else {
				this.error = 'Speed parameter is NaN';
			}
		},
		positionPid(){
			this.clearMessages();
			this.position_running = false;												//NEW !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			this.setMaxParameters('positionPid');
			if(this.currentMode == 'stopped'){
				store.setGraphDataParameter('theta');
				this.currentMode = 'positionPid';
				this.dataSocket.send(JSON.stringify({
				set: "mode",
				to: "position"
				}));
			} else{
				this.error = 'Must STOP before entering positionPid mode';
			}
			this.changingMode = false;
			this.updateStore();
			setTimeout(this.setParameters, 500);			//when entering pid mode ensure parameters are set
		},
		setPosition(){
			this.clearMessages();
			this.showInputType = false;
			this.position_running = true;												//NEW !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			console.log(this.position_running);
			if(!isNaN(this.angleParam)){
				if(this.currentMode == 'positionPid'){
					let pos = this.angleParam			//anglParam in rad
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
		setParameters(){
			this.clearMessages();
			if(!isNaN(this.kpParam) && !isNaN(this.kiParam) && !isNaN(this.kdParam) && !isNaN(this.dtParam) && this.kpParam >= 0 && this.kiParam >= 0 && this.kdParam >= 0){
				console.log('Kp set = ' + parseFloat(this.kpParam));
				this.dataSocket.send(JSON.stringify({
				"set": "parameters",
				"kp": parseFloat(this.kpParam),
				"ki": parseFloat(this.kiParam),
				"kd": parseFloat(this.kdParam),
			}));
			this.updateStore();
			console.log("parameters sent");
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
			this.kdParam = 0.0;
			this.dtParam = 20.0;
			this.setParameters();
		},
		toggleInputType(on){
			console.log("event emitted");
			this.showInputType = on;
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
		//var fixed_delay = 0.1;
		let delay_sum = 0;
		//let avg_delay = 0;
		//let delays = [];
		var messageCount = 0
		let a;
		let b;
		let debug = false;
		//let wrapEncoder = false;			//NO WRAPPING OF ENCODER?

		var initialSamplingCount = 1200 // 2 mins at 10Hz, 1200
		var delayWeightingFactor = 30  // 
		//let encoderPPR = 2000			//500 counts per revolution, becomes 2000 pulses per revolution with encoder A and B pins

		let responsiveSmoothie = true;
		let thisTime;
		
		//smoothie chart for displaying angular velocity data
		//maxValue:200,minValue:-200 removed
		var chart_omega = new SmoothieChart({responsive: responsiveSmoothie, millisPerPixel:10,grid:{fillStyle:'#ffffff'},maxValue:400,minValue:-400, interpolation:"linear",labels:{fillStyle:'#0024ff',precision:2}});
		this.canvas_omega = document.getElementById("smoothie-chart_omega");
		let series_omega = new TimeSeries();
		chart_omega.addTimeSeries(series_omega, {lineWidth:2,strokeStyle:'#0024ff'});
		chart_omega.streamTo(this.canvas_omega, 0);

		//smoothie chart for displaying angle data
		var chart_theta = new SmoothieChart({responsive: responsiveSmoothie, millisPerPixel:10,grid:{fillStyle:'#ffffff'}, maxValue:6.28,minValue:-1, interpolation:"linear",labels:{fillStyle:'#0024ff',precision:2}});
		this.canvas_theta = document.getElementById("smoothie-chart_theta");
		let series_theta = new TimeSeries();
		chart_theta.addTimeSeries(series_theta, {lineWidth:2,strokeStyle:'#0024ff'});
		chart_theta.streamTo(this.canvas_theta, 0);

		this.dataSocket.onopen = (event) => {
			console.log("dataSocket open" + event);

			resolve(console.log('opened'));
			//dataOpen = true; 
			

		};

		this.dataSocket.onmessage = (event) => {
			
			try {
				var obj = JSON.parse(event.data);
				
				//NEW ADDITION OF PID VALUES
				store.state.current_p_value = obj.p_sig;
				store.state.current_i_value = obj.i_sig;
				store.state.current_d_value = obj.d_sig;
				store.state.current_error = obj.e;
				store.state.current_drive = obj.y;
				store.state.current_command_value = obj.c;
				
				if(obj.error){
					this.hasStopped(obj.error);
				}
				else{
					var msgTime = obj.t;
					msgTime = parseFloat(msgTime);
					var thisDelay = new Date().getTime() - msgTime;
				
					var enc = obj.d;							//THIS IS NOW IN RADS
					//store.state.current_enc_pos = enc;			//store as a position between -1000 and 1000
					var enc_ang_vel = obj.v;			//RAD/S
					let enc_ang_vel_rpm = enc_ang_vel*60.0/(2*Math.PI)
				
					// if (messageCount == 0){
					// 	delay = thisDelay
					// } 

					// if (messageCount < 100){
					// 	if(messageCount == 0){
					// 		delay = thisDelay
					// 	}
					// 	delay_sum += thisDelay;
					// } else if(messageCount == 100){
					// 	delay = delay_sum / 100;
					// }

					if(messageCount == 0){
						delay = thisDelay
						delay_sum += thisDelay;
					} else{
						if(!isNaN(thisDelay)){
							delay_sum += thisDelay;
							delay = delay_sum / (messageCount + 1);
						} else{
							delay_sum += delay;
							delay = delay_sum / (messageCount + 1);
							
						}
						
					}

					
					

					a = 1 / delayWeightingFactor
					b = 1 - a

				
					if (messageCount < initialSamplingCount) {
						thisDelay = ((delay * messageCount) + thisDelay) / (messageCount + 1)
					} else {
						thisDelay = (delay * b) + (thisDelay * a)
					}
					
					
					messageCount += 1


					thisTime = msgTime + thisDelay;

				
				if (!isNaN(thisTime)){
					//store.state.current_time = msgTime + delay;

					if(!isNaN(enc)){
						store.state.current_time = msgTime;				
						//encoder position in radians
						//enc = enc * 2* Math.PI / encoderPPR;		//ALREADY IN RAD

						store.state.current_angle = enc;
						//in degrees
						// let enc_deg = enc*180.0/Math.PI;
						// store.state.current_angle_deg = enc_deg;
						//console.log(msgTime + avg_delay);
						series_theta.append(msgTime + thisDelay, enc);

						
					}
					
					if(!isNaN(enc_ang_vel)){		
						store.state.current_time = msgTime;
						store.state.current_ang_vel = enc_ang_vel_rpm;
						
						series_omega.append(msgTime + thisDelay, enc_ang_vel);	
						//series_omega.append(msgTime + delay, enc_ang_vel)	
						
					}
					
					
					if(debug) {
						console.log(delay,msgTime, enc_ang_vel)
					}
				}
				else {
					if (debug) {
						console.log("NaN so not logging to smoothie",delay,msgTime, enc_ang_vel)
					}
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
		setMaxParameters(mode){
			if(mode == 'positionPid'){
				this.max_parameter_values.kp = 10;
				this.max_parameter_values.ki = 10;
				this.max_parameter_values.kd = 5;
				this.max_parameter_values.dt = 20;
			} else if(mode == 'speedPid'){
				this.max_parameter_values.kp = 10;			//NEED TO TEST THESE
				this.max_parameter_values.ki = 10;
				this.max_parameter_values.kd = 5;
				this.max_parameter_values.dt = 20;
			}
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
			
		},

	},
}




</script>

<style scoped>

.error-message{
	color: red;
	text-decoration: bold;
	border: thin;
	box-shadow: 0px 0px;
}

.error{
    /* border:thick solid red */
	border: auto;
}

.error:focus{
    /* border:thick solid red */
	border: auto;
}

#smoothie-chart_omega{
	width:100%;
	height: 120px;
}

#smoothie-chart_theta{
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

#pidspeed        {background-color: rgb(255, 187, 0);}
#pidspeed:hover  {background-color: #cc9d1eff;}

#pidposition        {background-color: rgb(115, 255, 0);}
#pidposition:hover  {background-color: rgb(58, 92, 3);}

#dcmotor        {background-color: rgb(217, 255, 0);}
#dcmotor:hover  {background-color: rgb(190, 187, 2);}

#resetHeight         {background-color: #5b7fa5ff;}
#resetHeight:hover   {background-color: #46627fff;}

#configure         {background-color: rgb(220, 38, 236);}
#configure:hover   {background-color: rgb(76, 19, 82);}

#set         {background-color: rgb(30, 250, 1);}
#set:hover   {background-color: rgb(30, 172, 2);}

#wait       {background-color:  rgb(255, 30, 0);}
#wait:hover {background-color: #520303} 
</style>