import { mount } from '@vue/test-utils'
import { createStore } from 'vuex';
import WS from "jest-websocket-mock";
import Logging from '../../src/components/Logging.vue';

import commandStore from '../../src/modules/commandStore.js';
import loggingStore from '../../src/modules/logging.js';
import dataStore from '../../src/modules/dataStore.js';
import uiStore from '../../src/modules/uiStore.js';
import streamStore from '../../src/modules/streamStore.js';
import achievementStore from '../../src/modules/achievementStore.js';
import promptStore from '../../src/modules/prompts.js';

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

const createVuexStore = () => 

    createStore({
        modules:{
            commands: commandStore,
            logging: loggingStore,
            data: dataStore,
            ui: uiStore,
            stream: streamStore,
            achievement: achievementStore,
            prompts: promptStore
        }
    });


      
      afterEach(() => {
        WS.clean();
      });

      Date.now = jest.fn(() => 1487076708000)

describe('Logging tests', () => {


    test('New achievement sends log', async () => {

        const store = createVuexStore();
        const server = new WS("ws://localhost:1234", { jsonProtocol: true });
        const wrapper = mount(Logging, {
            props: {
                url: ""
              },
            global:{
                plugins: [store]
                }
        });
        
        await store.dispatch('setLogURL', 'ws://localhost:1234');
        await wrapper.setProps({url: 'ws://localhost:1234'});
        await store.dispatch('setUUID', 'david');
        await store.dispatch('setLoggingConsent', true);
        

        
        await store.dispatch('setAchievementCompleted', 'custom-ui');
        const payload = {log:'achievements', data: store.getters.getAchievements}

        await expect(server).toReceiveMessage(
            {
                user: 'david',
                t: Date.now(),                 
                payload: payload
            }
        );


        server.close();
    
    })

    test('No achievement logged if consent not set', async () => {

        const store = createVuexStore();
        const server = new WS("ws://localhost:1234", { jsonProtocol: true });
        const wrapper = mount(Logging, {
            props: {
                url: ""
              },
            global:{
                plugins: [store]
                }
        });
        
        await store.dispatch('setLogURL', 'ws://localhost:1234');
        await wrapper.setProps({url: 'ws://localhost:1234'});
        await store.dispatch('setUUID', 'david');
        await store.dispatch('setLoggingConsent', false);
        

        
        await store.dispatch('setAchievementCompleted', 'custom-ui');
        const payload = {log:'achievements', data: store.getters.getAchievements}

        expect(server).toHaveReceivedMessages([]);


        server.close();
    
    })

    
    test('New survey response sends log', async () => {

        const store = createVuexStore();
        const server = new WS("ws://localhost:1234", { jsonProtocol: true });
        const wrapper = mount(Logging, {
            props: {
                url: ""
              },
            global:{
                plugins: [store]
                }
        });
        
        await store.dispatch('setLogURL', 'ws://localhost:1234');
        await wrapper.setProps({url: 'ws://localhost:1234'});
        await store.dispatch('setUUID', 'david');
        await store.dispatch('setSurveyConsent', true);
        
        const payload = {name: 'rate_experience', response: '2'}
        await store.dispatch('setPromptResponse', payload);

        await expect(server).toReceiveMessage(
            {
                user: 'david',
                t: Date.now(),                 
                payload: {log:'survey', data: store.getters.getPrompts}
            }
        );


        server.close();
    
    })

    test('New survey response does not send log if no consent given', async () => {

        const store = createVuexStore();
        const server = new WS("ws://localhost:1234", { jsonProtocol: true });
        const wrapper = mount(Logging, {
            props: {
                url: ""
              },
            global:{
                plugins: [store]
                }
        });
        
        await store.dispatch('setLogURL', 'ws://localhost:1234');
        await wrapper.setProps({url: 'ws://localhost:1234'});
        await store.dispatch('setUUID', 'david');
        await store.dispatch('setSurveyConsent', false);
        
        const payload = {name: 'rate_experience', response: '2'}
        await store.dispatch('setPromptResponse', payload);

        expect(server).toHaveReceivedMessages([]);


        server.close();
    
    })

    
    

    

    

    

    
    


})