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
            achievement: achievementStore
        }
    });

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
        await store.dispatch('setConsent', true);
        await store.dispatch('setUUID', 'david');
        await store.dispatch('setHardware', 'spin30');

        
        await store.dispatch('setAchievementCompleted', 'custom-ui');
        const t = Date.now()
        const payload = {log:'achievements', data: store.getters.getAchievements}

        await expect(server).toReceiveMessage({
            user: 'david',
            t: t - 1,          
            exp: 'spin30',        
            payload: payload
        });


        server.close();
    
    })

    

    

    

    

    
    


})