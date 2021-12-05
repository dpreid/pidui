<template>
    <li class="nav-item dropdown">
        <button type='button' class='btn btn-primary dropdown-toggle' id='prompts-button' data-bs-toggle="dropdown" data-bs-auto-close="false" aria-expanded="false" @click='setPromptUpdate(false)'>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-briefcase" viewBox="0 0 16 16">
                <path d="M6.5 1A1.5 1.5 0 0 0 5 2.5V3H1.5A1.5 1.5 0 0 0 0 4.5v8A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 14.5 3H11v-.5A1.5 1.5 0 0 0 9.5 1h-3zm0 1h3a.5.5 0 0 1 .5.5V3H6v-.5a.5.5 0 0 1 .5-.5zm1.886 6.914L15 7.151V12.5a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5V7.15l6.614 1.764a1.5 1.5 0 0 0 .772 0zM1.5 4h13a.5.5 0 0 1 .5.5v1.616L8.129 7.948a.5.5 0 0 1-.258 0L1 6.116V4.5a.5.5 0 0 1 .5-.5z"/>
            </svg>
            <span v-if='getPromptUpdated' class="spinner-grow spinner-grow-sm text-danger position-absolute top-10 start-80 translate-middle" role="status" aria-hidden="true"></span>
        </button>
        
        <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownMenuClickable">
            <li><h4 class='text-muted text-center'>Tasks</h4></li>
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
            'getPromptUpdated'
        ]),
        
    },
    methods:{
        ...mapActions([
            'setPromptUpdate',
            'setPromptResponse'
        ]),
        updateResponse(prompt, input_id){
            let payload = {name: prompt.name, response: document.getElementById(input_id).value}
            this.setPromptResponse(payload);
            // this.setPromptCompleted(prompt.name);
            
        }
    }
}
</script>

<style>

</style>