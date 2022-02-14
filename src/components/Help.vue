

<template>
<transition name='fade'>
    <div class="modal" id='help-modal' tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content text-start">
            <div class="modal-header">
              <h5 class="modal-title">Help</h5>
              <button type="button" class="btn btn-close" aria-label="Close" @click='this.$emit("togglehelp")'>
                
              </button>
            </div>
            <div class="modal-body">
              
                <h4>Customise the UI</h4>
                <p>Dashed borders represent the slots for components. You can drag a component from one slot to another to switch their positions. You are best 
                    to click and drag just inside the border of the component you want to move.
                </p>

                <h4>Add UI tools</h4>
                <p>You can select new UI tools to add to the screen from the Menu dropdown. Remove them by selcting the tool from the Menu bar again.
                </p>

                <h4>Recording more than 5000 data points</h4>
                <p>For smooth running of the web app there is a limit of 5000 recorded data points. Please download this dataset or perform the necessary analysis
                    and then reset the data and run again in order to collect more data.
                </p>

                <h4>Report issues</h4>
                <p>If you have any problems with the remote laboratory then you can contact us at support@practable.io
                </p>
              
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-danger" id='close-help-button' @click='this.$emit("togglehelp")'>Close</button>
            </div>
          </div>
        </div>
      </div>
</transition>
</template>

<script>
import { mapGetters } from 'vuex';
export default {

  name: 'Help',
  emits:['togglehelp'],
  data () {
    return {
        
    }
  },
  components: {
    
  },
  computed:{
     ...mapGetters([
         
     ])
  },
  watch:{
      
  },
  created(){
      
  },
  mounted(){
      

  },
  methods: {
      
      
  }
}
</script>

<style scoped>
#help-modal{
  display: block;
  
}

/* Important part */
.modal-dialog{
    overflow-y: initial !important
}
.modal-body{
    height: 50vh;
    overflow-y: scroll;
}

</style>