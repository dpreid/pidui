<template>
  <div class="rasa-bot">
    <div class='d-flex'>
        <ul class="navbar-nav dropstart">
            
            <li class="nav-item dropdown">
            <button type='button' class='btn primary-colour dropdown-toggle' id='prompts-button' data-bs-toggle="dropdown" data-bs-auto-close="false" aria-expanded="false" @click='setPromptUpdate(false)'>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-chat-left-dots" viewBox="0 0 16 16">
                    <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                    <path d="M5 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                </svg>
                <span v-if='getPromptUpdated' class="badge rounded-pill bg-danger" id='prompt-notification' role="status" aria-hidden="false">{{ messageCount }}<span class="visually-hidden">unread messages</span></span>
            </button>
        
        <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownMenuClickable">
  
            <chat-widget :message_list="getMessageList" :message_count="messageCount" @onMessageSent="handleMessageSent" class='m-3' @click.stop/>
            
        </ul>
    </li>

        </ul>




        
    </div>

    </div>
</template>

<script>
import ChatWidget from "./ChatWidget.vue";
import { mapActions, mapGetters } from 'vuex';


//import axios from 'axios';

export default {
  name: 'RasaBot',
  components: {
    ChatWidget,
  },
  props: {
    
  },
  data () {
        return {
            // message_list: [],   //message template {sender:'student_bot', body:'Hi. I am student bot'}
        }
    },
    mounted(){
      this.triggerIntent('greet');
      
    },
  computed:{
        ...mapGetters([
            'getAvailablePrompts',
            'getPromptUpdated',
            'getMessageList',
            'getPrompts',
            'getLogHardware',
            'getPromptByName',
            'getAchievementByName',
            'getLogTotalTime'
        ]),
        messageCount(){
          return this.getMessageList.length;
        }
    },
    watch:{
       messageCount(val){
      //   //once bot receives a message from the server - the initial greeting
        if(val < 2){
          this.triggerPrompts();
        }
          
       }
    },
    methods:{
        ...mapActions([
            'setPromptUpdate',
            'setPromptResponse',
            'sendToBot',
            'triggerIntent'
        ]),
        handleMessageSent(message){
          this.sendToBot(message);
        },
        triggerPrompts(){
            let total_session_time = this.getLogTotalTime;
            let prompt_rate = this.getPromptByName('PROMPT_rate_experience');
            let prompt_ui = this.getPromptByName('PROMPT_rate_ui');
            let prompt_box = this.getPromptByName('PROMPT_rate_box');
            let prompt_improvements = this.getPromptByName('PROMPT_comment_improvements');
            let prompt_achievements = this.getPromptByName('PROMPT_achievements_attempted');
            let prompt_explore = this.getPromptByName('PROMPT_explore_components');
            let prompt_layout = this.getPromptByName('PROMPT_move_components');

            if((prompt_rate.count == 0 && total_session_time > 1800000) || (prompt_rate.count == 1 && total_session_time > 3600000) || (prompt_rate.count == 2 && total_session_time > 5400000)){
              this.triggerIntent('PROMPT_rate_experience');
            } 
            else if(this.getAchievementByName('positionPid-ramp-input').completed && prompt_ui.count < 2 && total_session_time > 600000){
              this.triggerIntent('PROMPT_rate_ui');
            } 
            else if(this.getAchievementByName('box-chat').completed && prompt_box.count < 2 && total_session_time > 1200000){
              this.triggerIntent('PROMPT_rate_box');
            }
            else if(this.getAchievementByName('custom-ui').completed && prompt_improvements.count < 2 && total_session_time > 2400000){
              this.triggerIntent('PROMPT_comment_improvements');
            }
            else if(this.$store.getters.getAchievementsCompleted.length < 5 && prompt_achievements.count < 1 && total_session_time > 900000){
              this.triggerIntent('PROMPT_achievements_attempted');
            }
            else if(this.getAchievementByName('open-all').completed == false && prompt_explore.count < 2 && total_session_time > 300000){
              this.triggerIntent('PROMPT_explore_components');
            }
            else if(this.getAchievementByName('custom-ui').completed == false && prompt_layout.count < 2 && total_session_time > 480000){
              this.triggerIntent('PROMPT_move_components');
            }
            
        },
    
      }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#prompt-notification{
  position: absolute;
  top: 100;
  right: 0;
}
</style>
