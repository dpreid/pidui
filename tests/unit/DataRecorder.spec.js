import { mount } from '@vue/test-utils'
import DataRecorder from '../../src/components/DataRecorder.vue';
import { createStore } from 'vuex';

import dataStore from '../../src/modules/dataStore.js'



const createVuexStore = () => 

    createStore({
        modules:{
            data: dataStore,
        }
    });
    



describe('DataRecorder.vue tests', () => {

    test('Renders', async () => {
        const store = createVuexStore();
        const wrapper = mount(DataRecorder, {
        global:{
            plugins: [store]
            }
        });

        await store.dispatch('setInputMode', 'free');

        
        expect(wrapper.find('#recordButton').exists()).toBe(true);    //button to record snapshot is displayed
    })

  test('Clicking record reveals the stop button', async () => {
      //Arrange - setup the conditions for the test
    const store = createVuexStore();
    const wrapper = mount(DataRecorder, {
      global:{
        plugins: [store]
      }
    });
    await store.dispatch('setInputMode', 'free');
    await store.dispatch('setIsRecording', false);

    //Act - perform interactions as if the user is interacting with the app
    await wrapper.find('#recordButton').trigger('click');

    //Assert - what are the expectations for the state of the app.
    expect(wrapper.find('#stopButton').exists()).toBe(true);
  
  })

  


  

})