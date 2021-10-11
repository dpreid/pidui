//Store for sending commands through the dataSocket


const commandStore = {
    state: () => ({
        dataSocket: null,
        
       }),
       mutations:{
        SET_DATA_SOCKET(state, socket){
            state.dataSocket = socket;
        },
        STOP(state){
            state.dataSocket.send(JSON.stringify({
                set: "mode",
                to: "stop"
            }));
        },
        WAIT(state){
            state.dataSocket.send(JSON.stringify({
				set: "mode",
				to: "wait"
			}));
        },
        SPEED_RAW(state){
            state.dataSocket.send(JSON.stringify({
                set: "mode",
                to: "motor"
            }));
        },
        SPEED_PID(state){
            state.dataSocket.send(JSON.stringify({
				set: "mode",
				to: "velocity"
			}));
        },
        POSITION_PID(state){
            state.dataSocket.send(JSON.stringify({
				set: "mode",
				to: "position"
			}));
        },
        SET_VOLTAGE(state, value){
            state.dataSocket.send(JSON.stringify({
				set: "volts",
				to: value
			}));
        },
        SET_SPEED(state, value){
            state.dataSocket.send(JSON.stringify({
                set: "velocity",
                to: value
            }));
        },
        SET_POSITION(state, value){
            state.dataSocket.send(JSON.stringify({
                set: "position",
                to: value
            }));
        },
        SET_PID_PARAMETERS(state, params){
            state.dataSocket.send(JSON.stringify({
                "set": "parameters",
                "kp": params.kp,
                "ki": params.ki,
                "kd": params.kd
        }));
        }
            

       },
       actions:{
        setDataSocket(context, socket){
            context.commit("SET_DATA_SOCKET", socket);
        },
        stop(context){
            context.commit('STOP');
        },
        wait(context){
            context.commit('WAIT');
        },
        speedRaw(context){
            context.commit('SPEED_RAW');
        },
        speedPid(context){
            context.commit('SPEED_PID');
        },
        positionPid(context){
            context.commit('POSITION_PID');
        },
        setVoltage(context, value){
            context.commit('SET_VOLTAGE', value);
        },
        setSpeed(context, value){
            context.commit('SET_SPEED', value);
        },
        setPosition(context, value){
            context.commit('SET_POSITION', value);
        },
        setPidParameters(context, params){
            context.commit('SET_PID_PARAMETERS', params);
        }

        
       },
       getters:{
        getDataSocket(state){
            return state.dataSocket;
          },
          
       },  
  
  }

  export default commandStore;