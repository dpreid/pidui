<template>
    <li class="nav-item dropdown">
        <button type='button' :class='getAlertClass' id='checklist-button' data-bs-toggle="dropdown" aria-expanded="false" @click='setUpdate(false)'>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-card-list" viewBox="0 0 16 16">
                <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z"/>
                <path d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 5 8zm0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zM4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z"/>
            </svg>
        </button>
        <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarDropdown2">
            
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
            'getUpdated'
        ]),
        getAlertClass(){
            if(this.getUpdated){
                return 'btn btn-warning dropdown-toggle'
            } else{
                return 'btn btn-primary dropdown-toggle'
            }
        }
    },
    methods:{
        ...mapActions([
            'setUpdate',
        ]),
    }
}
</script>

<style>

</style>