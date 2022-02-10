import { mount } from '@vue/test-utils'
import { createStore } from 'vuex';
import WS from "jest-websocket-mock";
import RasaBot from '../../src/components/RasaBot.vue';

import loggingStore from '../../src/modules/logging.js';
import chatbotStore from '../../src/modules/chatbotStore.js';
import uiStore from '../../src/modules/uiStore.js';
import achievementStore from '../../src/modules/achievementStore.js';

const server = new WS("ws://localhost:1234");
//mock logging store since do not want to actually send websocket commands whilst testing
// const loggingStore = {
//     state: () => ({

//     }),
//     mutations:{
//         LOG({}, payload){
//             //console.log(payload);
//         }
        
//     }, 
//     actions:{
//         logAchievements(context, payload){
//             context.commit('LOG', payload);
//         }
//     },
//     getters:{

//     }
// }

// const chatbotStore = {
//     state: () => ({
//         new_prompt_update: false,
//         message_list: [],
//     }),
//     mutations:{
//         SET_PROMPT_UPDATE(state, set){
//             state.new_prompt_update = set;
//         },
//         ADD_MESSAGE(state, message){
//             state.message_list.push(message);
//          },
        
//     }, 
//     actions:{
//         //mock actions for the chatbotStore
//         triggerIntent(context, intent){
//             context.dispatch('setPromptUpdate', true);
//             context.commit('ADD_MESSAGE', {sender:'student_bot', time: new Date().toLocaleTimeString(), text:intent, intent: intent})
//         },
//         setPromptUpdate(context, set){
//             context.commit('SET_PROMPT_UPDATE', set);
//         },
//     },
//     getters:{
//         getMessageList(state){
//             return state.message_list;
//         },
//         getPromptUpdated(state){
//             return state.new_prompt_update;
//         }
//     }
// }

const createVuexStore = () => 

    createStore({
        modules:{
            chatbot: chatbotStore,
            logging: loggingStore,
            ui: uiStore,
            achievement: achievementStore
        }
    });

describe.skip('RasaBot.vue tests', () => {



    test('Renders', () => {

        const store = createVuexStore();
        const wrapper = mount(RasaBot, {
        global:{
            plugins: [store]
            }
        });

        
    
        expect(wrapper.find('#prompts-button').exists()).toBe(true);
    
    })

    

    server.close();


})