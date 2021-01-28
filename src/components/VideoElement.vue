<template>
    <canvas id="video-canvas"></canvas>
    <!-- <div id='videoWrapper'></div> -->
</template>

<script>
import JSMpeg from "@cycjimmy/jsmpeg-player";


export default {
  name: "VideoElement",
  props: ["url"],
  data(){
        return{
			player: null,
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
            console.log("url attempt to stream = " + this.url);
            this.player = new JSMpeg.Player(this.url, {canvas: canvas});
            // let url = this.$store.getters.getVideoURL;
            // this.player = new JSMpeg.VideoElement("#videoWrapper", url, {
            //     autoplay: true,
            //     chunkSize: 10 * 1024 * 1024,
            // });
        }
    },
  mounted() {
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
    #videoWrapper {
      margin: 20px auto;
      width: 640px;
      height: 480px;
    }
</style>