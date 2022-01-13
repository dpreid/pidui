//Vue3 updated

<template>

<div v-if='getSessionExpired' class='row'>
  <div class='col-12'>
        <img id='session-end-image' src='https://assets.practable.io/images/common/thank-you-screen.svg' alt='session ended'>
    </div>
</div>
<div v-else>
  <div class='row' >
      <div class='col-12' id='video-element'>
        <canvas id="video-canvas"></canvas>
      </div>
    </div>

    <div class='row'>
      <div class='col-6'>
        <toolbar parentCanvasID="video-canvas" parentComponentName="webcam" parentDivID='video-element' :showDownload='true' :showPopupHelp='false' :showOptions="false"></toolbar>
      </div>

      <span class="col-3 pt-2 align-middle text-end">
        <p>Volume: {{ current_volume.toFixed(1)*10 }}</p>
      </span>

      <div class='btn-group col-3'>
        <button class='btn btn-outline-primary' @click='decreaseVolume'>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-volume-down" viewBox="0 0 16 16">
            <path d="M9 4a.5.5 0 0 0-.812-.39L5.825 5.5H3.5A.5.5 0 0 0 3 6v4a.5.5 0 0 0 .5.5h2.325l2.363 1.89A.5.5 0 0 0 9 12V4zM6.312 6.39 8 5.04v5.92L6.312 9.61A.5.5 0 0 0 6 9.5H4v-3h2a.5.5 0 0 0 .312-.11zM12.025 8a4.486 4.486 0 0 1-1.318 3.182L10 10.475A3.489 3.489 0 0 0 11.025 8 3.49 3.49 0 0 0 10 5.525l.707-.707A4.486 4.486 0 0 1 12.025 8z"/>
        </svg>
        </button>
        
        <button class='btn btn-outline-primary' @click='increaseVolume'>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-volume-up" viewBox="0 0 16 16">
            <path d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z"/>
            <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z"/>
            <path d="M10.025 8a4.486 4.486 0 0 1-1.318 3.182L8 10.475A3.489 3.489 0 0 0 9.025 8c0-.966-.392-1.841-1.025-2.475l.707-.707A4.486 4.486 0 0 1 10.025 8zM7 4a.5.5 0 0 0-.812-.39L3.825 5.5H1.5A.5.5 0 0 0 1 6v4a.5.5 0 0 0 .5.5h2.325l2.363 1.89A.5.5 0 0 0 7 12V4zM4.312 6.39 6 5.04v5.92L4.312 9.61A.5.5 0 0 0 4 9.5H2v-3h2a.5.5 0 0 0 .312-.11z"/>
        </svg>
        </button>
        <button :class='getMutedClass' @click='toggleMute'>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-volume-mute" viewBox="0 0 16 16">
            <path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zM6 5.04 4.312 6.39A.5.5 0 0 1 4 6.5H2v3h2a.5.5 0 0 1 .312.11L6 10.96V5.04zm7.854.606a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0z"/>
          </svg>
        </button>
      </div>  
        
    </div>
</div>    
    
    <!-- <div class='row' >
      <div class='col-12' id='video-element'>
        <canvas id="video-canvas"></canvas>
        <toolbar parentCanvasID="video-canvas" parentComponentName="webcam" parentDivID='video-element' :showDownload='true' :showPopupHelp='false' :showOptions="false"></toolbar>
      </div>
    </div> -->
    <!-- <div id='videoWrapper'></div> -->
</template>

<script>
import JSMpeg from "@cycjimmy/jsmpeg-player";
import { mapGetters } from 'vuex';
import Toolbar from "./elements/Toolbar.vue";

export default {
  name: "VideoElement",
  props: ["url"],
  components:{
      Toolbar,
    },
  data(){
      return{
        player: null,
        current_volume: 0.5,
        muted: false,
      }
    },
  computed:{
    ...mapGetters([
      'getSessionExpired',
    ]),
    getMutedClass(){
      if(this.muted){
        return 'btn btn-primary';
      } else{
        return 'btn btn-outline-primary';
      }
    }
  },
  mounted(){
    //TEMP in mounted
    // let canvas = document.getElementById("video-canvas");
    //     //temporary static URL for video access
    //     let url = "wss://video.practable.io:443/in/dpr/video0";
    //     this.player = new JSMpeg.Player(url, {canvas: canvas, preserveDrawingBuffer: true});
  },
  watch:{
    url(){
        let canvas = document.getElementById("video-canvas");
        this.player = new JSMpeg.Player(this.url, {canvas: canvas, preserveDrawingBuffer: true});
        this.current_volume = this.player.volume;
    },
  },
  methods:{
    setVolume(value){
      this.player.volume = value;
      this.current_volume = value;
    },
    increaseVolume(){
      if(this.muted){
        this.muted = false;
      }
     
      if(this.current_volume < 1){
        this.current_volume += 0.1;
      }
      if(this.current_volume > 10){
        this.current_volume = 10.0;
      }

      this.player.volume = this.current_volume;
    },
    decreaseVolume(){
      if(this.muted){
        this.muted = false;
      }
  
      if(this.current_volume > 0){
        this.current_volume -= 0.1;
      }
      if(this.current_volume < 0){
        this.current_volume = 0;
      }

      this.player.volume = this.current_volume;
    },
    toggleMute(){
      if(this.muted){
        this.player.volume = this.current_volume;
      } else{
        this.player.volume = 0;
      }

      this.muted = !this.muted;
    },
  }
    
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