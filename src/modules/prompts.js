//Store for the prompts specific to this remote lab.
//Prompts must have unique names

const promptsStore = {
    state: () => ({
        prompts: [
            {name:'enjoy-likert', response: '', hidden: false, completed: false, type: 'likert', verbose:'How are you enjoying the web app?', mainText: 'Please rate your enjoyment so far of the remote lab web app?', minScale:'Not at all', maxScale: 'Love it!'}, 
            {name:'inertia-calc', response: '', hidden: false, completed: false, type: 'calc', verbose:'Inertia calculation', mainText: 'Calculate the inertia of your disk?'}, 
            {name:'improve-text', response: '', hidden: false, completed: false, type: 'text', verbose:'Give us your feedback', mainText: 'Please tell us about any issues you had with the remote lab?'},
            {name:'overshoot-calc', response: '', hidden: false, completed: false, type: 'calc', verbose:'Overshoot calculation', mainText: 'What is the percentage overshoot when you use Kp = 1 and a 3 rad step in position mode?'},
            
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
         getAvailablePrompts(state){
             let a_p = [];
            state.prompts.forEach(prompt => {
                if(!prompt.hidden && !prompt.completed){
                    a_p.push(prompt);
                }
            })

            return a_p;
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
