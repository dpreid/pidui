<template>
<div class='container-sm'>
<div class='row' id="video">
	<div class='col-12'>
		<!-- <canvas id="video-canvas"></canvas> -->
		<video-element :url="url" />
	</div>
</div>
</div>
</template>

<script>
//import * as pendulum from "../pendulum";
//import { eventBus } from "../main";
//import { JSMpeg } from "../../public/js/jsmpeg.min.js";
//import JSMpeg from "jsmpeg";
//import JSMpeg from '@cycjimmy/jsmpeg-player';
//playerUrl = scheme + host + ':' + port + '/' + stream;
//let playerUrl = 'ws://video.practable.io:8080/out/dpr/video0';
import axios from "axios";
import VideoElement from "./VideoElement.vue";

export default {
	name: "WebcamStream",
	components:{
		VideoElement,
	},
    data(){
        return{
			// player: null,
			stream: Object,
        }
    },
    computed:{
		urlOK() {
			return this.$store.getters.getVideoURLObtained;
		},
		streamOK(){			
			return this.$store.getters.getStream("video");
		},
		url(){
			return this.$store.getters.getVideoURL;
			
		},
		
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
				this.stream = this.$store.getters.getStream("video");
				var accessURL = this.stream.url;
				var token = this.stream.token;
				var store = this.$store;
				axios
				.post(accessURL, {}, { headers: { Authorization: token } })
				.then((response) => {
					store.dispatch("setVideoURL", response.data.uri);
				})
				.catch((err) => console.log(err));
			} else{
				console.log("no stream");
			}
    },
		urlOK(is) {
			if (is) {
				console.log("get videoURL", this.urlOK, this.url);
			}
		},

	}
}


</script>

<style scoped>
#video-canvas{
	width:80%;
	height: 100%;
}
</style>