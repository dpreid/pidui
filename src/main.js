import Vue from 'vue'
import App from './App.vue'
import "bootstrap/dist/css/bootstrap.min.css";
import BootstrapVue from 'bootstrap-vue';
export const eventBus = new Vue();

Vue.config.productionTip = false

Vue.use(BootstrapVue)

import 'bootstrap-vue/dist/bootstrap-vue.css'

new Vue({
  render: h => h(App),
}).$mount('#app')
