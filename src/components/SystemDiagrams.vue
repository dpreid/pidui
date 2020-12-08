<template>
    <div class='m-2 p-2 bg-white border rounded'>
        <div class='row m-2 p-2'>
            <div class='col-12'>
                <h2>System Block Diagram</h2>
                <img id="secondOrderDiagram" src="../../public/images/secondOrderBlockDiagram.png">
            </div>
        </div>
        <div class='row m-2 p-2'>
            <div class='col-6'>
                <h2>Controller transfer function</h2>
                <img id="pidTransferFunction" src="../../public/images/pidTransferFunction.png">
            </div>
            <div class='col-6'>
                <h2>Plant transfer function</h2>
                <img v-if='remoteLabVersion == "variable_governor" || remoteLabVersion == "spinning_disk"' id="pidTransferFunction" src="../../public/images/plantTransferFirstOrder.png">
                <img v-else id="pidTransferFunction" src="../../public/images/plantTransferSecondOrder.png">
            </div>
        </div>
        
    </div>
</template>

<script>
//import { eventBus } from "../main";
//import { store } from "../store.js";

export default {
    name: "SystemDiagrams",
    props:{
      remoteLabVersion: String,
  },
    data(){
        return{
        
        }
    },
    created(){
    
    },
    methods:{
        
    },
    computed:{
        

    }
}


</script>

<style scoped>
img{
    max-width: 100%;
    max-height: auto;
}

</style>