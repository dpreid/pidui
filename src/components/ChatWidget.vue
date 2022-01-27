<template>
    <div id='chat-widget'>
        <div class="toast-container" id='message-container'>
            

            <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide='false'>
                <div class='toast-header'>
                    <strong class="me-auto">Box Chat</strong>
                </div>
            </div>



            <div v-for='message, index in message_list' :key='index' :id='index' >
                
                <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide='false'>
                
                    <!-- Message header -->
                    <div :class='getMessageClass(message.sender)'>
                        <!-- <img src="..." class="rounded me-2" alt="..."> -->
                        <strong class="me-auto">{{ message.sender }}</strong>
                        <small class="text-white">{{ message.time }}</small>
                        <!-- <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button> -->
                    </div>
                    <!-- Message body -->
                    <div class="toast-body">
                        <strong class="me-auto col-12">{{ message.text }}</strong>
                        <!-- <div id='response-buttons' class='col-12'>
                            <button class='btn btn-outline-primary' v-for='button in message.buttons' :key='button.title' @click='saveResponse(button.title)'>{{ button.title }}</button>
                        </div> -->
                    </div>

                </div>

            </div>

            <div id='bottom-container'></div>

        </div>

        <div class="input-group mt-3">
            <input type="text" class="form-control" v-model='user_input' @keydown.enter="sendMessage" placeholder="Type something" aria-label="Type something" aria-describedby="user-input">
            <button class="btn btn-secondary" type="button" id="user-input-submit" @click="sendMessage">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-send" viewBox="0 0 16 16">
                    <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"/>
                </svg>
            </button>
        </div>
    
    </div>

</template>

<script>



export default {
    name: 'ChatWidget',
    props:{
        message_list: Array,
        message_count: Number,
    },
    emits:['onMessageSent'],
    data () {
        return {
            user_input: '',
        }
    },
    computed:{
        
        
    },
    watch:{
        message_count(){
            let element = document.getElementById('bottom-container');
            element.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
        }
    },
    methods:{
        sendMessage(){
            this.$emit('onMessageSent', this.user_input);
            this.user_input = '';
            
        },
        getMessageClass(sender){
            if(sender == 'student_bot'){
                return 'toast-header bg-primary text-white'
            } else{
                return 'toast-header bg-info text-white'
            }
        },
        saveResponse(response){
            console.log(response);
        }
    }
}
</script>

<style scoped>
#message-container{
    overflow: scroll;
    max-height: 500px;
}

#bottom-container{
    min-height:100px;
}
</style>