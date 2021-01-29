import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
   state: {
        streams: [],
        streamsObtained: false,
        videoURL: "",
        videoURLObtained: false,
        dataURL: "",
        dataURLObtained: false,
        remoteLabVersion: '',
        isDataRecorderOn: false,
        disableTooltips: false,
        expiryTime: '',
      },
      mutations:{
        DELETE_STREAMS(state) {
            state.streams = {};
            state.streamsObtained = false;
          },
          SET_STREAMS(state, streams){
            state.streams = streams;
            state.streamsObtained = true;
          },
          SET_VIDEO_URL(state, url){
            state.videoURL = url;
            state.videoURLObtained = true;
          },
          DELETE_VIDEO_URL(state){
            state.videoURL = "";
            state.videoURLObtained = false;
          },
          SET_DATA_URL(state, url){
            state.dataURL = url;
            state.dataURLObtained = true;
          },
          DELETE_DATA_URL(state){
            state.dataURL = "";
            state.dataURLObtained = false;
          },
          SET_REMOTE_LAB_VERSION(state, version){
              state.remoteLabVersion = version;
          },
          SET_DATA_RECORDER(state, set){
              state.isDataRecorderOn = set;
          },
          SET_DISABLE_TOOLTIPS(state, set){
            state.disableTooltips = set;
          },
          SET_EXPIRY_TIME(state, time){
            state.expiryTime = time;
          }
      },
      actions:{
           deleteStreams(context){
               context.commit("DELETE_STREAMS");
           },
           setStreams(context, streams){
               context.commit("SET_STREAMS", streams);
           },
           setVideoURL(context,url){
               context.commit("SET_VIDEO_URL", url);
           },
           deleteVideoURL(context){
               context.commit("DELETE_VIDEO_URL");
           },
           setDataURL(context, url){
               context.commit("SET_DATA_URL", url);
           },
           deleteDataURL(context){
               context.commit("DELETE_DATA_URL");
           },
           setRemoteLabVersion(context, version){
               context.commit("SET_REMOTE_LAB_VERSION", version);
            },
           setDataRecorder(context, set){
            context.commit("SET_DATA_RECORDER", set);
        },
            setDisableTooltips(context, set){
                context.commit("SET_DISABLE_TOOLTIPS", set);
            },
            setExpiryTime(context, time){
                context.commit("SET_EXPIRY_TIME", time);
            },
           
        },
      getters:{
        getStreamsObtained(state){
            return state.streamsObtained;
        },
        getStreams(state) {
            return state.streams;
        },
        getStream: (state) => (what) => {
            if(state.streams != null){
                if(!state.streamsObtained){
                    return {};
                }
                var results = state.streams.filter((obj) => {
                    return obj.for == what;
                });
                if(results.length < 1){
                    return {};
                } else {
                    return results[0];
                }
            } else{
                return {};
            }
        },
        getVideoURL(state){
            return state.videoURL;
        },
        getVideoURLObtained(state){
            return state.videoURLObtained;
        },
        getDataURL(state){
            return state.dataURL;
        },
        getDataURLObtained(state){
            return state.dataURLObtained;
        },
        getRemoteLabVersion(state){
            return state.remoteLabVersion;
        },
        getIsDataRecorderOn(state){
            return state.isDataRecorderOn;
        },
        getDisableTooltips(state){
            return state.disableTooltips;
        },
        getExpiryTime(state){
            return state.expiryTime;
        }
        
        
 
      },
 })

 export default store;
