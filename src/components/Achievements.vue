<template>
    <li class="nav-item dropdown">
        <button type='button' class='btn primary-colour dropdown-toggle' id='achievements-button' data-bs-toggle="dropdown" aria-expanded="false" @click='setAchievementUpdate(false)'>
            <svg xmlns="http://www.w3.org/2000/svg" id='achievementsmenubutton' width="32" height="32" :fill="getFillColour" class="bi bi-award" viewBox="0 0 16 16">
                <path d="M9.669.864 8 0 6.331.864l-1.858.282-.842 1.68-1.337 1.32L2.6 6l-.306 1.854 1.337 1.32.842 1.68 1.858.282L8 12l1.669-.864 1.858-.282.842-1.68 1.337-1.32L13.4 6l.306-1.854-1.337-1.32-.842-1.68L9.669.864zm1.196 1.193.684 1.365 1.086 1.072L12.387 6l.248 1.506-1.086 1.072-.684 1.365-1.51.229L8 10.874l-1.355-.702-1.51-.229-.684-1.365-1.086-1.072L3.614 6l-.25-1.506 1.087-1.072.684-1.365 1.51-.229L8 1.126l1.356.702 1.509.229z"/>
                <path d="M4 11.794V16l4-1 4 1v-4.206l-2.018.306L8 13.126 6.018 12.1 4 11.794z"/>
            </svg>
            <span v-if='getAchievementUpdated' class='badge rounded-pill bg-danger' id='achievement-notification' role="status" aria-hidden="true">{{ getNewAchievementCount }}<span class="visually-hidden">unread messages</span></span> 
        </button>
        
        <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarDropdown2">
            <li><h4 class='text-muted text-center'>Achievements</h4></li>
            
            <div class='d-flex row m-2 justify-content-center'>
            
                <div class='col-4 text-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="chocolate" class="bi bi-award" viewBox="0 0 16 16">
                        <path d="M9.669.864 8 0 6.331.864l-1.858.282-.842 1.68-1.337 1.32L2.6 6l-.306 1.854 1.337 1.32.842 1.68 1.858.282L8 12l1.669-.864 1.858-.282.842-1.68 1.337-1.32L13.4 6l.306-1.854-1.337-1.32-.842-1.68L9.669.864zm1.196 1.193.684 1.365 1.086 1.072L12.387 6l.248 1.506-1.086 1.072-.684 1.365-1.51.229L8 10.874l-1.355-.702-1.51-.229-.684-1.365-1.086-1.072L3.614 6l-.25-1.506 1.087-1.072.684-1.365 1.51-.229L8 1.126l1.356.702 1.509.229z"/>
                        <path d="M4 11.794V16l4-1 4 1v-4.206l-2.018.306L8 13.126 6.018 12.1 4 11.794z"/>
                    </svg>
                    <p>50%+</p>
                </div>
                
                <div class='col-4 text-center'>
                    
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="silver" class="bi bi-award" viewBox="0 0 16 16">
                        <path d="M9.669.864 8 0 6.331.864l-1.858.282-.842 1.68-1.337 1.32L2.6 6l-.306 1.854 1.337 1.32.842 1.68 1.858.282L8 12l1.669-.864 1.858-.282.842-1.68 1.337-1.32L13.4 6l.306-1.854-1.337-1.32-.842-1.68L9.669.864zm1.196 1.193.684 1.365 1.086 1.072L12.387 6l.248 1.506-1.086 1.072-.684 1.365-1.51.229L8 10.874l-1.355-.702-1.51-.229-.684-1.365-1.086-1.072L3.614 6l-.25-1.506 1.087-1.072.684-1.365 1.51-.229L8 1.126l1.356.702 1.509.229z"/>
                        <path d="M4 11.794V16l4-1 4 1v-4.206l-2.018.306L8 13.126 6.018 12.1 4 11.794z"/>
                    </svg>
                    <p>75%+</p>
                </div>

                <div class='col-4 text-center'>
                    
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="gold" class="bi bi-award" viewBox="0 0 16 16">
                        <path d="M9.669.864 8 0 6.331.864l-1.858.282-.842 1.68-1.337 1.32L2.6 6l-.306 1.854 1.337 1.32.842 1.68 1.858.282L8 12l1.669-.864 1.858-.282.842-1.68 1.337-1.32L13.4 6l.306-1.854-1.337-1.32-.842-1.68L9.669.864zm1.196 1.193.684 1.365 1.086 1.072L12.387 6l.248 1.506-1.086 1.072-.684 1.365-1.51.229L8 10.874l-1.355-.702-1.51-.229-.684-1.365-1.086-1.072L3.614 6l-.25-1.506 1.087-1.072.684-1.365 1.51-.229L8 1.126l1.356.702 1.509.229z"/>
                        <path d="M4 11.794V16l4-1 4 1v-4.206l-2.018.306L8 13.126 6.018 12.1 4 11.794z"/>
                    </svg>
                    <p>90%+</p>
                </div>
            </div>


            <li v-for='item in getAchievements' :key='item.name' class='dropdown-item'>
                <div v-if='item.completed' class='form-check'>
                    <label :for="item.name" class="form-label">{{item.verbose}}</label>
                    <input class="form-check-input" type="checkbox" value="" :id="item.name" :checked='item.completed' disabled>
                </div>
                <div v-else-if="!item.hidden" class='form-check'>
                    <label :for="item.name" class="form-label">{{item.verbose}}</label>
                    <input class="form-check-input" type="checkbox" value="" :id="item.name" :checked='item.completed' disabled>
                    <label v-if='"n" in item' :for="item.name" class="form-label"> {{ item.n}}/{{item.required}}</label>
                </div>
                <div v-else class='form-check'>
                    <label :for="item.name" class="form-label">Achievement Hidden &nbsp;</label>
                    <input class="form-check-input" type="checkbox" value="" :id="item.name" :checked='item.completed' disabled>
                    <label v-if='"n" in item' :for="item.name" class="form-label"> {{ item.n }}/{{ item.required }} </label>
                </div>

            </li>
            
        </ul>
    </li>

</template>

<script>
import { mapGetters } from 'vuex';
import { mapActions } from 'vuex';

export default {
    name: 'Achievements',
    data () {
        return {
        
        }
    },
    computed:{
        ...mapGetters([
            'getAchievements',
            'getAchievementUpdated',
            'getNewAchievementCount',
            'getAchievementByName'
        ]),
        getFillColour(){
            let count = 0;
            let total = this.getAchievements.length;
            this.getAchievements.forEach(achievement => {
                if(achievement.completed){
                    count += 1;
                }
            });
            let frac = count / total;
            if(frac >= 0.9){
                return 'gold';
            } else if(frac >= 0.75){
                return 'silver';
            } else if(frac >= 0.5){
                return 'chocolate';
            } else {
                return 'dark';
            }
            
        }
    },
    watch:{
        getAchievementUpdated(){
            if(this.getAchievementByName('custom-ui').completed && this.$store.getters.getPromptByName('rate_customise').count == 0){
                this.$store.dispatch('showPrompt', 'rate_customise');
            }
        }
    },
    methods:{
        ...mapActions([
            'setAchievementUpdate'
        ]),
    }
}
</script>

<style>
#achievement-notification{
  position: absolute;
  top: 100;
  right: 0;
}
</style>