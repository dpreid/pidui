//import Vue from 'vue';

export const store = {
    state: {
       current_enc_pos: 0,
        current_angle: 0,     //in rad
        current_ang_vel: 0,   //in rpm
        previous_ang_vels: [],
        values_in_average: 100,
        average_count: 0,
        current_time: 0,
        start_time: 0,
        currentMode: '',
        inputMode: '',
        data: [],
        step:{
           step_time: 0,      //seconds
           step_start: 0,
           step_size: 0
        },
        ramp:{
           ramp_start: 0,
         ramp_gradient: 1,
         ramp_start_time: 0,
         max_voltage: 6,
         max_rpm: 1000,
        },
        pid_parameters:{
         Kp: 1,
         Ki:0,
         Kd:0,
         dt:3,
        },
       },
       calculateAverageVelocity(){
         this.state.previous_ang_vels[this.state.average_count] = this.state.current_ang_vel;
          if(this.state.average_count >= this.state.values_in_average - 1){
              this.state.average_count = 0;
          } else{
              this.state.average_count++;
          }
         let sum = 0;
          for(let i=0;i<this.state.values_in_average;i++){
              sum += this.state.previous_ang_vels[i];
          }

          return sum/this.state.values_in_average;
       },
       clearAllData(){
        this.state.data = [];
       },
       getNumData(){
           return this.state.data.length;
       },
       addData(object){
          this.state.data.push(object);
       },
       deleteData (dataId) {
          this.state.data.splice(dataId, 1);
        },
        getTime(){
           return (this.state.current_time - this.state.start_time)/1000;    //in seconds
        },
        getMaxTime(){
           let time_max = -Infinity;
           this.state.data.forEach(d => {
              if(d.t > time_max){
                 time_max = d.t;
              }
           });
  
           return time_max;
        },
        getMinTime(){
           let time_min = Infinity;
           this.state.data.forEach(d => {
              if(d.t < time_min){
                 time_min = d.t;
              }
           });
  
           return time_min;
        }
  
  }
      
  //data object structure
  // {
  //     id: 1,
  //      t: 0,
  //       theta: 0,
  //       omega: 0,
  //   },