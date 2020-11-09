//import Vue from 'vue';

export const store = {
    state: {
       current_enc_pos: 0,
        current_angle: 0,     //in rad
        current_ang_vel: 0,   //in rpm
        current_time: 0,
        start_time: 0,
        data: [],
       },
       calculateAngularVelocity(){
          let current_index = this.state.data.length - 1;
          let current_data = this.state.data[current_index];
          let previous_data = this.state.data[current_index - 1];
          if(current_data && previous_data){
              let theta_delta = current_data.theta - previous_data.theta;
              let time_delta = current_data.t - previous_data.t;
              let ang_vel = theta_delta / time_delta;
              return ang_vel;
          } 
          else{
             
             return NaN;
          }
          
  
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
           console.log("start time = " + this.state.start_time);
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