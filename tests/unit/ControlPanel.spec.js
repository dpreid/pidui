import { mount } from '@vue/test-utils'
import { createStore } from 'vuex';
import WS from "jest-websocket-mock";
import ControlPanel from '../../src/components/ControlPanelSpinningDisk.vue';

import commandStore from '../../src/modules/commandStore.js';
import loggingStore from '../../src/modules/logging.js';
import dataStore from '../../src/modules/dataStore.js';
import uiStore from '../../src/modules/uiStore.js';
import streamStore from '../../src/modules/streamStore.js';

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

const createVuexStore = () => 

    createStore({
        modules:{
            commands: commandStore,
            logging: loggingStore,
            data: dataStore,
            ui: uiStore,
            stream: streamStore
        }
    });

describe('ControlPanel.vue tests', () => {



    test('Renders', () => {

        const store = createVuexStore();
        const wrapper = mount(ControlPanel, {
            props: {
                url: "ws://localhost:1234"
              },
            global:{
                plugins: [store]
                }
        });
  
      expect(wrapper.html()).toContain('Current mode:');

      WS.clean();
    
    })

    // test('Set position mode command', async () => {

    //     const store = createVuexStore();
    //     await store.dispatch('setDataSocket', new WebSocket("ws://localhost:1234"));
    //     const wrapper = mount(ControlPanel, {
    //         props: {
    //             url: "ws://localhost:1234"
    //           },
    //         global:{
    //             plugins: [store]
    //             }
    //     });

  
    //   await wrapper.get('#pidposition').trigger('click');

    //   await expect(server).toReceiveMessage(JSON.stringify({
    //         set: "mode",
    //         to: "velocity"
    //     }));

    //     //expect(server).toHaveReceivedMessages(['{set: "mode", to: "velocity"}']);

    //     // await expect(server).toReceiveMessage(JSON.stringify({
    //     //     "set": "parameters",
    //     //     "kp": 1,
    //     //     "ki": 0,
    //     //     "kd": 0
    //     // }));

    //     //expect(server).toHaveReceivedMessages(['{set: "mode", to: "velocity"}', '{set: "parameters", "kp": 1, "ki": 0, "kd": 0}']);

    //     //expect(server).toHaveReceivedMessages(['{set: "mode", to: "velocity"}', '{set: "parameters", "kp": 1, "ki": 0, "kd": 0}']);
    //     //expect(server).toHaveReceivedMessages(['{set: "mode", to: "velocity"}']);
    //     expect(store.getters.getCurrentMode == 'positionPid').toBe(true);

    //   WS.clean();
    
    // })

    

    
    server.close();


})