//Not currently used - merged with Achievements.

<template>
    <li class="nav-item dropdown">
        <button type='button' class='btn btn-primary dropdown-toggle' id='checklist-button' data-bs-toggle="dropdown" aria-expanded="false" @click='setChecklistUpdate(false)'>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-clipboard-check" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
            </svg>
            <span v-if='getChecklistUpdated' class="spinner-grow spinner-grow-sm text-danger position-absolute top-10 start-80 translate-middle" role="status" aria-hidden="true"></span>
        </button>
        
        <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarDropdown2">
            <li><h4 class='text-muted text-center'>Checklist</h4></li>
            <li v-for='item in getChecklist' :key='item.name' class='dropdown-item'>
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
    name: 'Checklist',
    data () {
        return {
        
        }
    },
    computed:{
        ...mapGetters([
            'getChecklist',
            'getChecklistUpdated'
        ]),
    },
    methods:{
        ...mapActions([
            'setChecklistUpdate',
        ]),
    }
}
</script>

<style>

</style>