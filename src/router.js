import Vue from 'vue'
import Router from 'vue-router'
//import userDataStore from './userDataStore.js';
import App from './App.vue'
import Login from './components/Login.vue'


Vue.use(Router)

let router = new Router({
    mode: 'history',
    routes: [
      {
        path: '/app',
        name: 'App',
        component: App
      },
      {
        path: '/',
        name: 'login',
        component: Login
      },
    ]
  })
  
  export default router