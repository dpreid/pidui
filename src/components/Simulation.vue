<template>
<div class='m-2 p-2 bg-white border rounded'>
    <unity src="/Build/MotorSimulationBuild.json" width="1000" height="600" unityLoader="/Build/UnityLoader.js" ref="myInstance"></unity>
    <p>{{unityData}}</p>
</div>
</template>

<script>

//import { eventBus } from "../main";
import Unity from 'vue-unity-webgl';
  

export default {
    name: "Simulation",
    components: {
        Unity,
    },
    data(){
        return{
            unityData: '',
        }
    },
    computed:{
        
    },
    watch:{
        
    },
    created(){
		window.addEventListener('unitydata', (e) => this.getUnityData(e.detail))
	},
	mounted(){
		

    },
    methods: {
        getUnityData(data){
            console.log('data received from unity = ' + data.omega);
        }
    }
}


</script>

<style scoped>

</style>