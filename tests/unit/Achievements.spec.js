import { mount } from '@vue/test-utils'
import { createStore } from 'vuex';
import Achievements from '../../src/components/Achievements.vue';

import achievementStore from '../../src/modules/achievementStore.js'

//mock logging store since do not want to actually send websocket commands whilst testing
const loggingStore = {
    state: () => ({

    }),
    mutations:{
        LOG({}, payload){
            //console.log(payload);
        }
        
    }, 
    actions:{
        logAchievements(context, payload){
            context.commit('LOG', payload);
        }
    },
    getters:{

    }
}

const createVuexStore = () => 

    createStore({
        modules:{
            achievements: achievementStore,
            logging: loggingStore
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
        expect(store.getters.getAchievementsCompleted == 'custom-ui').toBe(true);
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