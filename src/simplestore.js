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
        graphDataParameter: 'omega',   //'theta'
        data: [],
        unityDataObject: null,     //NEW FOR SIMULATION
        current_p_value: 0,
        current_i_value: 0,
        current_d_value: 0,
        current_error: 0,
        current_drive: 0,
        current_command_value: 0,
        step:{
           step_time: 0,      //seconds
           step_start: 0,
           step_size: 0
        },
        ramp:{
           ramp_start: 0,
         ramp_gradient: 1,
         ramp_start_time: 0,
         max_voltage: 12,
         max_rad_s: 200,
        },
        pid_parameters:{
         Kp: 1,
         Ki:0,
         Kd:0,
         dt:3,
        },
        isRecording: false,
       },
       addUnityData(data){
         this.state.unityDataObject = data;
       },
       setGraphDataParameter(param){
         this.state.graphDataParameter = param;
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
        this.current_angle_unwrapped = 0;          //TESTING1111111111111
        this.current_ang_vel_unwrapped = 0

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
           if(this.state.current_time - this.state.start_time >= 0){
              return (this.state.current_time - this.state.start_time)/1000;  //in seconds
           } else{
              this.state.start_time = this.state.current_time;
              return 0.0;
           }
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
        },
        hasStorage(){
         try {
            window.localStorage.setItem('test', 'storage');
            window.localStorage.removeItem('test');
            return true;
         } catch (exception) {
            return false;
         }
        },
        hasDataToLoad(remoteLabVersion){
         if(window.localStorage.getItem('savedData')){
            if(window.localStorage.getItem('remoteLabVersion') == remoteLabVersion){
               return true;
            } else {
               return false;
            }
         } else{
            return false;
         }
        },
        saveDataToLocalStorage(remoteLabVersion){
         if(this.hasStorage()){
            if(this.getNumData() > 0){
                let data_string = JSON.stringify(this.state.data);
                console.log(data_string);
                window.localStorage.setItem('savedData', data_string);
                let date = JSON.stringify(new Date());
                window.localStorage.setItem('dateSaved', date);
                window.localStorage.setItem('remoteLabVersion', remoteLabVersion);

                return true;
            } else{
             console.log('no data to save');
             return false;
            }
            
         } else{
            console.log('no localStorage allowed');
            return false;
         }
          
      },
        loadDataFromLocalStorage(){
           if(this.hasStorage()){
            if(window.localStorage.getItem('savedData')){
               let data = window.localStorage.getItem('savedData');
               data = JSON.parse(data)
               this.clearAllData();
               for(let i=0; i<data.length;i++){
                  this.addData(data[i]);
               }

               return true;
            } else {
               console.log('no saved data');
               return false;
            }
           } else{
              console.log('no saved data');
              return false;
           }
            
        },
  
  }
 let s = store;
  window.dataStore = s;    //global variable accessible by window
      
  //data object structure
  // {
  //     id: 1,
  //      t: 0,
  //       theta: 0,
  //       omega: 0,
  //   },