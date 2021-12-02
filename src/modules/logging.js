//Store for the logging background data.

/**Logging data:

    clicks -> list of all clicks on UI, target div, screen position, div position, time
    session_time -> start and end of session time as a Date object

**/

const loggingStore = {
    state: () => ({
        clicks: [],
        session_time: {
            start: Date.now(),
            end: Date.now()
        },


       }),
       mutations:{
        SET_LOGGING_CLICK(state, data){
            state.clicks.push(data);
        },
        SET_LOGGING_START(state){
            state.session_time.start = Date.now();
        },
        SET_LOGGING_END(state){
            state.session_time.end = Date.now();
        }
         

       },
       actions:{
        setLoggingClick(context, data){
            context.commit('SET_LOGGING_CLICK', data);
        },
        setLoggingStart(context){
            context.commit('SET_LOGGING_START');
        },
        setLoggingEnd(context){
            context.commit('SET_LOGGING_END');
        }


       },
       getters:{
         getLoggingClicks(state){
             return state.clicks;
         },
         getLoggingStart(state){
             return state.session_time.start;
         },
         getLoggingEnd(state){
             return state.session_time.end;
         },
          
         
       },  
  
  }

  export default loggingStore;
