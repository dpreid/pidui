<template>
<div>
    <div v-if='version == "spinning_disk"'><control-panel-spinning-disk :remoteLabVersion="version" :isDataRecorderOn="dataRecorder" :disableTooltips="tooltips" :url="url"/></div>
    <div v-else-if='version == "robot_arm"'><control-panel-robot-arm :remoteLabVersion="version" :isDataRecorderOn="dataRecorder" :disableTooltips="tooltips" :url="url"/></div>
    <div v-else-if='version == "variable_governor"'><control-panel-variable-governor :remoteLabVersion="version" :isDataRecorderOn="dataRecorder" :disableTooltips="tooltips" :url="url"/></div>

</div>
</template>

<script>
import axios from "axios";
import ControlPanelRobotArm from "./ControlPanelRobotArm.vue";
import ControlPanelSpinningDisk from "./ControlPanelSpinningDisk.vue";
import ControlPanelVariableGovernor from "./ControlPanelVariableGovernor.vue";

export default {
	name: "DataStream",
	components:{
		ControlPanelRobotArm,
        ControlPanelSpinningDisk,
		ControlPanelVariableGovernor,
	},
    data(){
        return{
			stream: Object,
        }
    },
    computed:{
		urlOK() {
			return this.$store.getters.getDataURLObtained;
		},
		streamOK(){
			return this.$store.getters.getStream("data");

		},
		url(){
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
	mounted(){
		var _this = this;
		var reconnect = function () {
			_this.getWebsocketConnection();
		};
		//make second and subsequent connections
		document.addEventListener("streams:dropped", reconnect);
	},
	methods:{
		getWebsocketConnection(){
			this.stream = this.$store.getters.getStream("data");
				var accessURL = this.stream.url;
				var token = this.stream.token;
				var store = this.$store;
				store.dispatch("deleteDataURL");		//NEWLY ADDED
				axios
				.post(accessURL, {}, { headers: { Authorization: token } })
				.then((response) => {
					store.dispatch("setDataURL", response.data.uri);
				})
				.catch((err) => console.log(err));
		}
	},
	
	watch:{
		streamOK: function(is) {
			if (is) {
				this.getWebsocketConnection();
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