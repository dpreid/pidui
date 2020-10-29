import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
   state: {
       current_angle: 0,
       current_time: 0,
       start_time: 0,
       data: [],
      },
      mutations:{
        ADD_DATA(state, object){
           state.data.push(object);
        },
        CLEAR_ALL_DATA(state){
           state.data = [];
          },
        DELETE_DATA(state,dataId) {
           state.data.splice(dataId, 1);
         },
         SET_START_TIME(state, time){
           state.start_time = time;
         },
         SET_CURRENT_ANGLE(state, angle){
           state.current_angle = angle;
         },
         SET_CURRENT_TIME(state, time){
           state.current_time = time;
         },
         UPDATE_ANG_VEL(state, index, value){
            state.data[index].omega = value;
         },
      },
      actions:{
           addData(context, data){
              context.commit('ADD_DATA', data);
           },
           clearAllData(context){
              context.commit('CLEAR_ALL_DATA');
           },
           deleteData(context, dataID){
              context.commit('DELETE_DATA', dataID);
           },
           setStartTime(context, time){
              console.log('start time set');
              context.commit('SET_START_TIME', time);
           },
           setCurrentAngle(context, angle){
              console.log('setting angle data');
              context.commit('SET_CURRENT_ANGLE', angle);
           },
           setCurrentTime(context, time){
              context.commit('SET_CURRENT_TIME', time);
           },
           updateAngularVelocity(context, index, value){
              context.commit('UPDATE_ANG_VEL', index, value);
           }
        },
      getters:{
         getData(state){
           return state.data;
         },
        calculateAngularVelocity(state){
           let current_index = state.data.length - 1;
           let current_data = state.data[current_index];
           let previous_data = state.data[current_index - 1];
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
        getNumData(state){
           return state.data.length;
        },
        getTime(state){
           console.log("start time = " + state.start_time);
           return (state.current_time - state.start_time)/1000;    //in seconds
        },
        getCurrentAngle(state){
           return state.current_angle;
        },
        getCurrentTime(state){
           return state.current_time;
        },
 
      }
 })
