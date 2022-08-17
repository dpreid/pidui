//Store for variables that are common amongst multiple UI components. 


const uiStore = {
    state: () => ({

       remoteLabVersion: '',
       isDataRecorderOn: false,    //is the Data Recorder element active
       isDraggable: true,
       
       isChatBotAvailable: false,    //by default the chatbot is NOT BEING USED
       isAchievementsAvailable: false,
       isPromptsAvailable: false,
       usesLocalStorage: false,        //can only use localStorage if the browser allows it.

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
         
         SET_CHATBOT_AVAILABLE(state, set){
            state.isChatBotAvailable = set;
         },
         SET_USES_LOCAL_STORAGE(state, set){
            state.usesLocalStorage = set;
         },
         SET_PROMPTS_AVAILABLE(state, set){
            state.isPromptsAvailable = set;
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
         
         setChatBotAvailable(context, set){
            context.commit('SET_CHATBOT_AVAILABLE', set);
         },
         setUsesLocalStorage(context, set){
            context.commit('SET_USES_LOCAL_STORAGE', set);
         },
         setPromptsAvailable(context, set){
            context.commit('SET_PROMPTS_AVAILABLE', set);
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
         
         getIsChatbotAvailable(state){
            return state.isChatBotAvailable;
         },
         getIsAchievementsAvailable(state){
            return state.isAchievementsAvailable;
         },
         getUsesLocalStorage(state){
            return state.usesLocalStorage;
         },
         getIsPromptsAvailable(state){
            return state.isPromptsAvailable;
         }
         
          
         
       },  
  
  }

  export default uiStore;
