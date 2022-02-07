//Not currently used - replaced by RasaBot component


<template>
    <li class="nav-item dropdown">
        <button type='button' class='btn primary-colour dropdown-toggle' id='prompts-button' data-bs-toggle="dropdown" data-bs-auto-close="false" aria-expanded="false" @click='setPromptUpdate(false)'>
                <svg xmlns="http://www.w3.org/2000/svg" id='promptsmenubutton' width="32" height="32" fill="currentColor" class="bi bi-chat-left-dots" viewBox="0 0 16 16">
                    <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                    <path d="M5 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                </svg>
                <span v-if='getPromptUpdated' class="badge rounded-pill bg-danger" id='prompt-notification' role="status" aria-hidden="false">{{ getNewPromptCount }}<span class="visually-hidden">unread messages</span></span>
            </button>
        
        <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownMenuClickable">
            <li><h4 class='text-muted text-center'>Survey questions</h4></li>
            <div v-if='getAvailablePrompts.length > 0'>
                <li v-for='item in getAvailablePrompts' :key='item.verbose' class='dropdown-item' @click.stop>
                    
                    <button class="btn btn-primary m-2" type="button" data-bs-toggle="collapse" :data-bs-target="'#collapse' + item.name" aria-expanded="false" aria-controls="collapseExample">
                        {{item.verbose}}
                    </button>
                    <div class="collapse" :id="'collapse' + item.name">
                        <div class="card bg-secondary m-2" style="min-width: 20rem">
                            
                            <div class='card-header'>
                                <h5>{{item.mainText}}</h5>
                            </div>
                            <!-- Likert style prompt questions -->
                            <div v-if='item.type == "likert"' class="card-body text-center row m-2">
                                <p class='col-3'>{{item.minScale}}</p>
                                <div class='col-6 text-center form-check'>
                                    <input type='radio' :id='item.name + "check1"' class='form-check-input radio-inline ms-2 me-2' value='-2' @change='updateResponse(item, item.name + "check1")'>
                                    <input type='radio' :id='item.name + "check2"' class='form-check-input radio-inline ms-2 me-2' value='-1' @change='updateResponse(item, item.name + "check2")'>
                                    <input type='radio' :id='item.name + "check3"' class='form-check-input radio-inline ms-2 me-2' value='0' @change='updateResponse(item, item.name + "check3")'>
                                    <input type='radio' :id='item.name + "check4"' class='form-check-input radio-inline ms-2 me-2' value='1' @change='updateResponse(item, item.name + "check4")'>
                                    <input type='radio' :id='item.name + "check5"' class='form-check-input radio-inline ms-2 me-2' value='2' @change='updateResponse(item, item.name + "check5")'>
                                </div>
                                <p class='col-3'>{{item.maxScale}}</p>
                            </div>
                            <!-- Open text response -->
                            <div v-if='item.type == "text"' class="card-body text-center row m-2">
                                <div class='col-12 text-center'>
                                    <div class="input-group">
                                        <span class="input-group-text">Response</span>
                                        <textarea class="form-control" :id='item.name + "textinput"' value='' aria-label="Text input"></textarea>
                                        <button class='btn btn-primary m-2' type='button' id='submit-text' @click='updateResponse(item, item.name + "textinput")'>Submit</button>
                                    </div>
                                </div>
                            </div>
                            <!-- Calculation -->
                            <div v-if='item.type == "calc"' class="card-body text-center m-2">
                                <div class='text-center'>
                                    <div class="input-group">
                                        <span class="input-group-text">Answer</span>
                                        <input type='text' class="form-control" :id='item.name + "calcinput"' value='' aria-label="answer">
                                        <button class='btn btn-primary m-2' type='button' id='submit-answer' @click='updateResponse(item, item.name + "calcinput")'>Submit</button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    

                </li>
            </div>
            <div v-else>
                <div class="card" style="min-width: 20rem">
                    <div class='card-header'>
                        <h5>No tasks to complete.</h5>
                    </div>
                </div>
            </div>
            
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
            'getAvailablePrompts',
            'getPromptUpdated',
            'getNewPromptCount',
            'getLogTotalTime',
            'getPromptByName',
        ]),
        
    },
    methods:{
        ...mapActions([
            'setPromptUpdate',
            'setPromptResponse',
            'showPrompt'
        ]),
        updateResponse(prompt, input_id){
            let payload = {name: prompt.name, response: document.getElementById(input_id).value}
            this.setPromptResponse(payload);
            
        },
        triggerPrompts(){
            let total_session_time = this.getLogTotalTime;
            let prompt_rate = this.getPromptByName('rate_experience');
            let prompt_ui = this.getPromptByName('rate_ui');
            let prompt_box = this.getPromptByName('rate_box');
            let prompt_improvements = this.getPromptByName('comment_improvements');
            let prompt_explore = this.getPromptByName('explore_components');
            let prompt_layout = this.getPromptByName('move_components');

            if((prompt_rate.count == 0 && total_session_time > 1800000) || (prompt_rate.count == 1 && total_session_time > 3600000) || (prompt_rate.count == 2 && total_session_time > 5400000)){
              this.showPrompt('rate_experience');
            } 
            else if(prompt_ui.count < 2 && total_session_time > 600000){
              this.showPrompt('rate_ui');
            } 
            else if(prompt_box.count < 2 && total_session_time > 1200000){
              this.showPrompt('rate_box');
            }
            else if(prompt_improvements.count < 2 && total_session_time > 2400000){
              this.showPrompt('comment_improvements');
            }
            else if(prompt_explore.count < 2 && total_session_time > 300000){
              this.showPrompt('explore_components');
            }
            else if(prompt_layout.count < 2 && total_session_time > 480000){
              this.showPrompt('move_components');
            }
            
        },
    }
}
</script>

<style scoped>
#prompt-notification{
  position: absolute;
  top: 100;
  right: 0;
}
</style>