//Store for the logging background data.

/**Logging data:

    clicks -> list of all clicks on UI, target div, screen position, div position, time
    session_time -> start and end of session time as a Date object

**/

const loggingStore = {
    state: () => ({
        logSocket: null,
        uuid: '',
        logging_consent_given: false,
        //hardware: '',

        //clicks: [],             //do I need to internally store this?
        session_time: {
            start: Date.now(),      //will be updated
            end: Date.now(),
            previous: Date.now(),
            total: 0
        },
        //components_opened: [],      //{name: 'graph'} //do I need to internally store this?
        parameters: [], //do I need to internally store this?

       }),
       mutations:{
            SET_LOG_SOCKET(state, socket){
                state.logSocket = socket;
            },
            SET_LOGGING_CONSENT(state, consent){
                state.logging_consent_given = consent;
            },
            SET_UUID(state, uuid){
                state.uuid = uuid;
            },
            // SET_HARDWARE(state, hardware){
            //     state.hardware = hardware;
            // },
            SET_TOTAL_TIME(state, total){
                state.session_time.total = total;
            },
            LOG(state, payload){
                //only log to server if user has given consent.
                //Still may require logging internally for achievements etc.
                if(state.logging_consent_given && state.logSocket != null){
                    state.logSocket.send(JSON.stringify({
                        user: state.uuid,
                        t: Date.now(),          
                        //exp: state.hardware,        
                        payload: payload
                    }));
                }
                
            },
            LOG_SURVEY(state, payload){
                //can only be called if survey_consent has already been given
                if(state.logSocket != null){
                    state.logSocket.send(JSON.stringify({
                        user: state.uuid,
                        t: Date.now(),          
                        //exp: state.hardware,        
                        payload: payload
                    }));
                }
            },
            // LOG_CLICK(state, data){
            //     state.clicks.push(data);
            // },
            LOG_START(state, time){
                state.session_time.start = time;
            },
            LOG_END(state, time){
                state.session_time.end = time;
            },
            UPDATE_SESSION_TIME(state, now){
                let current_total = state.session_time.total;
                let delta = now - state.session_time.previous;
                state.session_time.total = current_total + delta;

                state.session_time.previous = now;
            },
            // LOG_COMPONENT(state, component){
            //     state.components_opened.push(component);
            // },
            // LOG_PARAMETERS(state, parameters){
            //     state.parameters.push(parameters);
            // },
            CLEAR_LOGGED_TIME(state){
                state.session_time.start = Date.now();
                state.session_time.end = 0;
                state.session_time.total = 0;
            }
         

       },
       actions:{
            setLogSocket(context, socket){
                context.commit('SET_LOG_SOCKET', socket);
            },
            setLoggingConsent(context, consent){
                context.commit('SET_LOGGING_CONSENT', consent);
            },
            setUUID(context, uuid){
                context.commit('SET_UUID', uuid);
            },
            // setHardware(context, url){
            //     let index = url.indexOf('spin');
            //     let hardware = url.substr(index, 6);
            //     context.commit('SET_HARDWARE', hardware)
            // },
            setTotalTime(context, total){
                context.commit('SET_TOTAL_TIME', total);
            },
            logClick(context, payload){
                //context.commit('LOG_CLICK', payload.data);
                context.commit('LOG', payload);

                //session time should only increase if still connected to the hardware
                if(!context.getters.getSessionExpired){
                    context.commit('UPDATE_SESSION_TIME', Date.now());
                }
                
            },
            logStart(context, payload){
                context.commit('LOG_START', payload.data);
                context.commit('LOG', payload);
            },
            logEnd(context, payload){
                context.commit('LOG_END', payload.data);
                context.commit('UPDATE_SESSION_TIME', payload.data);
                context.commit('LOG', payload);
            },
            logComponent(context, payload){
                //context.commit('LOG_COMPONENT', payload.data);
                context.commit('LOG', payload);
            },
            logParameters(context, payload){
                //context.commit('LOG_PARAMETERS', payload.data);
                context.commit('LOG', payload);
            },
            logAchievements(context, achievements){
                context.commit('LOG', {log:'achievements', data: achievements});
            },
            logPrompts(context, prompts){
                context.commit('LOG_SURVEY', {log:'survey', data: prompts});
            },
            clearLoggedTime(context){
                context.commit('CLEAR_LOGGED_TIME');
            }


       },
       getters:{
           getLogSocket(state){
                return state.logSocket;
           },
           getLogConsent(state){
            return state.logging_consent_given;
            },
            getLogUUID(state){
                return state.uuid;
            },
            // getLogHardware(state){
            //     return state.hardware;
            // },
            getLogTotalTime(state){
                return state.session_time.total;
            },
            // getLogClicks(state){
            //     return state.clicks;
            // },
            getLogStart(state){
                return state.session_time.start;
            },
            getLogEnd(state){
                return state.session_time.end;
            },
            // getLogComponents(state){
            //     return state.components_opened;
            // },
            // getLogParameters(state){
            //     return state.parameters;
            // }
          
         
       },  
  
  }

  export default loggingStore;
