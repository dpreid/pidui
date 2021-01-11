<template>
<div class='m-2 p-2 bg-white border rounded'>
    <unity src="/Build/MotorSimulationBuild.json" width="1000" height="600" unityLoader="/Build/UnityLoader.js"></unity>
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

        }
    },
    created(){
		
	},
	mounted(){
		

	},
}


</script>

<style scoped>

</style>