import Vue from 'vue'

import App from './App.vue'
import "bootstrap/dist/css/bootstrap.min.css";
import BootstrapVue from 'bootstrap-vue';

export const eventBus = new Vue();
import 'es6-promise/auto'

Vue.config.productionTip = false

Vue.use(BootstrapVue)

import 'bootstrap-vue/dist/bootstrap-vue.css'

import store from '@/store';
    
//data object structure
// {
//     id: 1,
//      t: 0,
//       theta: 0,        //in rads
//       omega: 0,        //in rad/s
//   },

new Vue({
  //making the store accessible across the full app
  store,
  render: h => h(App),
}).$mount('#app')