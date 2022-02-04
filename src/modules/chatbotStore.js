//Store for the prompts specific to this remote lab.
//Prompts must have unique names

import axios from 'axios';

const promptsStore = {
    state: () => ({
        url: 'https://rasa-box.co.uk',
        message_list: [], //{sender: 'you', time: '15:30', text: 'hello', buttons: [{title:'0'}, {title:'1'}]}
        previous_intent: '',
        prompts: [
            {name:'PROMPT_rate_experience', response: '', completed: false, type: 'likert', count: 0}, 
            {name:'PROMPT_rate_ui', response: '', completed: false, type: 'likert', count: 0},
            {name:'PROMPT_rate_box', response: '', completed: false, type: 'likert', count: 0},
            {name:'PROMPT_comment_improvements', response: '', completed: false, type: 'text', count: 0}, 
            {name:'PROMPT_useful_component', response: '', completed: false, type: 'text', count: 0},
            {name:'PROMPT_control_experiment', response: '', completed: false, type: 'likert', count: 0},
            {name:'PROMPT_control_hardware', response: '', completed: false, type: 'likert', count: 0},
            {name:'PROMPT_achievements_attempted', response: '', completed: false, type: 'text', count: 0},
            {name:'PROMPT_explore_components', response: '', completed: false, type: 'text', count: 0}, 
            {name:'PROMPT_download_data', response: '', completed: false, type: 'text', count: 0},
            {name:'PROMPT_move_components', response: '', completed: false, type: 'text', count: 0},
            {name:'PROMPT_graph_functions', response: '', completed: false, type: 'text', count: 0},
            {name:'PROMPT_inertia_check', response: '', completed: false, type: 'text', count: 0},
            
            

            
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
                if(item.name == payload.name && !item.completed){
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
         ADD_MESSAGE(state, message){
            state.message_list.push(message);
         },
         SET_PREVIOUS_INTENT(state, intent){
           state.previous_intent = intent;
         }
         

       },
       actions:{
        loadPrompts(context, prompts){
            context.commit('LOAD_PROMPTS', prompts);
        },
        setPromptResponse(context, payload){
             if(context.getters.getPromptsUncompleted.includes(payload.name)){
                context.commit('SET_PROMPT_RESPONSE', payload);

                context.dispatch('logPrompts', context.state.prompts, {root: true});        //log the prompts everytime a prompt is responded to
             }
         },
         showPrompt(context, name){
            context.commit('SHOW_PROMPT', name);
            context.commit('SET_PROMPT_UPDATE', true);
         },
         setPromptUpdate(context, set){
             context.commit('SET_PROMPT_UPDATE', set);
         },
         sendToBot(context, message){
            context.commit('ADD_MESSAGE', {sender:'you', time: new Date().toLocaleTimeString(), text:message});
            context.dispatch('setPromptResponse', {name: context.getters.getPreviousIntent, response: message});    //the mutation checks whether the intent matches the prompt
            
            context.dispatch('setAchievementCompleted', 'box-chat');

            let received_message = {};
            axios({
              method: 'post',
              url: context.getters.getUrl + '/webhooks/rest/webhook',
              data: {
                "sender": context.rootState.logging.uuid,  // sender ID of the user sending the message
                "message": message
              }
            }).then((response) => {
                console.log(response);
              response.data.forEach(element => {
                if(element.text){
                    //context.commit('ADD_MESSAGE', {sender:'student_bot', time: new Date().toLocaleTimeString(), text:element.text, buttons:element.buttons})
                    received_message = {sender:'Box', time: new Date().toLocaleTimeString(), text:element.text};
                    context.commit('ADD_MESSAGE', received_message);
                }
              });
  
            }, (error) => {
              console.log(error);

            })
            // .then(() => {
            //   axios({
            //     method: 'get',
            //     url: context.getters.getUrl + '/conversations/user/tracker',
            //   }).then((response) => {
            //   console.log(response);
            //   received_message['intent'] = response.data.latest_message.intent.name;

            //   context.commit('ADD_MESSAGE', received_message);

            //   context.commit('SET_PREVIOUS_INTENT', received_message.intent);
              
            // });
            // });
          },
          triggerIntent(context, intent){
            if(context.rootState.ui.isChatBotAvailable){
              context.dispatch('setPromptUpdate', true);
              axios({
                method: 'post',
                url: context.getters.getUrl + '/webhooks/rest/webhook',
                timeout: 5000,
                data: {
                  "sender": context.rootState.logging.uuid,  // sender ID of the user sending the message
                  "message": "/" + intent
                }
              }).then((response) => {
                console.log(response);
                response.data.forEach(element => {
                  if(element.text){
                      context.commit('ADD_MESSAGE', {sender:'Box', time: new Date().toLocaleTimeString(), text:element.text, intent: intent})
                      context.commit('SET_PREVIOUS_INTENT', intent);
                    }
                });
    
                }, (error) => {
                  console.log(error);
                  console.log('chatbot not responding');
                  context.dispatch('setChatBotAvailable', false);
                });
              }
            },
       },
       getters:{
        getUrl(state){
            return state.url;
        },
        getMessageList(state){
            return state.message_list;
        },
        getNumMessages(state){
          return state.message_list.length;
        },
        getPromptResponseWaiting(state){
          return state.prompt_response_waiting;
        },
        getPreviousIntent(state){
          return state.previous_intent;
        },
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
         getPromptByName: (state) => (name) => {
            return state.prompts.find(prompt => prompt.name == name);
         },
         getNewPromptCount(state){
          return state.new_prompt_count;
      },
          
         
       },  
  
  }

  export default promptsStore;
