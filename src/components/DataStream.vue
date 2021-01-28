<template>
<div>
    <div v-if='"version" == "spinning_disk"'><control-panel-spinning-disk :remoteLabVersion="version" :isDataRecorderOn="dataRecorder" :disableTooltips="tooltips" :url="url"/></div>
    <div v-else-if='"version" == "robot_arm"'><control-panel-robot-arm :remoteLabVersion="version" :isDataRecorderOn="dataRecorder" :disableTooltips="tooltips" :url="url"/></div>
    <div v-else-if='"version" == "variable_governor"'><control-panel-variable-governor :remoteLabVersion="version" :isDataRecorderOn="dataRecorder" :disableTooltips="tooltips" :url="url"/></div>

</div>
</template>

<script>
import axios from "axios";
import ControlPanelRobotArm from "./ControlPanelRobotArm.vue";
import ControlPanelSpinningDisk from "./ControlPanelSpinningDisk.vue";
import ControlPanelVariableGovernor from "./ControlPanelVariableGovernor.vue";

export default {
	name: "DataStream",
	prop:{
        remoteLabVersion: String,
        isDataRecorderOn: Boolean,
        disableTooltips: Boolean,
	},
	components:{
		ControlPanelRobotArm,
        ControlPanelSpinningDisk,
        ControlPanelVariableGovernor,
	},
    data(){
        return{
			// player: null,
			stream: Object,
        }
    },
    computed:{
		urlOK() {
			return this.$store.getters.getDataURLObtained;
		},
		streamOK(){
			console.log("running data stream ok");
			//return this.stream;
			return this.$store.getters.getStream("data");

		},
		url(){
			return this.$store.getters.getDataURL;
        },
        version(){
            return this.remoteLabVersion;
        },
        dataRecorder(){
            return this.isDataRecorderOn;
        },
        tooltips(){
            return this.disableTooltips;
        }
		
	},
	methods:{
		
	},
	mounted(){
		// let canvas = document.getElementById("video-canvas");
		//let playerUrl = 'wss://video.practable.io:443/out/dpr/video0';		//for robot arm
		//let playerUrl = 'wss://video.practable.io:443/out/dpr/video1';		//for variable governor
		//let playerUrl = 'wss://video.practable.io:443/out/dpr/video2';		//for spinner
		
		//let player = new JSMpeg.Player(playerUrl, {canvas: canvas});

		//new JSMpeg.Player(this.url, {canvas: canvas});

			//this.connectPlayer();
		},
	watch:{
		streamOK: function(is) {
			if (is) {
				console.log("DATA STREAM OK RUNNING");
				this.stream = this.$store.getters.getStream("data");
				var accessURL = this.stream.url;
				var token = this.stream.token;
				var store = this.$store;
				axios
				.post(accessURL, {}, { headers: { Authorization: token } })
				.then((response) => {
					store.dispatch("setDataURL", response.data.uri);
				})
				.catch((err) => console.log(err));
			} else{
				console.log("no stream");
			}
    },
		urlOK(is) {
			if (is) {
				console.log("get dataURL", this.urlOK, this.url);
			}
		},

	}
}


</script>

<style scoped>

</style>