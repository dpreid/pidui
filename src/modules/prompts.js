//Store for the prompts specific to this remote lab.
//Prompts must have unique names

const promptsStore = {
    state: () => ({
        survey_consent_given: false,
        prompts: [
            {name:'rate_experience', verbose:'Please rate your experience of the remote lab so far.', mainText:'Select the appropriate point for your overall impression of the remote lab so far.', minScale:'Hate it.', maxScale:'Love it.', hidden: true, response: '', completed: false, type: 'likert', count: 0}, 
            {name:'rate_ui', verbose:'Please rate your experience of the USER INTERFACE so far.', mainText:'Rate your agreement with the statement: it is easy to navigate the user interface', minScale:'Strongly disagree', maxScale:'Strongly agree', hidden: true, response: '', completed: false, type: 'likert', count: 0},
            {name:'comment_improvements', verbose:'How could we improve the remote lab?', mainText:'Please provide comments on how we could improve the remote lab.', hidden: true, response: '', completed: false, type: 'text', count: 0}, 
            {name:'useful_component', verbose:'Which component has been the most useful?', mainText:'Name the component or components that you have found most useful.', hidden: true, response: '', completed: false, type: 'text', count: 0},
            {name:'control_experiment', verbose:'How in control of your practical do you feel?', mainText:'Rate your agreement with the statement: the UI allows me to control how I perform the practical work.', minScale:'Strongly disagree', maxScale:'Strongly agree', hidden: true, response: '', completed: false, type: 'likert', count: 0},
            {name:'control_hardware', verbose:'How in control of the hardware do you feel?', mainText:'Rate your agreement with the statement: I am in control of the physical hardware', minScale:'Strongly disagree', maxScale:'Strongly agree', hidden: true, response: '', completed: false, type: 'likert', count: 0},
            {name:'achievements_attempted', verbose:'What do you think about the achievements?', mainText:'Rate your agreement with the statement: the achievements have helped encourage me to explore the remote lab', minScale:'Strongly disagree', maxScale:'Strongly agree', hidden: true, response: '', completed: false, type: 'likert', count: 0},
            {name:'explore_components', verbose:'Data analysis', mainText:'Which component is best for analysing data?', options:['graph', 'snapshot', 'table', 'download'], hidden: true, response: '', completed: false, type: 'select', count: 0}, 
            {name:'download_data', verbose:'Have you downloaded your data', mainText:'Remember to download your results for offline analysis', hidden: true, response: '', completed: false, type: 'prompt', count: 0},
            {name:'move_components', verbose:'Custom UI', mainText:'Rate your agreement with the statement: I am happy with the level of customisation possible on the UI ', minScale:'Strongly disagree', maxScale:'Strongly agree', hidden: true, response: '', completed: false, type: 'likert', count: 0},
            {name:'graph_functions', verbose:'Graph functions', mainText:'Remember that there are plotting functions on the graph tool for analysing your data', hidden: true, response: '', completed: false, type: 'prompt', count: 0},
            {name:'session_time_90', verbose:'Session time', mainText:'Your total session time is now longer than 90 minutes.', hidden: true, response: '', completed: false, type: 'prompt', count: 0},
            {name:'session_time_180', verbose:'Session time', mainText:'Your total session time is now longer than 180 minutes', hidden: true, response: '', completed: false, type: 'prompt', count: 0},
            {name:'ueq_dependability', verbose:'Dependability rating', mainText:'Please rate your experience on the following scales:', minScale:['unpredictable', 'obstructive', 'not secure', 'does not meet expectations'], maxScale:['predictable', 'supportive', 'secure', 'meets expectations'], hidden: true, response: [], completed: false, type: 'likert_multiple', count: 0},
        ],
        new_prompt_update: false,
        new_prompt_count: 0,
        prompts_loaded: false,

       }),
       mutations:{
        LOAD_PROMPTS(state, prompts_to_load){
            let updated_prompts = [];
            state.prompts.forEach(prompt => {
                let update_prompt = prompts_to_load.find(pro => pro.name == prompt.name);
                if(update_prompt != undefined){
                    update_prompt.hidden = true;
                    updated_prompts.push(update_prompt);
                } else{
                    updated_prompts.push(prompt);
                }
            })
            console.log('loading prompts');
            state.prompts = updated_prompts;
            state.prompts_loaded = true;
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
                    console.log(item);
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
         },
         CLEAR_COMPLETED_PROMPTS(state){
            state.prompts.forEach(prompt => {
                prompt.completed = false;
                prompt.response = '';
                prompt.count = 0;
            })
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
         },
         clearCompletedPrompts(context){
             context.commit('CLEAR_COMPLETED_PROMPTS');
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
                    console.log(prompt.name);
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
        getPromptsLoaded(state){
            return state.prompts_loaded;
        }
          
         
       },  
  
  }

  export default promptsStore;
