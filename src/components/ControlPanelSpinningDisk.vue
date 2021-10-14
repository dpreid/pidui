//commandStore update

<template>

<div class='container-sm m-2 bg-white border rounded'>
	<div class='row align-content-center m-1'>
		<div class='col-12'>
			<canvas v-show='getCurrentMode == "positionPid"' id="smoothie-chart_theta"></canvas>
			<canvas v-show='getCurrentMode != "positionPid"' id="smoothie-chart_omega"></canvas>
		</div>
	</div>

	<toolbar :showDownload="false" :showPopupHelp="false" :showOptions="true">
		<template v-slot:options>
			<h2>Live graph options</h2>
			<div class='row'>
				<div class='col-6'>
					<label class='m-2' for="smoothie_y_max">Y Axis Max</label>
					<input v-if='getCurrentMode == "positionPid"' id="smoothie_y_max" v-model="smoothie_y_max_pos" @keyup.enter='updateSmoothieChart' @blur='updateSmoothieChart'>
					<input v-else id="smoothie_y_max" v-model="smoothie_y_max_vel" @keyup.enter='updateSmoothieChart' @blur='updateSmoothieChart'>

					<label class='m-2' for="smoothie_y_min">Y Axis Min</label>
					<input v-if='getCurrentMode == "positionPid"' id="smoothie_y_min" v-model="smoothie_y_min_pos" @keyup.enter='updateSmoothieChart' @blur='updateSmoothieChart'>
					<input v-else id="smoothie_y_min" v-model="smoothie_y_min_vel" @keyup.enter='updateSmoothieChart' @blur='updateSmoothieChart'>
				</div>
				<div class='col-6'>
					<label class='m-2' for="smoothie_millis_per_pixel">Milliseconds per pixel</label>
					<input id="smoothie_millis_per_pixel" v-model="smoothie_millis_per_pixel" @keyup.enter='updateSmoothieChart' @blur='updateSmoothieChart'>
					
				</div>
			</div>
		</template>
	</toolbar>
	

	<div class="panel panel-default">
		<div v-if='getCurrentMode != ""' class='panel-heading'><h3>Current mode: {{getModeName}}</h3></div>
		<div class='panel-body'>{{message}}</div>
		<div :class='getErrorClass'><h3>{{error}}</h3></div>
	</div>

	<div id="buttons">
		<div class='row'>
			<div class='d-grid gap-1 d-md-block mb-1'>
				<button v-if='getCurrentMode == "stopped"' id="pidspeed" class="btn btn-lg btn-primary me-1" @click="speedPid">Velocity (PID)</button>
				<button v-if='getCurrentMode == "stopped"' id="pidposition" class="btn btn-lg btn-secondary me-1" @click="positionPid">Position (PID)</button>	
				<button v-if='getCurrentMode == "stopped"' id="dcmotor" class="btn btn-lg btn-success me-1" @click="speedRaw">Voltage (open loop)</button>
				<button id="stop" v-if='getCurrentMode != "stopped"' class="btn btn-lg btn-danger" @click="stop">Exit mode</button>
			</div>
		</div>

		<div class='row d-flex justify-content-center'>
			<div class='col-auto'>
				<div class='input-group' v-show='showInputType'>
					<span class="input-group-text" for="inputSelect">Input type</span>
					<select class="form-select form-select-sm" name="inputSelect" id="inputSelect" v-model="inputMode">
						<option v-if='getCurrentMode == "speedRaw"' value="free">Free</option>
						<option value="step">Step</option>
						<option v-if='getRemoteLabVersion != "robot_arm"' value="ramp">Ramp</option>
					</select> 
				</div>
			</div>
		</div>

	</div>

<div v-if='getCurrentMode == "positionPid" || getCurrentMode == "speedPid" || getCurrentMode == "speedRaw"'>

	<div v-if='inputMode == "free"'>
		<div v-if='getCurrentMode == "speedRaw"'>
			<DCMotorPanel v-bind:dataSocket="getDataSocket" :maxV="12" />
		</div>
	</div>

	<div v-else-if="inputMode == 'step'">
		<StepCommand v-bind:mode='getCurrentMode' @showinputtype="toggleInputType"/>
	</div>

	<div v-else-if="inputMode == 'ramp'">
		<RampCommand v-bind:mode='getCurrentMode' @showinputtype="toggleInputType"/>
	</div>

