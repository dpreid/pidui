<template>
<!--
    <li class="nav-item dropdown">
        <button type='button' class='btn btn-primary dropdown-toggle' id='achievements-button' data-bs-toggle="dropdown" aria-expanded="false">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-file-earmark-bar-graph" viewBox="0 0 16 16">
                <path d="M10 13.5a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-6a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v6zm-2.5.5a.5.5 0 0 1-.5-.5v-4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-1zm-3 0a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-1z"/>
                <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/>
            </svg>
            <span v-if='getLoggingUpdated' class="spinner-grow spinner-grow-sm text-danger position-absolute top-10 start-80 translate-middle" role="status" aria-hidden="true"></span>
        </button>
        
        <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarDropdown2">
            <li><h4 class='text-muted text-center'>Logging</h4></li>
            <li><p>Number of clicks: {{ getNumClicks() }}</p></li>
        </ul>
    </li>
-->
<div id='logging'>

</div>
</template>

<script>
import { mapGetters } from 'vuex';
import { mapActions } from 'vuex';

export default {
    name: 'Logging',
    props: {
        url: String,   
    },
    data () {
        return {
            logSocket: null,
        }
    },
    mounted(){
        
        
    },
    watch:{
        url(){
			try{
				if(this.url != '' && this.getLogURLObtained){
					this.connect();								
				} else{
					console.log('disconnecting: ' + this.url);
				}
			} catch(e){
				console.log(e);
			}
		},
    },
    computed:{
        ...mapGetters([
            'getLogURLObtained',
            'getLogStart',
            'getLogClicks',
            'getLogParameters',
            'getLogTotalTime',
            'getPromptByName',
            'getPrompts',
            'getAchievementByName',
            
        ]),

    },
    methods:{
        ...mapActions([
            'logClick',
            'logStart',
            'logEnd',
            'triggerIntent'
        ]),
        initialLogging(){
            this.logStart({log:'start', data: Date.now()});

            window.onclick = (event) => {
                let data = {target: event.target, screen_pos: {x: event.clientX, y: event.clientY}}
                this.logClick({log:'click', data:data});
            }

            window.addEventListener('pagehide', () => {this.logEnd({log:'end', data: Date.now()})});				//closing window
            window.addEventListener('beforeunload', () => {this.logEnd({log:'end', data: Date.now()})});			//refreshing page, changing URL
        },
        getNumClicks(){
            return this.getLogClicks.length;
        },
        connect(){
            let _store = this.$store;

			this.logSocket = new WebSocket(this.url);
			_store.dispatch('setLogSocket', this.logSocket);
            
            this.logSocket.onopen = () => {
				console.log('log connection opened at ', this.url);
                this.initialLogging();
			};
        }
    }
}
</script>

<style>

</style>