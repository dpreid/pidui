<template>

<div v-if='hasSessionEnded' class='row'>
  <div class='col-12'>
        <img id='session-end-image' src='https://assets.practable.io/images/common/thank-you-screen.svg' alt='session ended'>
    </div>
</div>
<div v-else>
  <div class='row'>
      <div class='col-12'>
        <canvas id="video-canvas"></canvas>
      </div>
    </div>
</div>    
    
    
    <!-- <div id='videoWrapper'></div> -->
</template>

<script>
import JSMpeg from "@cycjimmy/jsmpeg-player";
import { eventBus } from "../main.js";

export default {
  name: "VideoElement",
  props: ["url"],
  data(){
        return{
          player: null,
          hasSessionEnded: false,
        }
    },
    computed:{
        getUrl(){
            return this.$store.getters.getVideoURL;
        }
    },
    watch:{
        getUrl(){
            let canvas = document.getElementById("video-canvas");
            this.player = new JSMpeg.Player(this.url, {canvas: canvas});
            // let url = this.$store.getters.getVideoURL;
            // this.player = new JSMpeg.VideoElement("#videoWrapper", url, {
            //     autoplay: true,
            //     chunkSize: 10 * 1024 * 1024,
            // });
        }
    },
    created(){
      eventBus.$on('sessionended', (ended) => {this.hasSessionEnded = ended});
    },
  mounted() {
    //only for debugging
    //let canvas = document.getElementById("video-canvas");
		//let playerUrl = 'wss://video.practable.io:443/out/dpr/video0';		//for robot arm
		//let playerUrl = 'wss://video.practable.io:443/out/dpr/video1';		//for variable governor
		//let playerUrl = 'wss://video.practable.io:443/out/dpr/video2';		//for spinner
		
    // new JSMpeg.Player(playerUrl, {canvas: canvas});
    
      //let canvas = document.getElementById("video-canvas");
      
      //this.player = new JSMpeg.Player(this.url, {canvas: canvas});
    // this.player = new JSMpeg.VideoElement("#videoWrapper", this.url, {
    //   autoplay: true,
    //   chunkSize: 10 * 1024 * 1024,
    // });
  },
};


</script>

<style>
    #video-canvas {
      width: 100%;
      /* height: 100%; */
    }

    #session-end-image {
      width: 100%;
      /* height: 100%; */
    }
</style>