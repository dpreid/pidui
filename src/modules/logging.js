//Store for the logging background data.

/**Logging data:

    clicks -> list of all clicks on UI, target div, screen position, div position, time
    session_time -> start and end of session time as a Date object

**/

const loggingStore = {
    state: () => ({
        logSocket: null,
        username: '',
        consent_given: false,
        hardware: '',

        clicks: [],
        session_time: {
            start: null,      //will be updated
            end: null          //will be updated
        },
        browser: '',
        components_opened: [],      //{t: time, name: 'graph'}
        parameters: [],

       }),
       mutations:{
            SET_LOG_SOCKET(state, socket){
                state.logSocket = socket;
            },
            SET_CONSENT(state, consent){
                state.consent_given = consent;
            },
            SET_USERNAME(state, username){
                state.username = username;
            },
            SET_HARDWARE(state, hardware){
                state.hardware = hardware;
            },
            LOG(state, payload){
                state.logSocket.send(JSON.stringify({
                    user: state.username,
                    t: Date.now(),          
                    exp: state.hardware,        
                    payload: payload
                }));
            },
            LOG_CLICK(state, data){
                state.clicks.push(data);
            },
            LOG_START(state, time){
                state.session_time.start = time;
            },
            LOG_END(state, time){
                state.session_time.end = time;
            },
            LOG_BROWSER(state, browser){
                state.browser = browser;
            },
            LOG_COMPONENT(state, component){
                state.components_opened.push(component);
            },
            LOG_PARAMETERS(state, parameters){
                state.parameters.push(parameters);
            }
         

       },
       actions:{
            setLogSocket(context, socket){
                context.commit('SET_LOG_SOCKET', socket);
            },
            setConsent(context, consent){
                context.commit('SET_CONSENT', consent);
            },
            setUsername(context, username){
                context.commit('SET_USERNAME', username);
            },
            setHardware(context, hardware){
                context.commit('SET_HARDWARE', hardware)
            },
            logClick(context, payload){
                context.commit('LOG_CLICK', payload.data);
                context.commit('LOG', payload);
            },
            logStart(context, payload){
                context.commit('LOG_START', payload.data);
                context.commit('LOG', payload);
            },
            logEnd(context, payload){
                context.commit('LOG_END', payload.data);
                context.commit('LOG', payload);
            },
            logBrowser(context, payload){
                context.commit('LOG_BROWSER', payload.data);
                context.commit('LOG', payload);
            },
            logComponent(context, payload){
                context.commit('LOG_COMPONENT', payload.data);
                context.commit('LOG', payload);
            },
            logParameters(context, payload){
                context.commit('LOG_PARAMETERS', payload.data);
                context.commit('LOG', payload);
            },
            logAchievements(context, achievements){
                context.commit('LOG', {log:'achievements', data: achievements});
            },
            logPrompts(context, prompts){
                context.commit('LOG', {log:'prompts', data: prompts});
            }


       },
       getters:{
           getLogSocket(state){
                return state.logSocket;
           },
           getLogConsent(state){
            return state.consent_given;
            },
            getLogUsername(state){
                return state.username;
            },
            getLogHardware(state){
                return state.hardware;
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
            getLogBrowser(state){
                return state.browser;
            },
            getLogComponents(state){
                return state.components_opened;
            },
            getLogParameters(state){
                return state.parameters;
            }
          
         
       },  
  
  }

  export default loggingStore;