</div>
	

	<div v-if='getCurrentMode == "speedPid" || getCurrentMode == "positionPid"' @mousedown="setDraggable(false)" @mouseup="setDraggable(true)">
		<div class='row justify-content-center mb-2'>
		
			<div class='col-md-3'>
				<div class="input-group">
					<span class="input-group-text" id="basic-addon1">K<sub>p</sub></span>
					<input type="number" max='10.00' min='0.00' step='0.01' :class="(parseFloat(kpParam) >= 0) ? 'form-control' : 'form-control is-invalid'" placeholder="Kp" aria-label="Kp" aria-describedby="basic-addon1" id="kp" v-model="kpParam" @keyup.enter='setParameters' @blur='setParameters'>
				</div>	
			</div>

			<div class='col-md-3'>
				<div class="input-group">
					<span class="input-group-text" id="basic-addon1">K<sub>i</sub></span>
					<input type="number" max='10.00' min='0.00' step='0.01' :class="(parseFloat(kiParam) >= 0) ? 'form-control' : 'form-control is-invalid'" placeholder="Ki" aria-label="Ki" aria-describedby="basic-addon1" id="ki" v-model="kiParam" @keyup.enter='setParameters' @blur='setParameters'>
				</div>
			</div>

			<div class='col-md-3'>
				<div class="input-group">
					<span class="input-group-text" id="basic-addon1">K<sub>d</sub></span>
					<input type="number" max='10.00' min='0.00' step='0.01' :class="(parseFloat(kdParam) >= 0) ? 'form-control' : 'form-control is-invalid'" placeholder="Kd" aria-label="Kd" aria-describedby="basic-addon1" id="kd" v-model="kdParam" @keyup.enter='setParameters' @blur='setParameters'>
				</div>	
			</div>
			<div class='col-md-3'>
				<button id="reset" type='button' class="btn btn-danger btn-sm" @click="resetParameters">Reset</button>
			</div>
		
		</div>
	</div>

</div>

</template>

<script>

import { SmoothieChart } from 'smoothie';
import { TimeSeries } from 'smoothie';
import DCMotorPanel from './DCMotorPanel.vue';
import StepCommand from './StepCommand.vue';
import RampCommand from './RampCommand.vue';
import { mapActions, mapGetters } from 'vuex';
import Toolbar from './elements/Toolbar.vue';

