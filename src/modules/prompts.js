//Store for the prompts specific to this remote lab.
//Prompts must have unique names

const promptsStore = {
    state: () => ({
        survey_consent_given: false,
        prompts: [
            {name:'rate_experience', verbose:'', mainText:'', hidden: true, response: '', completed: false, type: 'likert', count: 0}, 
            {name:'rate_ui', verbose:'', mainText:'', hidden: true, response: '', completed: false, type: 'likert', count: 0},
            {name:'rate_box', verbose:'', mainText:'', hidden: true, response: '', completed: false, type: 'likert', count: 0},
            {name:'comment_improvements', verbose:'', mainText:'', hidden: true, response: '', completed: false, type: 'text', count: 0}, 
            {name:'useful_component', verbose:'', mainText:'', hidden: true, response: '', completed: false, type: 'text', count: 0},
            {name:'control_experiment', verbose:'', mainText:'', hidden: true, response: '', completed: false, type: 'likert', count: 0},
            {name:'control_hardware', verbose:'', mainText:'', hidden: true, response: '', completed: false, type: 'likert', count: 0},
            {name:'achievements_attempted', verbose:'', mainText:'', hidden: true, response: '', completed: false, type: 'text', count: 0},
            {name:'explore_components', verbose:'', mainText:'', hidden: true, response: '', completed: false, type: 'text', count: 0}, 
            {name:'download_data', verbose:'', mainText:'', hidden: true, response: '', completed: false, type: 'text', count: 0},
            {name:'move_components', verbose:'', mainText:'', hidden: true, response: '', completed: false, type: 'text', count: 0},
            {name:'graph_functions', verbose:'', mainText:'', hidden: true, response: '', completed: false, type: 'text', count: 0},
        ],
        new_prompt_update: false,
        new_prompt_count: 0,

       }),
       mutations:{
        LOAD_PROMPTS(state, prompts_to_load){
            let updated_prompts = [];
            state.prompts.forEach(prompt => {
                let update_prompt = prompts_to_load.find(pro => pro.name == prompt.name);
                if(update_prompt != undefined){
                    updated_prompts.push(update_prompt);
                } else{
                    updated_prompts.push(prompt);
                }
            })

            state.prompts = updated_prompts;
        },
         SET_PROMPT_RESPONSE(state, payload){
            state.prompts.forEach(item => {
                if(item.name == payload.name){
                    item.response = payload.response;
                    item.completed = true;
                    item.count += 1;
                }
            });
         },
         SHOW_PROMPT(state, name){
            state.prompts.forEach(item => {
                if(item.name == name){
                    item.hidden = false;
                }
            });
         },
         SET_PROMPT_UPDATE(state, set){
            if(set){
              state.new_prompt_count += 1;
            } else{
                state.new_prompt_count = 0;
            }
            
            state.new_prompt_update = set;
         },
         SET_SURVEY_CONSENT(state, set){
             state.survey_consent_given = set;
         }
         

       },
       actions:{
        loadPrompts(context, prompts){
            context.commit('LOAD_PROMPTS', prompts);
        },
        setPromptResponse(context, payload){
             if(context.getters.getPromptsUncompleted.includes(payload.name)){
                context.commit('SET_PROMPT_RESPONSE', payload);

                context.dispatch('logPrompts', context.state.prompts, {root: true});
             }
         },
         showPrompt(context, name){
             if(context.state.survey_consent_given){
                context.commit('SHOW_PROMPT', name);
                context.commit('SET_PROMPT_UPDATE', true);
             }
            
         },
         setPromptUpdate(context, set){
             context.commit('SET_PROMPT_UPDATE', set);
         },
         setSurveyConsent(context, set){
             context.commit('SET_SURVEY_CONSENT', set);
         }

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
         },
         getSurveyConsent(state){
             return state.survey_consent_given;
         },
         getPromptByName: (state) => (name) => {
            return state.prompts.find(prompt => prompt.name == name);
         },
         getNewPromptCount(state){
          return state.new_prompt_count;
      },
          
         
       },  
  
  }

  export default promptsStore;
