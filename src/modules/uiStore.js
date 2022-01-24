//Store for variables that are common amongst multiple UI components. 


const uiStore = {
    state: () => ({

       remoteLabVersion: '',
       isDataRecorderOn: false,    //is the Data Recorder element active
       isDraggable: true,
       consent_given: false,
       isChatBotAvailable: true,    //by default the chatbot is being used
       //show_force: true,       //should force values be displayed on the UI
       //show_theory: false,      //should the theoretical values component be available on the UI

       }),
       mutations:{
         SET_REMOTE_LAB_VERSION(state, version){
            state.remoteLabVersion = version;
         },
         SET_DATA_RECORDER(state, set){
            state.isDataRecorderOn = set;
         },
         SET_DRAGGABLE(state, draggable){
            state.isDraggable = draggable;
         },
         SET_CONSENT(state, consent){
            state.consent_given = consent;
         },
         SET_CHATBOT_AVAILABLE(state, set){
            state.isChatBotAvailable = set;
         }
         

       },
       actions:{
         setRemoteLabVersion(context, version){
            context.commit("SET_REMOTE_LAB_VERSION", version);
         },
         setDataRecorder(context, set){
            context.commit("SET_DATA_RECORDER", set);
         },
         setDraggable(context, draggable){
             context.commit('SET_DRAGGABLE', draggable);
         },
         setConsent(context, consent){
            context.commit('SET_CONSENT', consent);
         },
         setChatBotAvailable(context, set){
            context.commit('SET_CHATBOT_AVAILABLE', set);
         }


       },
       getters:{
         getRemoteLabVersion(state){
            return state.remoteLabVersion;
         },
         getIsDataRecorderOn(state){
            return state.isDataRecorderOn;
         },
         getDraggable(state){
             return state.isDraggable;
         },
         getConsent(state){
            return state.consent_given;
         },
         getIsChatbotAvailable(state){
            return state.isChatBotAvailable;
         }
         // getShowForce(state){
         //    return state.show_force;
         // },
         // getShowTheory(state){
         //    return state.show_theory;
         // }
          
         
       },  
  
  }

  export default uiStore;
