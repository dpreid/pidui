import Vue from 'vue';

import App from './App.vue'
import store from "./streamStore.js";
import "bootstrap/dist/css/bootstrap.min.css";
import BootstrapVue from 'bootstrap-vue';

export const eventBus = new Vue();
import 'es6-promise/auto'

Vue.config.productionTip = false

Vue.use(BootstrapVue)

import 'bootstrap-vue/dist/bootstrap-vue.css'



new Vue({
  store: store,
  render: h => h(App),
}).$mount('#app')

