import { createApp } from 'vue'
import { Vue3Mq } from "vue3-mq";
import store from "./store.js";
import App from './App.vue'

import 'bootstrap';
//import "bootstrap/dist/js/bootstrap.bundle.js";
import "bootstrap/dist/css/bootstrap.min.css";
import 'es6-promise/auto'


const app = createApp(App)
app.use(Vue3Mq, {
    preset: 'bootstrap5'
});
app.use(store)
app.mount('#app')
