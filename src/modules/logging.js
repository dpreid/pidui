//Store for the logging background data.

/**Logging data:

    clicks -> list of all clicks on UI, target div, screen position, div position, time
    session_time -> start and end of session time as a Date object

**/

const loggingStore = {
    state: () => ({
        logSocket: null,
        uuid: '',
        consent_given: false,
        hardware: '',

        clicks: [],             //do I need to internally store this?
        session_time: {
            start: null,      //will be updated
            end: null,          //will be updated
            total: 0
        },
        components_opened: [],      //{name: 'graph'} //do I need to internally store this?
        parameters: [], //do I need to internally store this?

       }),
       mutations:{
            SET_LOG_SOCKET(state, socket){
                state.logSocket = socket;
            },
            SET_CONSENT(state, consent){
                state.consent_given = consent;
            },
            SET_UUID(state, uuid){
                state.uuid = uuid;
            },
            SET_HARDWARE(state, hardware){
                state.hardware = hardware;
            },
            SET_TOTAL_TIME(state, total){
                state.session_time.total = total;
            },
            LOG(state, payload){
                //only log to server if user has given consent.
                //Still may require logging internally for achievements etc.
                if(state.consent_given){
                    state.logSocket.send(JSON.stringify({
                        user: state.uuid,
                        t: Date.now(),          
                        exp: state.hardware,        
                        payload: payload
                    }));
                }
                
            },
            LOG_CLICK(state, data){
                state.clicks.push(data);
            },
            LOG_START(state, time){
                state.session_time.start = time;
            },
            LOG_END(state, time){
                let current_total = state.session_time.total;
                state.session_time.end = time;
                let delta = time - state.session_time.start;
                //console.log(delta);
                state.session_time.total = current_total + delta;
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
            setUUID(context, uuid){
                context.commit('SET_UUID', uuid);
            },
            setHardware(context, url){
                let index = url.indexOf('spin');
                let hardware = url.substr(index, 6);
                context.commit('SET_HARDWARE', hardware)
            },
            setTotalTime(context, total){
                context.commit('SET_TOTAL_TIME', total);
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
            getLogUUID(state){
                return state.uuid;
            },
            getLogHardware(state){
                return state.hardware;
            },
            getLogTotalTime(state){
                return state.session_time.total;
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
            getLogComponents(state){
                return state.components_opened;
            },
            getLogParameters(state){
                return state.parameters;
            }
          
         
       },  
  
  }

  export default loggingStore;
