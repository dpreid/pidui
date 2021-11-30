import { createStore } from 'vuex'
import streamStore from './modules/streamStore.js'
import dataStore from './modules/dataStore.js'
import uiStore from './modules/uiStore.js'
import commandStore from './modules/commandStore.js'
import checklistStore from './modules/checklistStore.js'
import achievementStore from './modules/achievementStore.js'

const store = createStore({
    modules:{
        stream: streamStore,
        data: dataStore,
        ui: uiStore,
        command: commandStore,
        checklist: checklistStore,
        achievement: achievementStore
    }
})

export default store;