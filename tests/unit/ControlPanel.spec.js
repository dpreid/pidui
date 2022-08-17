import { mount } from '@vue/test-utils'
import { createStore } from 'vuex';
import WS from "jest-websocket-mock";
import ControlPanel from '../../src/components/ControlPanelSpinningDisk.vue';
import { SmoothieChart } from 'smoothie';
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
    
    })

    test('Set voltage mode command', async () => {

        const store = createVuexStore();
        const server = new WS("ws://localhost:1234", { jsonProtocol: true });
        const wrapper = mount(ControlPanel, {
            props: {
                url: ""
              },
            global:{
                plugins: [store]
                }
        });

        await wrapper.setData({ chart_omega: new SmoothieChart() })
        await store.dispatch('setDataURL', 'ws://localhost:1234');
        await wrapper.setProps({url: 'ws://localhost:1234'});
        //await store.dispatch('setCurrentMode', 'stopped');
        
        await wrapper.get('#dcmotor').trigger('click');
        
        

        await expect(server).toReceiveMessage({set: "mode", to: "motor"});
        expect(server).toHaveReceivedMessages([{set: "mode", to: "motor"},]);

        expect(store.getters.getCurrentMode == 'speedRaw').toBe(true);

        server.close();
    
    })

    test('Set voltage mode and then value', async () => {

        const store = createVuexStore();
        const server = new WS("ws://localhost:1234", { jsonProtocol: true });
        const wrapper = mount(ControlPanel, {
            props: {
                url: ""
              },
            global:{
                plugins: [store]
                }
        });

        await wrapper.setData({ chart_omega: new SmoothieChart() })
        await store.dispatch('setDataURL', 'ws://localhost:1234');
        await wrapper.setProps({url: 'ws://localhost:1234'});
        //await store.dispatch('setCurrentMode', 'stopped');
        
        await wrapper.get('#dcmotor').trigger('click');
        await expect(server).toReceiveMessage({set: "mode", to: "motor"});
        expect(server).toHaveReceivedMessages([{set: "mode", to: "motor"},]);
        expect(store.getters.getCurrentMode == 'speedRaw').toBe(true);

        await wrapper.get('#step_raw').setValue(5);
        await wrapper.get('#run').trigger('click');
        await expect(server).toReceiveMessage({set: "volts", to: 5});
        expect(server).toHaveReceivedMessages([{set: "mode", to: "motor"},{set: "volts", to: 5}]);

        server.close();
    
    })

    test('Set position mode command', async () => {

        const store = createVuexStore();
        const server = new WS("ws://localhost:1234", { jsonProtocol: true });
        const wrapper = mount(ControlPanel, {
            props: {
                url: ""
              },
            global:{
                plugins: [store]
                }
        });

        await wrapper.setData({ chart_omega: new SmoothieChart() })
        await store.dispatch('setDataURL', 'ws://localhost:1234');
        await wrapper.setProps({url: 'ws://localhost:1234'});
        //await store.dispatch('setCurrentMode', 'stopped');
        
        await wrapper.get('#pidposition').trigger('click');
        
        

        await expect(server).toReceiveMessage({set: "mode", to: "position"});
        expect(server).toHaveReceivedMessages([{set: "mode", to: "position"},]);

        expect(store.getters.getCurrentMode == 'positionPid').toBe(true);

        server.close();
    
    })

    test('Set position mode and then value', async () => {

        const store = createVuexStore();
        const server = new WS("ws://localhost:1234", { jsonProtocol: true });
        const wrapper = mount(ControlPanel, {
            props: {
                url: ""
              },
            global:{
                plugins: [store]
                }
        });

        await wrapper.setData({ chart_omega: new SmoothieChart() })
        await store.dispatch('setDataURL', 'ws://localhost:1234');
        await wrapper.setProps({url: 'ws://localhost:1234'});
        //await store.dispatch('setCurrentMode', 'stopped');
        
        await wrapper.get('#pidposition').trigger('click');
        await expect(server).toReceiveMessage({set: "mode", to: "position"});
        expect(server).toHaveReceivedMessages([{set: "mode", to: "position"},]);
        expect(store.getters.getCurrentMode == 'positionPid').toBe(true);

        await wrapper.get('#step_position').setValue(5);
        await wrapper.get('#run').trigger('click');
        await expect(server).toReceiveMessage({set: "position", to: 5});
        expect(server).toHaveReceivedMessages([{set: "mode", to: "position"},{set: "position", to: 5}]);

        server.close();
    
    })

    test('Set velocity mode command', async () => {

        const store = createVuexStore();
        const server = new WS("ws://localhost:1234", { jsonProtocol: true });
        const wrapper = mount(ControlPanel, {
            props: {
                url: ""
              },
            global:{
                plugins: [store]
                }
        });

        await wrapper.setData({ chart_omega: new SmoothieChart() })
        await store.dispatch('setDataURL', 'ws://localhost:1234');
        await wrapper.setProps({url: 'ws://localhost:1234'});
        //await store.dispatch('setCurrentMode', 'stopped');
        
        await wrapper.get('#pidspeed').trigger('click');
        
        

        await expect(server).toReceiveMessage({set: "mode", to: "velocity"});
        expect(server).toHaveReceivedMessages([{set: "mode", to: "velocity"},]);

        expect(store.getters.getCurrentMode == 'speedPid').toBe(true);

        server.close();
    
    })

    test('Set velocity mode and then value', async () => {

        const store = createVuexStore();
        const server = new WS("ws://localhost:1234", { jsonProtocol: true });
        const wrapper = mount(ControlPanel, {
            props: {
                url: ""
              },
            global:{
                plugins: [store]
                }
        });

        await wrapper.setData({ chart_omega: new SmoothieChart() })
        await store.dispatch('setDataURL', 'ws://localhost:1234');
        await wrapper.setProps({url: 'ws://localhost:1234'});
        //await store.dispatch('setCurrentMode', 'stopped');
        
        await wrapper.get('#pidspeed').trigger('click');
        await expect(server).toReceiveMessage({set: "mode", to: "velocity"});
        expect(server).toHaveReceivedMessages([{set: "mode", to: "velocity"},]);
        expect(store.getters.getCurrentMode == 'speedPid').toBe(true);

        await wrapper.get('#step_speed').setValue(50);
        await wrapper.get('#run').trigger('click');
        await expect(server).toReceiveMessage({set: "velocity", to: 50});
        expect(server).toHaveReceivedMessages([{set: "mode", to: "velocity"},{set: "velocity", to: 50}]);

        server.close();
    
    })

    test('Change input mode to ramp and run', async () => {

        const store = createVuexStore();
        const server = new WS("ws://localhost:1234", { jsonProtocol: true });
        const wrapper = mount(ControlPanel, {
            props: {
                url: ""
              },
            global:{
                plugins: [store]
                }
        });

        await wrapper.setData({ chart_omega: new SmoothieChart() })
        await store.dispatch('setDataURL', 'ws://localhost:1234');
        await wrapper.setProps({url: 'ws://localhost:1234'});
        //await store.dispatch('setCurrentMode', 'stopped');
        
        await wrapper.get('#pidspeed').trigger('click');
        await expect(server).toReceiveMessage({set: "mode", to: "velocity"});
        expect(server).toHaveReceivedMessages([{set: "mode", to: "velocity"},]);
        expect(store.getters.getCurrentMode == 'speedPid').toBe(true);

        await wrapper.get('#step_speed').setValue(50);
        await wrapper.get('#run').trigger('click');
        await expect(server).toReceiveMessage({set: "velocity", to: 50});
        expect(server).toHaveReceivedMessages([{set: "mode", to: "velocity"},{set: "velocity", to: 50}]);

        server.close();
    
    })

    

    

    
    


})