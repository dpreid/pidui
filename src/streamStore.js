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
           }
           
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
        }
        
 
      },
 })

 export default store;
