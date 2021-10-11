//Vue3 updated

<template>
    <div class='m-2 p-2 bg-white border rounded stopwatch-container' id='stopwatch-container'>
        <div class="row-sm mb-2">
            <div class='form-group'><input type='text' class='form-control' id="stopwatch" :value="time_string" readonly></div>
        </div>
        <div class="col pb-2 d-grid gap-2 d-md-block">
            <button class="btn btn-default btn-xs me-2" v-if="!isTiming" id="start" @click="startTimer">Start</button>
            <button class="btn btn-default btn-xs me-2" v-if="isTiming" id="pause" @click="pauseTimer">Pause</button>
            <button class="btn btn-default btn-xs me-2" id="reset" @click="resetTimer">Reset</button>
        </div>
    </div> 
</template>

<script>

export default {
    name: "Stopwatch",
    data(){
        return{
            isTiming: false,
            timerID: 0,
            start_time: 0,
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
            this.start_time = Date.now();
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
            this.current_time = Date.now() - this.start_time;
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
.stopwatch-container{
    position: relative;
    max-width: 40%;
    min-width: 300px;
    min-height: 100px;
}

#stopwatch{
    font-size: 14;
    text-align: center;
    width: 100%;
}


#start       {background-color: rgb(3, 248, 12);}
#start:hover {background-color: #3e8e41} 

#pause       {background-color: #e13131ff;}
#pause:hover {background-color: #cc1e1eff;}

#reset  {background-color: #e17a31ff;}
#reset:hover  {background-color: #cc661eff;}

</style>