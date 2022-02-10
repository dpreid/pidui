import { mount } from '@vue/test-utils'
import { createStore } from 'vuex';
import Consent from '../../src/components/Consent.vue';
import loggingStore from '../../src/modules/logging.js';
import uiStore from '../../src/modules/uiStore.js';
import promptStore from '../../src/modules/prompts.js';


const createVuexStore = () => 

    createStore({
        modules:{
            ui: uiStore,
            logging: loggingStore,
            prompts: promptStore
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

    test('Correct consent in localStore: not selecting either option', async () => {
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
        expect(localStorage.getItem('remote-lab-logging-consent') == 'false').toBe(true);
        expect(store.getters.getLogConsent == false).toBe(true);
        expect(localStorage.getItem('remote-lab-survey-consent') == 'false').toBe(true);
        expect(store.getters.getSurveyConsent == false).toBe(true);
    

    })

    test('Correct consent in localStore: select logging only', async () => {
        const store = createVuexStore();
        const wrapper = mount(Consent, {
        global:{
            plugins: [store]
            },
        });

        const consent_button = wrapper.find('#consent-yes-button');
        const logging_consent_radio = wrapper.find('#loggingConsentRadio');
        await store.dispatch('setUsesLocalStorage', true);

        await logging_consent_radio.trigger('click');
        await consent_button.trigger('click');

        
        expect(localStorage.setItem).toHaveBeenCalled();
        expect(localStorage.getItem('remote-lab-logging-consent') == 'true').toBe(true);
        expect(store.getters.getLogConsent == true).toBe(true);
        expect(localStorage.getItem('remote-lab-survey-consent') == 'false').toBe(true);
        expect(store.getters.getSurveyConsent == false).toBe(true);
    

    })

    test('Correct consent in localStore: select survey only', async () => {
        const store = createVuexStore();
        const wrapper = mount(Consent, {
        global:{
            plugins: [store]
            },
        });

        const consent_button = wrapper.find('#consent-yes-button');
        const survey_consent_radio = wrapper.find('#surveyConsentRadio');
        await store.dispatch('setUsesLocalStorage', true);

        await survey_consent_radio.trigger('click');
        await consent_button.trigger('click');

        
        expect(localStorage.setItem).toHaveBeenCalled();
        expect(localStorage.getItem('remote-lab-logging-consent') == 'false').toBe(true);
        expect(store.getters.getLogConsent == false).toBe(true);
        expect(localStorage.getItem('remote-lab-survey-consent') == 'true').toBe(true);
        expect(store.getters.getSurveyConsent == true).toBe(true);
    

    })

    test('Correct consent in localStore: select both', async () => {
        const store = createVuexStore();
        const wrapper = mount(Consent, {
        global:{
            plugins: [store]
            },
        });

        const consent_button = wrapper.find('#consent-yes-button');
        const survey_consent_radio = wrapper.find('#surveyConsentRadio');
        const logging_consent_radio = wrapper.find('#loggingConsentRadio');
        await store.dispatch('setUsesLocalStorage', true);

        await survey_consent_radio.trigger('click');
        await logging_consent_radio.trigger('click');
        await consent_button.trigger('click');

        
        expect(localStorage.setItem).toHaveBeenCalled();
        expect(localStorage.getItem('remote-lab-logging-consent') == 'true').toBe(true);
        expect(store.getters.getLogConsent == true).toBe(true);
        expect(localStorage.getItem('remote-lab-survey-consent') == 'true').toBe(true);
        expect(store.getters.getSurveyConsent == true).toBe(true);
    

    })

    test('Correct consent in localStore: select logging and then deselect', async () => {
        const store = createVuexStore();
        const wrapper = mount(Consent, {
        global:{
            plugins: [store]
            },
        });

        const consent_button = wrapper.find('#consent-yes-button');
        const logging_consent_radio = wrapper.find('#loggingConsentRadio');
        await store.dispatch('setUsesLocalStorage', true);

        await logging_consent_radio.trigger('click');
        await logging_consent_radio.trigger('click');
        await consent_button.trigger('click');

        
        expect(localStorage.setItem).toHaveBeenCalled();
        expect(localStorage.getItem('remote-lab-logging-consent') == 'false').toBe(true);
        expect(store.getters.getLogConsent == false).toBe(true);
        expect(localStorage.getItem('remote-lab-survey-consent') == 'false').toBe(true);
        expect(store.getters.getSurveyConsent == false).toBe(true);
    

    })


    

})