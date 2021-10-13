//Store for the data being received from the firmware as well as computed data properties


const dataStore = {
    state: () => ({
       //current_time: 0,
       current_time_array : [],  // in ms
        //current_angle: 0,     
        current_angle_array: [], //in rad
        current_enc_pos: 0,
        //current_ang_vel: 0,   
        current_ang_vel_array: [], //in rad/s

        //calculation of simple moving average velocity======
        moving_avg_array: [0,0,0,0,0],
        moving_avg_index: 0,
        moving_avg_k: 5,
        moving_avg: 0,
         //==================================================
        start_time: 0,
       
        inputMode: '',
        graphDataParameter: 'omega',   //'theta'
        data: [],
        max_data_points: 5000,
        p: 0,  
        i: 0,
        d: 0,
        //error: 0,
        error_array: [0,0,0,0],
        //drive: 0,
        drive_array: [0,0,0,0],
        //command: 0,
        command_array: [0,0,0,0],
      //   step:{
      //      step_time: 0,      //seconds
      //      step_start: 0,
      //      step_size: 0
      //   },
      //   ramp:{
      //      ramp_start: 0,
      //       ramp_gradient: 1,
      //       ramp_start_time: 0,
      //       max_voltage: 12,
      //       max_rad_s: 200,
      //   },
      //   pid_parameters:{      //is this necessary
      //    Kp: 1,
      //    Ki:0,
      //    Kd:0,
      //   },
        isRecording: false,         //is data actually being recorded
        
        
       }),
       mutations:{
         SET_CURRENT_ENCODER_POSITION(state, pos){
            state.current_enc_pos = pos;
         },
         // SET_CURRENT_ANGLE(state, angle){
         //    state.current_angle = angle;
         // },
         SET_CURRENT_ANGLE_ARRAY(state, array){
            state.current_angle_array = array;
         },
         // SET_CURRENT_ANGULAR_VELOCITY(state, velocity){
         //    state.current_ang_vel = velocity;
         // },
         SET_CURRENT_ANGULAR_VELOCITY_ARRAY(state, array){
            state.current_ang_vel_array = array;
         },
         ADD_PREVIOUS_ANGULAR_VELOCITY(state, velocity){
            state.previous_ang_vels.push(velocity);
         },
         // SET_VALUES_IN_AVERAGE(state, num){
         //    state.values_in_average = num;
         // },
         // SET_AVERAGE_COUNT(state, count){
         //    state.average_count = count;
         // },
         // SET_CURRENT_TIME(state, time){
         //    state.current_time = time;
         // },
         SET_CURRENT_TIME_ARRAY(state, array){
            state.current_time_array = array;
         },
         SET_START_TIME(state, time){
            state.start_time = time;
         },
         
         SET_INPUT_MODE(state, mode){
            state.inputMode = mode;
         },
         SET_GRAPH_PARAMETER(state, parameter){
            state.graphDataParameter = parameter;
         },
         ADD_DATA(state, data){
            state.data.push(data);
         },
         DELETE_DATA (state, dataId) {
            state.data.splice(dataId, 1);
         },
         CLEAR_ALL_DATA(state){
            state.data = [];
            //state.data.length = 0; //all references to data are cleared
         },
         SET_P(state, value){
            state.p = value;
         },
         SET_I(state, value){
            state.i = value;
         },
         SET_D(state, value){
            state.d = value;
         },
         // SET_DRIVE(state, value){
         //    state.drive = value;
         // },
         SET_DRIVE_ARRAY(state, array){
            state.drive_array = array;
         },
         // SET_ERROR(state, value){
         //    state.error = value;
         // },
         SET_ERROR_ARRAY(state, array){
            state.error_array = array;
         },
         // SET_COMMAND(state, value){
         //    state.command = value;
         // },
         SET_COMMAND_ARRAY(state, array){
            state.command_array = array;
         },
         // SET_STEP(state, step){
         //    state.step = step;
         // },
         // SET_RAMP(state, ramp){
         //    state.ramp = ramp;
         // },
         // SET_PID_PARAMETERS(state, parameters){
         //    state.pid_parameters = parameters;
         // },
         SET_IS_RECORDING(state, set){
            state.isRecording = set;
         },
         
        
      //   SET_SHOW_DATA_POINT(state, options){
      //      console.log('toggling show data point');
      //       state.data[options.id].showDataPoint = options.show;
      //   },
       },
       actions:{
         setCurrentEncoderPosition(context, pos){
            context.commit("SET_CURRENT_ENCODER_POSITION", pos);
         },
         // setCurrentAngle(context, angle){
         //    context.commit("SET_CURRENT_ANGLE", angle);
         // },
         setCurrentAngleArray(context, array){
            context.commit("SET_CURRENT_ANGLE_ARRAY", array);
         },
         // setCurrentAngularVelocity(context, velocity){
         //    context.commit("SET_CURRENT_ANGULAR_VELOCITY", velocity);
         // },
         setCurrentAngularVelocityArray(context, array){
            context.commit("SET_CURRENT_ANGULAR_VELOCITY_ARRAY", array);
         },
         // addPreviousAngularVelocity(context, velocity){
         //    context.commit("ADD_PREVIOUS_ANGULAR_VELOCITY", velocity);
         // },
         // setValuesInAverage(context, num){
         //    context.commit("SET_VALUES_IN_AVERAGE", num);
         // },
         // setAverageCount(context, count){
         //    context.commit("SET_AVERAGE_COUNT", count);
         // },
         // setCurrentTime(context, time){
         //    context.commit("SET_CURRENT_TIME", time);
         // },
         setCurrentTimeArray(context, array){
            context.commit("SET_CURRENT_TIME_ARRAY", array);
         },
         setStartTime(context, time){
            context.commit("SET_START_TIME", time);
         },
         
         setInputMode(context, mode){
            context.commit("SET_INPUT_MODE", mode);
         },
         setGraphDataParameter(context, parameter){
            context.commit("SET_GRAPH_PARAMETER", parameter);
         },
         addData(context, data){
            context.commit("ADD_DATA", data);
         },
         deleteData(context, dataId){
            context.commit('DELETE_DATA', dataId);
         },
         clearAllData(context){
            context.commit('CLEAR_ALL_DATA');
         },
         setP(context, value){
            context.commit("SET_P", value);
         },
         setI(context, value){
            context.commit("SET_I", value);
         },
         setD(context, value){
            context.commit("SET_D", value);
         },
         // setDrive(context, value){
         //    context.commit("SET_DRIVE", value);
         // },
         setDriveArray(context, array){
            context.commit("SET_DRIVE_ARRAY", array);
         },
         // setError(context, value){
         //    context.commit("SET_ERROR", value);
         // },
         setErrorArray(context, array){
            context.commit("SET_ERROR_ARRAY", array);
         },
         // setCommand(context, value){
         //    context.commit("SET_COMMAND", value);
         // },
         setCommandArray(context, array){
            context.commit("SET_COMMAND_ARRAY", array);
         },
         // setStep(context, step){
         //    context.commit("SET_STEP", step);
         // },
         // setRamp(context, ramp){
         //    context.commit("SET_RAMP", ramp);
         // },
         // setPIDParameters(context, parameters){
         //    context.commit("SET_PID_PARAMETERS", parameters);
         // },
         setIsRecording(context, set){
            context.commit("SET_IS_RECORDING", set);
         },
        
      //   setShowDataPoint(context, options){
      //       context.commit('SET_SHOW_DATA_POINT', options);
      //   },

       },
       getters:{
         getCurrentEncoderPosition(state){
            return state.current_enc_pos;
         },
         getCurrentAngle(state){
            return state.current_angle_array[3];      //send the latest value received in the data array
         },
         getCurrentAngleArray(state){
            return state.current_angle_array;
         },
         getCurrentAngularVelocity(state){
            return state.current_ang_vel_array[3];
         },
         getCurrentAngularVelocityArray(state){
            return state.current_ang_vel_array;
         },
         // getPreviousAngularVelocities(state){
         //    return state.previous_ang_vels;
         // },
         // getValuesInAverage(state){
         //    return state.values_in_average;
         // },
         // getAverageCount(state){
         //    return state.average_count;
         // },
         getCurrentTime(state){
            return state.current_time_array[3];
         },
         getCurrentTimeArray(state){
            return state.current_time_array;
         },
         getStartTime(state){
            return state.start_time;
         },
         
         getInputMode(state){
            return state.inputMode;
         },
         getGraphDataParameter(state){
            return state.graphDataParameter;
         },
         getData(state){
            return state.data;
         },
         getCurrentPValue(state){
            return state.p;
         },
         getCurrentIValue(state){
            return state.i;
         },
         getCurrentDValue(state){
            return state.d;
         },
         getDrive(state){
            return state.drive_array[3];
         },
         getDriveArray(state){
            return state.drive_array;
         },
         getError(state){
            return state.error_array[3];
         },
         getErrorArray(state){
            return state.error_array;
         },
         getCommand(state){
            return state.command_array[3];
         },
         getCommandArray(state){
            return state.command_array;
         },
         // getStep(state){
         //    return state.step;
         // },
         // getRamp(state){
         //    return state.ramp;
         // },
         // getPIDParameters(state){
         //    return state.pid_parameters;
         // },
         getIsRecording(state){
            return state.isRecording;
         },
        
         getNumData(state){
            return state.data.length;
        },
        getTime(state){ 
            if(state.current_time_array[3] - state.start_time >= 0){
               return (state.current_time_array[3] - state.start_time)/1000;  //in seconds
            } else{
               state.start_time = state.current_time_array[3];
               return 0.0;
            }
         },
         getTimeArray(state){
            let times = [];
            state.current_time_array.forEach((value, index) => {
               times[index] = (value - state.start_time)/1000;
            })

            return times;
         },
         getMaxTime(state){
            let time_max = -Infinity;
            state.data.forEach(d => {
               if(d.t > time_max){
                  time_max = d.t;
               }
            });
   
            return time_max;
         },
         getMinTime(state){
            let time_min = Infinity;
            state.data.forEach(d => {
               if(d.t < time_min){
                  time_min = d.t;
               }
            });
   
            return time_min;
         },
         getMaxDataPoints(state){
            return state.max_data_points;
         },
         getMaxReached(state){
            if(state.data.length >= state.max_data_points){
               return true;
            } else {
               return false;
            }
         },
         calculateAverageVelocity(state){
            //uses a simple moving average
            let newest = state.current_ang_vel_array[3];
            let oldest = state.moving_avg_array[state.moving_avg_index];

            state.moving_avg += (newest - oldest)/state.moving_avg_k;

            state.moving_avg_array[state.moving_avg_index] = state.current_ang_vel_array[3];
            state.moving_avg_index = (state.moving_avg_index + 1) % state.moving_avg_k;

            return state.moving_avg;
          },  
       },  
  
  }

  export default dataStore;
