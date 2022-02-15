import { mount } from '@vue/test-utils'
import { createStore } from 'vuex';
import Prompts from '../../src/components/Prompts.vue';
import NavigationBar from '../../src/components/NavigationBar.vue';
import DataRecorder from '../../src/components/DataRecorder.vue';
import Achievements from '../../src/components/Achievements.vue';
import loggingStore from '../../src/modules/logging.js';
import uiStore from '../../src/modules/uiStore.js';
import promptStore from '../../src/modules/prompts.js';
import achievementStore from '../../src/modules/achievementStore.js';
import dataStore from '../../src/modules/dataStore.js';
import streamStore from '../../src/modules/streamStore.js'


const createVuexStore = () => 

    createStore({
        modules:{
            ui: uiStore,
            logging: loggingStore,
            prompts: promptStore,
            achievements: achievementStore,
            data: dataStore,
            stream: streamStore
        }
    });

    jest.spyOn(window.localStorage.__proto__, 'setItem');


    describe('Prompts.vue tests', () => {


        test('Renders', () => {

            const store = createVuexStore();
            const wrapper = mount(Prompts, {
            global:{
                plugins: [store]
                }
            });
      
          expect(wrapper.find('#promptsmenubutton').exists()).toBe(true);
        
        })

        test('Does not render if consent not set', async() => {

            const store = createVuexStore();
            const wrapper = mount(NavigationBar, {
            global:{
                plugins: [store]
                }
            });

            await store.dispatch('setSurveyConsent', false);
      
          expect(wrapper.find('#prompts').exists()).toBe(false);
        
        })

})


    describe('rate_experience', () => {

        

        test('1st prompt', async () => {

            const store = createVuexStore();
            const wrapper = mount(Prompts, {
            global:{
                plugins: [store]
                }
            });

            await store.dispatch('setSurveyConsent', true);
            await store.dispatch('setTotalTime', 1800001);
            await store.dispatch('loadPrompts', []);

            //await nextTick();

            const prompt = {name:'rate_experience', verbose:'Please rate your experience of the remote lab so far.', mainText:'Select the appropriate point for your overall impression of the remote lab so far.', minScale:'Hate it.', maxScale:'Love it.', hidden: false, response: '', completed: false, type: 'likert', count: 0}
            //console.log(store.getters.getAvailablePrompts);
            expect(store.getters.getAvailablePrompts).toContainEqual(prompt);
        
        })

        test('1st response', async () => {

            const store = createVuexStore();
            const wrapper = mount(Prompts, {
            global:{
                plugins: [store]
                }
            });

            await store.dispatch('setSurveyConsent', true);
            await store.dispatch('setTotalTime', 1800001);
            await store.dispatch('loadPrompts', []);

            const orig_length = store.getters.getAvailablePrompts.length;

            await store.dispatch('setPromptResponse', {name:'rate_experience', response:'2'});

            expect(store.getters.getAvailablePrompts.length).toEqual(orig_length - 1);
            expect(store.getters.getPromptByName('rate_experience').count).toEqual(1);
        
        })

        test('2nd prompt', async () => {

            const store = createVuexStore();
            const wrapper = mount(Prompts, {
            global:{
                plugins: [store]
                }
            });

            await store.dispatch('setSurveyConsent', true);
            await store.dispatch('setTotalTime', 3600001);
            await store.dispatch('loadPrompts', [{name:'rate_experience', verbose:'Please rate your experience of the remote lab so far.', mainText:'Select the appropriate point for your overall impression of the remote lab so far.', minScale:'Hate it.', maxScale:'Love it.', hidden: true, response: '', completed: false, type: 'likert', count: 1}]);

            


            const prompt = {name:'rate_experience', verbose:'Please rate your experience of the remote lab so far.', mainText:'Select the appropriate point for your overall impression of the remote lab so far.', minScale:'Hate it.', maxScale:'Love it.', hidden: false, response: '', completed: false, type: 'likert', count: 1}
            //console.log(store.getters.getAvailablePrompts);
            expect(store.getters.getAvailablePrompts).toContainEqual(prompt);
        
        })

        test('3rd prompt', async () => {

            const store = createVuexStore();
            const wrapper = mount(Prompts, {
            global:{
                plugins: [store]
                }
            });

            const prompt = {name:'rate_experience', verbose:'Please rate your experience of the remote lab so far.', mainText:'Select the appropriate point for your overall impression of the remote lab so far.', minScale:'Hate it.', maxScale:'Love it.', hidden: true, response: '', completed: false, type: 'likert', count: 2}

            await store.dispatch('setSurveyConsent', true);
            await store.dispatch('setTotalTime', 5400001);
            await store.dispatch('loadPrompts', [prompt]);


            prompt.hidden = false;  
            expect(store.getters.getAvailablePrompts).toContainEqual(prompt);
        
        })

        



    })


    describe('rate_ui tests', () => {

        test('1st prompt', async () => {

            const store = createVuexStore();
            const wrapper = mount(Prompts, {
            global:{
                plugins: [store]
                }
            });

            const prompt = {name:'rate_ui', verbose:'Please rate your experience of the USER INTERFACE so far.', mainText:'Rate your agreement with the statement: it is easy to navigate the user interface', minScale:'Strongly disagree', maxScale:'Strongly agree', hidden: true, response: '', completed: false, type: 'likert', count: 0}
            await store.dispatch('setSurveyConsent', true);
            await store.dispatch('setAchievementCompleted', 'speedRaw-step-input');
            await store.dispatch('setTotalTime', 600001);
            await store.dispatch('loadPrompts', []);


            prompt.hidden = false;  
            expect(store.getters.getAvailablePrompts).toContainEqual(prompt);
        
        })

        test('1st prompt fails if count wrong', async () => {

            const store = createVuexStore();
            const wrapper = mount(Prompts, {
            global:{
                plugins: [store]
                }
            });

            const prompt = {name:'rate_ui', verbose:'Please rate your experience of the USER INTERFACE so far.', mainText:'Rate your agreement with the statement: it is easy to navigate the user interface', minScale:'Strongly disagree', maxScale:'Strongly agree', hidden: true, response: '', completed: false, type: 'likert', count: 1}
            await store.dispatch('setSurveyConsent', true);
            await store.dispatch('setAchievementCompleted', 'speedRaw-step-input');
            await store.dispatch('setTotalTime', 600001);
            await store.dispatch('loadPrompts', []);


            prompt.hidden = false;  
            expect(store.getters.getAvailablePrompts).not.toContainEqual(prompt);
        
        })

        test('1st prompt fails if appropriate achievement not completed', async () => {

            const store = createVuexStore();
            const wrapper = mount(Prompts, {
            global:{
                plugins: [store]
                }
            });

            const prompt = {name:'rate_ui', verbose:'Please rate your experience of the USER INTERFACE so far.', mainText:'Rate your agreement with the statement: it is easy to navigate the user interface', minScale:'Strongly disagree', maxScale:'Strongly agree', hidden: true, response: '', completed: false, type: 'likert', count: 0}
            await store.dispatch('setSurveyConsent', true);
            await store.dispatch('setAchievementCompleted', 'positionPid-ramp-input');
            await store.dispatch('setTotalTime', 600001);
            await store.dispatch('loadPrompts', []);


            prompt.hidden = false;  
            expect(store.getters.getAvailablePrompts).not.toContainEqual(prompt);
        
        })

    })


    describe('comment_improvements tests', () => {

        test('1st prompt', async () => {

            const store = createVuexStore();
            const wrapper = mount(Prompts, {
            global:{
                plugins: [store]
                }
            });


            const prompt = {name:'comment_improvements', verbose:'How could we improve the remote lab?', mainText:'Please provide comments on how we could improve the remote lab.', hidden: true, response: '', completed: false, type: 'text', count: 0}
            await store.dispatch('setSurveyConsent', true);
            
            await store.dispatch('setTotalTime', 1800001);
            await store.dispatch('loadPrompts', []);



            prompt.hidden = false;  
            expect(store.getters.getAvailablePrompts).toContainEqual(prompt);
        
        })



    })

    describe('useful_component tests', () => {

        test('1st prompt', async () => {

            const store = createVuexStore();
            const wrapper = mount(Prompts, {
            global:{
                plugins: [store]
                }
            });

            const wrapper2 = mount(NavigationBar, {
                global:{
                    plugins: [store]
                    }
                });

            const prompt = {name:'useful_component', verbose:'Which component has been the most useful?', mainText:'Name the component or components that you have found most useful.', hidden: true, response: '', completed: false, type: 'text', count: 0};
            await store.dispatch('setSurveyConsent', true);
            
            await store.dispatch('setTotalTime', 1800001);
            await store.dispatch('loadPrompts', []);

            wrapper2.find('#menudropdown').trigger('click');
            wrapper2.find('#graphmenu').trigger('click');


            prompt.hidden = false;  
            expect(store.getters.getAvailablePrompts).toContainEqual(prompt);
        
        })



    })

    describe('control_experiment tests', () => {

        test('1st prompt', async () => {

            const store = createVuexStore();
            const wrapper = mount(Prompts, {
            global:{
                plugins: [store]
                }
            });

            const wrapper2 = mount(DataRecorder, {
                global:{
                    plugins: [store]
                    }
                });

                
            const prompt = {name:'control_experiment', verbose:'How in control of your practical do you feel?', mainText:'Rate your agreement with the statement: the UI allows me to control how I perform the practical work.', minScale:'Strongly disagree', maxScale:'Strongly agree', hidden: true, response: '', completed: false, type: 'likert', count: 0}
            await store.dispatch('setSurveyConsent', true);

            //ensure there is over 100 data points for the prompts to work
            const datum = {id: 1, t: 1, theta: 1, omega: 1, command: 1, drive: 1, error: 1}
            const data = Array(101).fill(datum);
            for(let i=0;i<101;i++){
                await store.dispatch('addData', data[i]);
            }
            
            
            await store.dispatch('setTotalTime', 1800001);
            await store.dispatch('loadPrompts', []);

            wrapper2.find('#outputButton').trigger('click');


            prompt.hidden = false;  
            expect(store.getters.getAvailablePrompts).toContainEqual(prompt);
        
        })



    })

    describe('control_hardware tests', () => {

        test('1st prompt', async () => {

            const store = createVuexStore();
            const wrapper = mount(Prompts, {
            global:{
                plugins: [store]
                }
            });

            const wrapper2 = mount(DataRecorder, {
                global:{
                    plugins: [store]
                    }
                });
                
            const prompt = {name:'control_hardware', verbose:'How in control of the hardware do you feel?', mainText:'Rate your agreement with the statement: I am in control of the physical hardware', minScale:'Strongly disagree', maxScale:'Strongly agree', hidden: true, response: '', completed: false, type: 'likert', count: 0}
            await store.dispatch('setSurveyConsent', true);

            //ensure there is over 100 data points for the prompts to work
            const datum = {id: 1, t: 1, theta: 1, omega: 1, command: 1, drive: 1, error: 1}
            const data = Array(101).fill(datum);
            for(let i=0;i<101;i++){
                await store.dispatch('addData', data[i]);
            }
            
            
            await store.dispatch('setTotalTime', 1200001);
            await store.dispatch('loadPrompts', []);

            wrapper2.find('#outputButton').trigger('click');


            prompt.hidden = false;  
            expect(store.getters.getAvailablePrompts).toContainEqual(prompt);
        
        })



    })


    describe('rate-ach tests', () => {

        test('1st prompt', async () => {

            const store = createVuexStore();
            const wrapper = mount(Prompts, {
            global:{
                plugins: [store]
                }
            });


            const prompt = {name:'rate-ach', verbose:'What do you think about the achievements?', mainText:'Rate your agreement with the statement: the achievements have helped encourage me to explore the remote lab', minScale:'Strongly disagree', maxScale:'Strongly agree', hidden: true, response: '', completed: false, type: 'likert', count: 0}
            await store.dispatch('setSurveyConsent', true);
            
            await store.dispatch('setTotalTime', 1800001);
            await store.dispatch('loadPrompts', []);



            prompt.hidden = false;  
            expect(store.getters.getAvailablePrompts).toContainEqual(prompt);
        
        })



    })

    describe('data_analysis test', () => {

        test('1st prompt', async () => {

            const store = createVuexStore();
            const wrapper = mount(Prompts, {
            global:{
                plugins: [store]
                }
            });

            const prompt = {name:'data_analysis', verbose:'Data analysis', mainText:'Which component is best for analysing data?', options:['Graph', 'Snapshot', 'Table', 'Download'], hidden: true, response: '', completed: false, type: 'select', count: 0}
            await store.dispatch('setSurveyConsent', true);
            await store.dispatch('setAchievementCompleted', 'speedRaw-step-input');
            await store.dispatch('setAchievementCompleted', 'download-data');
            await store.dispatch('setTotalTime', 0);
            await store.dispatch('loadPrompts', []);


            prompt.hidden = false;  
            expect(store.getters.getAvailablePrompts).toContainEqual(prompt);
        
        })

        test('1st prompt fails if an achievement is missing', async () => {

            const store = createVuexStore();
            const wrapper = mount(Prompts, {
            global:{
                plugins: [store]
                }
            });

            const prompt = {name:'data_analysis', verbose:'Data analysis', mainText:'Which component is best for analysing data?', options:['graph', 'snapshot', 'table', 'download'], hidden: true, response: '', completed: false, type: 'select', count: 0}
            await store.dispatch('setSurveyConsent', true);
            await store.dispatch('setAchievementCompleted', 'speedRaw-step-input');
            // await store.dispatch('setAchievementCompleted', 'download-data');
            await store.dispatch('setTotalTime', 0);
            await store.dispatch('loadPrompts', []);


            prompt.hidden = false;  
            expect(store.getters.getAvailablePrompts).not.toContainEqual(prompt);
        
        })
    })


    describe('download_data test', () => {

        test('1st prompt', async () => {

            const store = createVuexStore();
            const wrapper = mount(Prompts, {
            global:{
                plugins: [store]
                }
            });

            const wrapper2 = mount(DataRecorder, {
                global:{
                    plugins: [store]
                    }
                });

            const prompt = {name:'download_data', verbose:'Have you downloaded your data', mainText:'Remember to download your results for offline analysis', hidden: true, response: '', completed: false, type: 'prompt', count: 0}
            await store.dispatch('setSurveyConsent', true);
            
            await store.dispatch('setTotalTime', 0);
            await store.dispatch('loadPrompts', []);

            await wrapper2.find('#clearButton').trigger('click');
            await wrapper2.find('#resetmodalclear').trigger('click');


            prompt.hidden = false;  
            expect(store.getters.getAvailablePrompts).toContainEqual(prompt);
        
        })

        
    })

    describe('rate_customise test', () => {

        test('1st prompt', async () => {

            const store = createVuexStore();
            const wrapper = mount(Prompts, {
            global:{
                plugins: [store]
                }
            });

            const wrapper2 = mount(Achievements, {
                global:{
                    plugins: [store]
                    }
                });

            const prompt = {name:'rate_customise', verbose:'Customising the UI', mainText:'Rate your agreement with the statement: I am happy with the level of customisation possible on the UI ', minScale:'Strongly disagree', maxScale:'Strongly agree', hidden: true, response: '', completed: false, type: 'likert', count: 0}
            await store.dispatch('setSurveyConsent', true);
            
            await store.dispatch('setTotalTime', 0);
            await store.dispatch('loadPrompts', []);

            await store.dispatch('setAchievementCompleted', 'custom-ui');


            prompt.hidden = false;  
            expect(store.getters.getAvailablePrompts).toContainEqual(prompt);
        
        })

        
    })


    describe('ueq_attractiveness test', () => {

        test('1st prompt', async () => {

            const store = createVuexStore();
            const wrapper = mount(Prompts, {
            global:{
                plugins: [store]
                }
            });

            const wrapper2 = mount(DataRecorder, {
                global:{
                    plugins: [store]
                    }
                });

                
            const prompt = {name:'ueq_attractiveness', verbose:'Attractiveness rating', mainText:'Please rate your experience on the following scales:', minScale:['annoying', 'bad', 'unlikeable', 'unpleasant', 'unattractive', 'unfriendly'], maxScale:['enjoyable', 'good', 'pleasing', 'pleasant', 'attractive', 'friendly'], hidden: true, response: [], completed: false, type: 'likert_multiple', count: 0}
            await store.dispatch('setSurveyConsent', true);

            //ensure there is over 100 data points for the prompts to work
            const datum = {id: 1, t: 1, theta: 1, omega: 1, command: 1, drive: 1, error: 1}
            const data = Array(101).fill(datum);
            for(let i=0;i<101;i++){
                await store.dispatch('addData', data[i]);
            }
            
            
            await store.dispatch('setTotalTime', 1800001);
            await store.dispatch('loadPrompts', []);

            wrapper2.find('#outputButton').trigger('click');


            prompt.hidden = false;  
            expect(store.getters.getAvailablePrompts).toContainEqual(prompt);
        
        })
    })