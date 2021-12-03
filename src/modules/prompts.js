//Store for the prompts specific to this remote lab.


const promptsStore = {
    state: () => ({
        prompts: [
            {name:'enjoy-likert', response: '', hidden: false, completed: false, type: 'likert', verbose:'How are you enjoying the web app?', mainText: 'Please rate your enjoyment so far of the remote lab web app?', minScale:'Not at all', maxScale: 'Love it!'}, 
            {name:'inertia-input', response: '', hidden: true, completed: false, type: 'text-input', verbose:'Inertia calculation', mainText: 'Calculate the inertia of your disk?'}, 
                    
                ],
        new_prompt_update: false,

       }),
       mutations:{
        LOAD_PROMPTS(state, prompts){
            state.prompts = prompts;
        },
         SET_PROMPT_COMPLETED(state, name){
            state.prompts.forEach(item => {
                if(item.name == name){
                    item.completed = true;
                }
            });
         },
         SET_PROMPT_UPDATE(state, set){
             state.new_prompt_update = set;
         }
         

       },
       actions:{
        loadPrompts(context, prompts){
            context.commit('LOAD_PROMPTS', prompts);
        },
        setPromptCompleted(context, name){
             if(context.getters.getPromptsUncompleted.includes(name)){
                context.commit('SET_PROMPT_COMPLETED', name);
                context.commit('SET_PROMPT_UPDATE', true);
             }
         },
         setPromptUpdate(context, set){
             context.commit('SET_PROMPT_UPDATE', set);
         },

       },
       getters:{
         getPrompts(state){
            return state.prompts;
         },
         getPromptCompleted(state){
             let completed = [];
            state.prompts.forEach(item => {
                if(item.completed){
                    completed.push(item.name);
                }
            });
            return completed;
         },
         getPromptsUncompleted(state){
            let uncompleted = [];
            state.prompts.forEach(item => {
                if(!item.completed){
                    uncompleted.push(item.name);
                }
            });
            return uncompleted;
         },
         getPromptUpdated(state){
             return state.new_prompt_update;
         }
          
         
       },  
  
  }

  export default promptsStore;
