import Vue from 'vue';
//import Vuex from 'vuex';
//import userDataStore from './userDataStore';
//import router from './router';
//Vue.use(Vuex);

import App from './App.vue'
//import Login from './components/Login.vue';
import "bootstrap/dist/css/bootstrap.min.css";
import BootstrapVue from 'bootstrap-vue';

export const eventBus = new Vue();
import 'es6-promise/auto'

Vue.config.productionTip = false

Vue.use(BootstrapVue)

import 'bootstrap-vue/dist/bootstrap-vue.css'


    


new Vue({
  //making the store accessible across the full app
  //userDataStore: userDataStore,
  //router,
  render: h => h(App),
}).$mount('#app')
