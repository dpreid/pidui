//Vue3 updated

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
                <img v-if='getCurrentMode == "positionPid"' id="pidTransferFunction" src="../../public/images/plantTransferSecondOrder.png">
                <img v-else id="pidTransferFunction" src="../../public/images/plantTransferFirstOrder.png">
            </div>
        </div>
        
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: "SystemDiagrams",
    props:{
      
  },
    data(){
        return{
        
        }
    },
    computed:{
        ...mapGetters([
            'getCurrentMode'
        ])

    }
}


</script>

<style scoped>
img{
    max-width: 100%;
    max-height: auto;
}

</style>