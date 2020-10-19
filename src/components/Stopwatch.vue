<template>
    <div>
        <div class="row pt-1 pb-1">
            <input id="stopwatch" :value="time_string" readonly size=8>
        </div>
        <div class="row mb-5">
            <button v-if="!isTiming" id="start" @click="startTimer">Start</button>
            <button v-if="isTiming" id="pause" @click="pauseTimer">Pause</button>
            <button id="reset" @click="resetTimer">Reset</button>
        </div>
    </div> 
</template>

<script>
//import { eventBus } from "../main";
//import { store } from "../store.js";

export default {
    name: "Stopwatch",
    data(){
        return{
        
            isTiming: false,
            timerID: 0,
            current_time: 0,        //timer in millseconds
            time_string: ""
        }
    },
    created(){
        this.isTiming = false;
        this.time_string = this.millsecondsFormatted(this.current_time);
    },
    methods:{
        startTimer(){ 
            this.isTiming = true;
            this.timerID = setInterval(() => {
                this.updateTime()
            }, 10);

        },
        pauseTimer(){
            this.isTiming = false;
            clearInterval(this.timerID);
        },
        resetTimer(){
            this.current_time = 0;
            this.time_string = this.millsecondsFormatted(this.current_time);
        },
        updateTime(){
            this.current_time += 10;
            this.time_string = this.millsecondsFormatted(this.current_time);
            
        },
        millsecondsFormatted(ms){
            let millseconds = ms % 1000;
            let seconds = Math.floor(ms / 1000);
            let minutes = Math.floor(seconds / 60);
            seconds = seconds % 60;     //seconds left after minutes removed
            let hours = Math.floor(minutes / 60);
            minutes = minutes % 60;     //minutes left after hours removed

            if(hours >= 100){
                this.current_time = 0;
            }

            let hour_string = hours < 10 ? '0' + hours.toString() : hours.toString();
            let minute_string = minutes < 10 ? '0' + minutes.toString() : minutes.toString();
            let second_string = seconds < 10 ? '0' + seconds.toString() : seconds.toString();
            let millsecond_string = millseconds.toString();

            return hour_string + ":" + minute_string + ":" + second_string + "." + millsecond_string;

        }
    },
    computed:{
        

    }
}


</script>

<style scoped>
button {
	padding: 15px 25px;
	font-size: 24px;
	text-align: center;
	cursor: pointer;
	outline: none;
	color: rgb(255, 255, 255);

	border: none;
	border-radius: 15px;
	box-shadow: 0 9px #999;
}

/*	background-color: #4CAF50;
 .button:hover {background-color: #3e8e41}*/

button:active {
	background-color: #3e8e41;
	box-shadow: 0 5px #666;
	transform: translateY(4px);
}

#stopwatch{
    font-size: 36px;
    text-align: left;
}


#start       {background-color: #4CAF50FF;}
#start:hover {background-color: #3e8e41} 

#pause       {background-color: #e13131ff;}
#pause:hover {background-color: #cc1e1eff;}

#reset  {background-color: #e17a31ff;}
#reset:hover  {background-color: #cc661eff;}

label {
    font-size:20px;
    color: #0501f7;
    font-weight: bold;
    display: inline-block;
    vertical-align: middle;
    width: 60px;
    padding-top: 20px;
    /* float: left; */
}
</style>