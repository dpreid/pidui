<template>
    <li class="nav-item dropdown">
        <button type='button' class='btn btn-primary dropdown-toggle' id='achievements-button' data-bs-toggle="dropdown" aria-expanded="false" @click='setPromptUpdate(false)'>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-briefcase" viewBox="0 0 16 16">
                <path d="M6.5 1A1.5 1.5 0 0 0 5 2.5V3H1.5A1.5 1.5 0 0 0 0 4.5v8A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 14.5 3H11v-.5A1.5 1.5 0 0 0 9.5 1h-3zm0 1h3a.5.5 0 0 1 .5.5V3H6v-.5a.5.5 0 0 1 .5-.5zm1.886 6.914L15 7.151V12.5a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5V7.15l6.614 1.764a1.5 1.5 0 0 0 .772 0zM1.5 4h13a.5.5 0 0 1 .5.5v1.616L8.129 7.948a.5.5 0 0 1-.258 0L1 6.116V4.5a.5.5 0 0 1 .5-.5z"/>
            </svg>
            <span v-if='getPromptUpdated' class="spinner-grow spinner-grow-sm text-danger position-absolute top-10 start-80 translate-middle" role="status" aria-hidden="true"></span>
        </button>
        
        <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarDropdown2">
            <li><h4 class='text-muted text-center'>Tasks</h4></li>
            <li v-for='item in getPrompts' :key='item.name' class='dropdown-item'>
                <div class='form-check'>
                    <label :for="item.name" class="form-label">{{item.verbose}}</label>
                    <input class="form-check-input" type="checkbox" value="" :id="item.name" :checked='item.completed' disabled>
                </div>

            </li>
            
        </ul>
    </li>

</template>

<script>
import { mapGetters } from 'vuex';
import { mapActions } from 'vuex';

export default {
    name: 'Prompts',
    data () {
        return {
        
        }
    },
    computed:{
        ...mapGetters([
            'getPrompts',
            'getPromptUpdated'
        ]),
    },
    methods:{
        ...mapActions([
            'setPromptUpdate',
        ]),
    }
}
</script>

<style>

</style>