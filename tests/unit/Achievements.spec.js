import { mount } from '@vue/test-utils'
import { createStore } from 'vuex';
import Achievements from '../../src/components/Achievements.vue';

import achievementStore from '../../src/modules/achievementStore.js'
import loggingStore from '../../src/modules/logging.js';
import promptStore from '../../src/modules/prompts.js';


const createVuexStore = () => 

    createStore({
        modules:{
            achievements: achievementStore,
            logging: loggingStore,
            prompts: promptStore
        }
    });

describe('Achievements.vue tests', () => {



    test('Renders', () => {

        const store = createVuexStore();
        const wrapper = mount(Achievements, {
        global:{
            plugins: [store]
            }
        });
  
      expect(wrapper.find('#achievements-button').exists()).toBe(true);
    
    })

    test('Achievement renders notification after customise UI', async () => {
        const store = createVuexStore();
        const wrapper = mount(Achievements, {
        global:{
            plugins: [store]
            }
        });

        expect(wrapper.find('#achievement-notification').exists()).toBe(false);

        await store.dispatch('setAchievementCompleted', 'custom-ui');

        expect(wrapper.find('#achievement-notification').exists()).toBe(true);
        //expect(store.getters.getAchievementsCompleted == 'custom-ui').toBe(true);
        expect(store.getters.getAchievementsCompleted).toContainEqual('custom-ui');
        //console.log(store.getters.getAchievementsCompleted);
    })

    test('Customise UI achievement gets checkbox ticked', async () => {
        const store = createVuexStore();
        const wrapper = mount(Achievements, {
        global:{
            plugins: [store]
            }
        });


        await store.dispatch('setAchievementCompleted', 'custom-ui');

        const checkbox = wrapper.find('#custom-ui');
        expect(checkbox.element.checked).toBe(true);
        //console.log(store.getters.getAchievementsCompleted);
    })



})