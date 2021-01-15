<template>
<div class='container-sm'>
<div class='row' id="video">
	<div class='col-12'>
		<canvas id="video-canvas"></canvas>
	</div>
</div>
</div>
</template>

<script>
//import * as pendulum from "../pendulum";
//import { eventBus } from "../main";
//import { JSMpeg } from "../../public/js/jsmpeg.min.js";
//import JSMpeg from "jsmpeg";
import JSMpeg from '@cycjimmy/jsmpeg-player';
//playerUrl = scheme + host + ':' + port + '/' + stream;
//let playerUrl = 'ws://video.practable.io:8080/out/dpr/video0';

export default {
    name: "WebcamStream",
    data(){
        return{

        }
    },
    created(){
		
	},
	mounted(){
		let canvas = document.getElementById("video-canvas");
		let playerUrl = 'wss://video.practable.io:443/out/dpr/video1';
		console.log(playerUrl);
		let player = new JSMpeg.Player(playerUrl, {canvas: canvas});
		console.log(player);

	},
}


</script>

<style scoped>
#video-canvas{
	width:100%;
	height: 100%;
}
</style>