import { mount } from '@vue/test-utils'
import Snapshot from '../../src/components/MotorSnapshot.vue';
import { createStore } from 'vuex';

import dataStore from '../../src/modules/dataStore.js'


const createVuexStore = () => 

    createStore({
        modules:{
            data: dataStore,
        }
    });
    



describe('MotorSnapshot.vue tests', () => {



  test('Renders', () => {
    const store = createVuexStore();
    store.dispatch('setCurrentAngleArray', [0,0,0,0]);
    store.dispatch('setCurrentAngularVelocityArray', [0,0,0,0]);
    store.dispatch('setCurrentTimeArray', [0,0,0,0]); 
    const wrapper = mount(Snapshot, {
      global:{
        plugins: [store]
      }
    });

    expect(wrapper.find('#motor-snapshot-div').text()).toContain('Record Snapshot');    //button to record snapshot is displayed
  
  })

  


  

})