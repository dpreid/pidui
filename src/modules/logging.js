//Store for the logging background data.

/**Logging data:

    clicks -> list of all clicks on UI, target div, screen position, div position, time
    session_time -> start and end of session time as a Date object

**/

const loggingStore = {
    state: () => ({
        logSocket: null,
        clicks: [],
        session_time: {
            start: Date.now(),
            end: Date.now()
        },
        browser: '',


       }),
       mutations:{
            SET_LOG_SOCKET(state, socket){
                state.logSocket = socket;
            },
            LOG_CLICK(state, data){
                state.clicks.push(data);
                console.log('pushing click log');
                state.logSocket.send(JSON.stringify({
                    log: "click",
                    data: data
                }));
            },
            LOG_START(state){
                state.session_time.start = Date.now();
            },
            LOG_END(state){
                state.session_time.end = Date.now();
            },
            LOG_BROWSER(state, browser){
                state.browser = browser;
            }
         

       },
       actions:{
           setLogSocket(context, socket){
                context.commit('SET_LOG_SOCKET', socket);
           },
            logClick(context, data){
                context.commit('LOG_CLICK', data);
            },
            logStart(context){
                context.commit('LOG_START');
            },
            logEnd(context){
                context.commit('LOG_END');
            },
            logBrowser(context, browser){
                context.commit('LOG_BROWSER', browser);
            }


       },
       getters:{
           getLogSocket(state){
                return state.logSocket;
           },
            getLogClicks(state){
                return state.clicks;
            },
            getLogStart(state){
                return state.session_time.start;
            },
            getLogEnd(state){
                return state.session_time.end;
            },
          
         
       },  
  
  }

  export default loggingStore;
