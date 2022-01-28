import { mount } from '@vue/test-utils'
import { createStore } from 'vuex';
import Consent from '../../src/components/Consent.vue';
import loggingStore from '../../src/modules/logging.js';
import uiStore from '../../src/modules/uiStore.js';


const createVuexStore = () => 

    createStore({
        modules:{
            ui: uiStore,
            logging: loggingStore
        }
    });

    jest.spyOn(window.localStorage.__proto__, 'setItem');
    //window.localStorage.__proto__.setItem = jest.fn();

describe('Consent tests', () => {



    test('Renders consent component', () => {

        const store = createVuexStore();
        const wrapper = mount(Consent, {
        global:{
            plugins: [store]
            }
        });
    
        expect(wrapper.find('#consent-modal').exists()).toBe(true);
    
    })

    test('Clicking YES to consent sets correct consent in store and localStorage', async () => {
        const store = createVuexStore();
        const wrapper = mount(Consent, {
        global:{
            plugins: [store]
            },
        });

        const consent_button = wrapper.find('#consent-yes-button');
        
        await store.dispatch('setUsesLocalStorage', true);
        await consent_button.trigger('click');

        
        expect(localStorage.setItem).toHaveBeenCalled();
        expect(localStorage.getItem('remote-lab-consent') == 'true').toBe(true);
        expect(store.getters.getLogConsent == true).toBe(true);
    

    })

    test('Clicking NO to consent sets correct consent in store and localStorage', async () => {
        const store = createVuexStore();
        const wrapper = mount(Consent, {
        global:{
            plugins: [store]
            },
        });

        const consent_button = wrapper.find('#consent-no-button');

        await store.dispatch('setUsesLocalStorage', true);
        await consent_button.trigger('click');

        
        expect(localStorage.setItem).toHaveBeenCalled();
        expect(localStorage.getItem('remote-lab-consent') == 'false').toBe(true);
        expect(store.getters.getLogConsent == false).toBe(true);
    

    })

    

})