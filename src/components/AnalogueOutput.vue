<template>
<div class='container-sm m-2 p-2 bg-white'>
    <div class='row'>
        <div class='col-12'>
            <!-- <div class='col-sm-4'><input type='text' class='form-control' id="ang_velocity" v-model='armValue'></div> -->
            <canvas id='output'></canvas>
        </div>
    </div>
</div>

</template>

<script>
//import { store } from "../simplestore.js";
//import { eventBus } from "../main.js";
//import ReconnectingWebSocket from 'reconnecting-websocket';

export default {

  name: 'AnalogueOutput',
  props: {
      outputValue: String,
      minValue: Number,
      maxValue: Number,
      intervalValue: Number,
  },
  data () {
    return {
        canvas: null,
        ctx: null,
        arm: 0,
    }
  },
  created(){
      
  },
  beforeMount(){

  },
  mounted(){
      this.canvas = document.getElementById('output');
      this.ctx = this.canvas.getContext('2d');
      this.drawDial();
      this.drawTicks();
      this.drawArm();

  },
  components: {
    
  },
  computed:{
     armValue(){
         let value = this.outputValue;
         if(isNaN(Number(value))){
              return 0;
          } else{
              return Number(value);
          }
     }
  },
  watch:{
      armValue(){
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);  
          this.drawDial();
          this.drawTicks();
          this.drawArm();
      }
  },
  methods: {
      drawArm(){
          if(isNaN(Number(this.outputValue))){
              this.arm = 0;
          } else{
              this.arm = Number(this.outputValue);
          }
        let angle = Math.PI/2 + 2*Math.PI*this.arm/this.maxValue;
        this.ctx.lineWidth = 2;              // HAND WIDTH.

        this.ctx.beginPath();
        // START FROM CENTER OF THE CLOCK.
        this.ctx.moveTo(this.canvas.width / 2, this.canvas.height / 2);   
        // DRAW THE LENGTH.
        this.ctx.lineTo((this.canvas.width / 2 + Math.cos(angle) * this.canvas.height/2),
            this.canvas.height / 2 + Math.sin(angle) * this.canvas.height/2);


        this.ctx.strokeStyle = '#586A73';        // COLOR OF THE HAND.
        this.ctx.stroke();
      },
      drawDial(){
        this.ctx.beginPath();
        this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, this.canvas.height/2 - 5, 0, Math.PI * 2);
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = '#92949C';
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, this.canvas.height/2, 0, Math.PI * 2);
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = '#92949C';
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, 5, 0, Math.PI * 2);
        this.ctx.lineWidth = 3;
        this.ctx.fillStyle = '#353535';
        this.ctx.strokeStyle = '#0C3D4A';
        this.ctx.stroke();
        this.ctx.fill();
      },
      drawTicks(){
          let num_ticks = (this.maxValue - this.minValue)/this.intervalValue;
          let angle = Math.PI/2;
          for (let i = 0; i < num_ticks; i++) {
            angle += 2*Math.PI/num_ticks;       // THE ANGLE TO MARK.
            this.ctx.lineWidth = 1;            // HAND WIDTH.
            this.ctx.beginPath();

            var x1 = (this.canvas.width / 2) + Math.cos(angle) * (this.canvas.height/2);
            var y1 = (this.canvas.height / 2) + Math.sin(angle) * (this.canvas.height/2);
            var x2 = (this.canvas.width / 2) + Math.cos(angle) * (this.canvas.height/2 - (this.canvas.height/2 / 7));
            var y2 = (this.canvas.height / 2) + Math.sin(angle) * (this.canvas.height/2 - (this.canvas.height/2 / 7));

            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);

            this.ctx.strokeStyle = '#466B76';
            this.ctx.stroke();
        }
      },

      
  }
}
</script>

<style scoped>
canvas{
    width:100%;
    height:auto;
}


</style>