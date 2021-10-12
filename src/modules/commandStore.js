//Store for sending commands through the dataSocket


const commandStore = {
    state: () => ({
        dataSocket: null,
        currentMode: '',

       }),
       mutations:{
        SET_DATA_SOCKET(state, socket){
            state.dataSocket = socket;
        },
        STOP(state){
            state.currentMode = 'stopped';
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
            state.currentMode = 'speedRaw';
            state.dataSocket.send(JSON.stringify({
                set: "mode",
                to: "motor"
            }));
        },
        SPEED_PID(state){
            state.currentMode = 'speedPid';
            state.dataSocket.send(JSON.stringify({
				set: "mode",
				to: "velocity"
			}));
        },
        POSITION_PID(state){
            state.currentMode = 'positionPid';
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
        SET_VOLTAGE_RAMP(state, value){
            state.dataSocket.send(JSON.stringify({
				set: "volts_ramp",
				to: value
			}));
        },
        SET_SPEED(state, value){
            state.dataSocket.send(JSON.stringify({
                set: "velocity",
                to: value
            }));
        },
        SET_SPEED_RAMP(state, value){
            state.dataSocket.send(JSON.stringify({
                set: "velocity_ramp",
                to: value
            }));
        },
        SET_POSITION(state, value){
            state.dataSocket.send(JSON.stringify({
                set: "position",
                to: value
            }));
        },
        SET_POSITION_RAMP(state, value){
            state.dataSocket.send(JSON.stringify({
                set: "position_ramp",
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
        },
        SET_CURRENT_MODE(state, mode){
            state.currentMode = mode;
         },
            

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
        setVoltageRamp(context, value){
            context.commit('SET_VOLTAGE_RAMP', value);
        },
        setSpeed(context, value){
            context.commit('SET_SPEED', value);
        },
        setSpeedRamp(context, value){
            context.commit('SET_SPEED_RAMP', value);
        },
        setPosition(context, value){
            context.commit('SET_POSITION', value);
        },
        setPositionRamp(context, value){
            context.commit('SET_POSITION_RAMP', value);
        },
        setPidParameters(context, params){
            context.commit('SET_PID_PARAMETERS', params);
        },
        setCurrentMode(context, mode){
            context.commit("SET_CURRENT_MODE", mode);
        },
       },
       getters:{
        getDataSocket(state){
            return state.dataSocket;
        },
        getCurrentMode(state){
            return state.currentMode;
        },
        getModeName(state){
            if(state.currentMode == 'positionPid'){
                return 'position (PID)';
            } else if (state.currentMode == 'speedPid'){
                return 'velocity (PID)';
            } else if(state.currentMode == 'speedRaw'){
                return 'voltage (open loop)';
            } else {
                return state.currentMode;
            }
        },
          
       },  
  
  }

  export default commandStore;