export default {
	name: "ControlPanelSpinningDisk",
	props:{
		url: String,
	},
	emits:['toggledraggable'],
	components:{
		DCMotorPanel,
		StepCommand,
		RampCommand,
		Toolbar,
	},
    data(){
        return{
			dataSocket: null,
			speedParam: 0,			//in rad/sec FOR NEW FIRMWARE
			angleParam: 0,			//in rads for new firmware
			kpParam: 1.00,
			kiParam: 0.00,
			kdParam: 0.00,
			message: '',				//for sending user messages to screen
			error:'',					//for sending errors to screen
			chart_omega: null,
			canvas_omega: null,
			chart_theta: null,
			canvas_theta: null,
			smoothie_y_min_vel: -400,
			smoothie_y_max_vel: 400,
			smoothie_y_min_pos: -1,
			smoothie_y_max_pos: 6.28,
			smoothie_millis_per_pixel: 10,
			showInputType: false,				//don't show input types until a mode has been selected
        }
    },
	created(){
		this.$store.dispatch('setCurrentMode',  'stopped');
		this.$store.dispatch('setInputMode',  'step');
	},
	mounted(){
		this.connectWithArrays();		//testing============================================================
	},
	computed: {
		...mapGetters([
			'getModeName',
			'getDataURLObtained',
			'getRemoteLabVersion',
			'getCurrentMode',
			'getSessionExpired',
			'getMaxReached'
		]),
		inputMode: {
			get(){
				return this.$store.getters.getInputMode;
			},
			set(mode){
				this.$store.dispatch('setInputMode', mode);
			}
		},
		getDataSocket(){
			return this.dataSocket;
		},
		getErrorClass(){
			if(this.error == ''){
				return ""
			} else {
				return "error-message border border-danger";
			}
		},
		
	},
	watch:{
        url(){
			try{
				if(this.url != '' && this.getDataURLObtained){
					//this.connect();								//only for testing, reinstate later==================================
					//this.setGraphDataParameter('omega');
				} else{
					console.log('disconnecting: ' + this.url);
				}
				
			} catch(e){
				console.log(e);
			}
			
			
		},
		getSessionExpired(exp){
			if(exp){
				this.stop();
			}
		},
		getMaxReached(reached){
			if(reached){
				this.error = 'Max graph points reached, graphing automatically stopped'
			} else{
				this.error = '';
			}
		}
    },
	methods:{
		...mapActions([
			'setCurrentMode',
			'setGraphDataParameter',
			'setDraggable'
		]),
		stop(){
			this.clearMessages();
			this.showInputType = false;	
			this.speedParam = 0;
			this.$store.dispatch('stop');
		},
		hasStopped(message){
			this.error = 'Automatic stop: ' + message + ". Select a mode to continue.";
			this.stop();								
		},
		speedPid(){
			this.clearMessages();
			this.setGraphDataParameter('omega');
			this.showInputType = true;
			this.$store.dispatch('speedPid');
			setTimeout(this.setParameters, 100);					//when entering pid mode ensure parameters are set
		},
		positionPid(){
			this.clearMessages();
			this.setGraphDataParameter('theta');
			this.showInputType = true;
			this.$store.dispatch('positionPid');
			setTimeout(this.setParameters, 100);			//when entering pid mode ensure parameters are set
		},
		speedRaw(){
			this.clearMessages();
			this.setGraphDataParameter('omega');
			this.showInputType = true;
			this.$store.dispatch('speedRaw');
		},
		setSpeed(){
			this.clearMessages();
			this.showInputType = false;
			if(!isNaN(this.speedParam)){
				this.$store.dispatch('setSpeed', parseFloat(this.speedParam));
			} else {
				this.error = 'Speed parameter is NaN';
			}
		},
		setPosition(){
			this.clearMessages();
			this.showInputType = false;
			if(!isNaN(this.angleParam)){
				this.$store.dispatch('setPosition', this.angleParam);
			} else {
				this.error = 'Angle parameter is NaN';
			}
		},
		setParameters(){
			this.clearMessages();
			if(parseFloat(this.kpParam) >= 0 && parseFloat(this.kiParam) >= 0 && parseFloat(this.kdParam) >= 0){
				let params = {kp: parseFloat(this.kpParam), ki: parseFloat(this.kiParam), kd: parseFloat(this.kdParam)};
				this.$store.dispatch('setPidParameters', params);
			} else{
				this.error = 'Cannot parse PID parameters';
			}
			
		},
		hotkey(event){
			if(event.key == "s"){
				this.stop();
			} 
		},
		clearMessages(){
			this.message = '';
			this.error = '';
		},
		resetParameters(){
			this.kpParam = 1.0;
			this.kiParam = 0.0;
			this.kdParam = 0.0;
			this.setParameters();
		},
		toggleInputType(on){
			this.showInputType = on;
		},
		updateSmoothieChart(){
			if(this.getCurrentMode == 'positionPid'){
				this.chart_omega.options.maxValue = this.smoothie_y_max_pos;
				this.chart_omega.options.minValue = this.smoothie_y_min_pos;
			} 
			else{
				this.chart_omega.options.maxValue = this.smoothie_y_max_vel;
				this.chart_omega.options.minValue = this.smoothie_y_min_vel;
			}

			this.chart_omega.options.millisPerPixel = this.smoothie_millis_per_pixel;			
			
		},
		connect(){

			let _store = this.$store;
			let _this = this;

			this.dataSocket = new WebSocket(this.url);
			
			var delay = 0
			let delay_sum = 0;
			var messageCount = 0
			let a;
			let b;
			let debug = false;
			var initialSamplingCount = 1200 // 2 mins at 10Hz, 1200
			var delayWeightingFactor = 30  // 
			let responsiveSmoothie = true;
			let thisTime;
			
			var chart_omega = new SmoothieChart({responsive: responsiveSmoothie, millisPerPixel:_this.smoothie_millis_per_pixel,grid:{fillStyle:'#000000'},maxValue:_this.smoothie_y_max_vel,minValue:_this.smoothie_y_min_vel, interpolation:"linear",labels:{fillStyle:'#00ff00',precision:2}});
			this.canvas_omega = document.getElementById("smoothie-chart_omega");
			let series_omega = new TimeSeries();
			chart_omega.addTimeSeries(series_omega, {lineWidth:2,strokeStyle:'#00ff00'});
			chart_omega.streamTo(this.canvas_omega, 0);

			//smoothie chart for displaying angle data
			var chart_theta = new SmoothieChart({responsive: responsiveSmoothie, millisPerPixel:_this.smoothie_millis_per_pixel,grid:{fillStyle:'#000000'}, maxValue:_this.smoothie_y_max_pos,minValue:_this.smoothie_y_min_pos, interpolation:"linear",labels:{fillStyle:'#00ff00',precision:2}});
			this.canvas_theta = document.getElementById("smoothie-chart_theta");
			let series_theta = new TimeSeries();
			chart_theta.addTimeSeries(series_theta, {lineWidth:2,strokeStyle:'#00ff00'});
			chart_theta.streamTo(this.canvas_theta, 0);

			//in order to update the charts
			_this.chart_omega = chart_omega;
			_this.chart_theta = chart_theta;

			this.dataSocket.onopen = () => {
				console.log('data connection opened');
			};

			this.dataSocket.onmessage = (event) => {
				try {
					var obj = JSON.parse(event.data);
					
					if(obj.error){
						this.hasStopped(obj.error);
					}
					else if(obj.t){
						//set values coming from hardware
						_store.dispatch('setP', obj.p_sig);
						_store.dispatch('setI', obj.i_sig);
						_store.dispatch('setD', obj.d_sig);
						_store.dispatch('setError', obj.e);
						_store.dispatch('setDrive', obj.y);
						_store.dispatch('setCommand', obj.c);

						var msgTime = obj.t;
						msgTime = parseFloat(msgTime);
						var thisDelay = new Date().getTime() - msgTime;
					
						var enc = obj.d;					//rad
						var enc_ang_vel = obj.v;			//rad/s

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
							let data_received = false;
							if(!isNaN(enc)){
								_store.dispatch('setCurrentAngle', enc);			
								series_theta.append(msgTime + thisDelay, enc);
								data_received = true;
							}
							
							if(!isNaN(enc_ang_vel)){		
								_store.dispatch('setCurrentAngularVelocity', enc_ang_vel);
								series_omega.append(msgTime + thisDelay, enc_ang_vel);	
								data_received = true;
							}

							if(data_received){
								_store.dispatch('setCurrentTime', msgTime + thisDelay);	//testing
							}
						}
					}
				} catch (e) {
					if(debug){
						console.log(e)
					}
					
				}
			}

		_store.dispatch('setStartTime', new Date().getTime());
		window.addEventListener('keydown', this.hotkey, false);
		window.addEventListener('pagehide', this.stop);				//closing window
		window.addEventListener('beforeunload', this.stop);			//refreshing page, changing URL
		
		
		},
		connectWithArrays(){

			let _store = this.$store;
			let _this = this;

			//this.dataSocket = new WebSocket(this.url);
			this.dataSocket = new WebSocket('wss://video.practable.io:443/bi/dpr/pendulum0');		//testing
			_store.dispatch('setDataSocket', this.dataSocket);
			var delay = 0
			let delay_sum = 0;
			var messageCount = 0
			let a;
			let b;
			let debug = false;
			var initialSamplingCount = 1200 // 2 mins at 10Hz, 1200
			var delayWeightingFactor = 30  // 
			let responsiveSmoothie = true;
			//let thisTime;
			
			var chart_omega = new SmoothieChart({responsive: responsiveSmoothie, millisPerPixel:_this.smoothie_millis_per_pixel,grid:{fillStyle:'#000000'},maxValue:_this.smoothie_y_max_vel,minValue:_this.smoothie_y_min_vel, interpolation:"linear",labels:{fillStyle:'#00ff00',precision:2}});
			this.canvas_omega = document.getElementById("smoothie-chart_omega");
			let series_omega = new TimeSeries();
			chart_omega.addTimeSeries(series_omega, {lineWidth:2,strokeStyle:'#00ff00'});
			chart_omega.streamTo(this.canvas_omega, 0);

			//smoothie chart for displaying angle data
			var chart_theta = new SmoothieChart({responsive: responsiveSmoothie, millisPerPixel:_this.smoothie_millis_per_pixel,grid:{fillStyle:'#000000'}, maxValue:_this.smoothie_y_max_pos,minValue:_this.smoothie_y_min_pos, interpolation:"linear",labels:{fillStyle:'#00ff00',precision:2}});
			this.canvas_theta = document.getElementById("smoothie-chart_theta");
			let series_theta = new TimeSeries();
			chart_theta.addTimeSeries(series_theta, {lineWidth:2,strokeStyle:'#00ff00'});
			chart_theta.streamTo(this.canvas_theta, 0);

			//in order to update the charts
			_this.chart_omega = chart_omega;
			_this.chart_theta = chart_theta;

			this.dataSocket.onopen = () => {
				console.log('data connection opened');
			};

			this.dataSocket.onmessage = (event) => {
				try {
					var obj = JSON.parse(event.data);
					//console.log(obj);
					
					if(obj.error){
						this.hasStopped(obj.error);
					}
					else if(obj.t){
						//console.log(obj);
						//set values coming from hardware
						_store.dispatch('setP', obj.p_sig);		//these should all be 0 for now
						_store.dispatch('setI', obj.i_sig);
						_store.dispatch('setD', obj.d_sig);

						_store.dispatch('setErrorArray', obj.e);
						_store.dispatch('setDriveArray', obj.y);
						_store.dispatch('setCommandArray', obj.c);
						
						//new array values
						let msgTimes = obj.t;
						let encs = obj.d;
						let enc_ang_vels = obj.v;

						let d_msgTime = parseFloat(msgTimes[3]);
						var thisDelay = new Date().getTime() - d_msgTime;

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
						//thisTime = d_msgTime + thisDelay;

						if (!isNaN(d_msgTime)){
							let data_received = false;
							if(!isNaN(encs[3])){
								//_store.dispatch('setCurrentAngle', encs[3]);
								_store.dispatch('setCurrentAngleArray', encs);

								series_theta.append(d_msgTime + thisDelay, encs[3]);
								data_received = true;
							}
							
							if(!isNaN(enc_ang_vels[3])){		
								//_store.dispatch('setCurrentAngularVelocity', enc_ang_vels[3]);
								_store.dispatch('setCurrentAngularVelocityArray', enc_ang_vels);
								series_omega.append(d_msgTime + thisDelay, enc_ang_vels[3]);	
								data_received = true;
							}

							if(data_received){
								//_store.dispatch('setCurrentTime', msgTimes[3]);	//time should only be the time received from the arduino
								_store.dispatch('setCurrentTimeArray', msgTimes);
							}
						}
					}
				} catch (e) {
					if(debug){
						console.log(e)
					}
					
				}
			}

		_store.dispatch('setStartTime', new Date().getTime());
		window.addEventListener('keydown', this.hotkey, false);
		window.addEventListener('pagehide', this.stop);				//closing window
		window.addEventListener('beforeunload', this.stop);			//refreshing page, changing URL
		
		
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

select{
    color: white;
    padding-top: 5px;
    padding-bottom: 5px;
    
    background-color: #4490d8;
}

/* #setmode       {background-color: rgb(3, 248, 12);}
#setmode:hover {background-color: #3e8e41}  */

/* #reset       {background-color: rgba(248, 72, 3, 0.658);}
#reset:hover {background-color: #5f0f04}  */

/* #stop       {background-color: rgb(255, 0, 0);}
#stop:hover {background-color: #cc1e1eff;} */

/* #pidspeed        {background-color: rgb(255, 187, 0);}
#pidspeed:hover  {background-color: #cc9d1eff;}

#pidposition        {background-color: rgb(115, 255, 0);}
#pidposition:hover  {background-color: rgb(58, 92, 3);}

#dcmotor        {background-color: rgb(217, 255, 0);}
#dcmotor:hover  {background-color: rgb(190, 187, 2);} */

/* #resetHeight         {background-color: #5b7fa5ff;}
#resetHeight:hover   {background-color: #46627fff;}

#configure         {background-color: rgb(220, 38, 236);}
#configure:hover   {background-color: rgb(76, 19, 82);}

#set         {background-color: rgb(30, 250, 1);}
#set:hover   {background-color: rgb(30, 172, 2);} */

</style>