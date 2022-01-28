//Should popup as a modal on App mount if no consent is stored in localStorage or if consent is false - giving students another chance to change their mind. 
// Updates the consent_given variable in logging.js store and saves to localStorage.
//When a choice is made a UUID is generated and stored in logging.js store
//This will make the App.vue component no longer render the consent modal.

<template>
<transition name='fade'>
    <div class="modal" id='consent-modal' tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Study participation</h5>
              <!-- <button type="button" class="btn btn-close" aria-label="Close">
                
              </button> -->
            </div>
            <div class="modal-body">
              <p> This remote laboratory is being used as part of a study on how we can better design remote lab experiences for students.</p>
              <p> All interactions with the app are completely anonymous, but we store a randomly generated username in order to perform data analytics.</p>
              <p> A lot of time and effort goes into developing these remote laboratories for your education, so we please ask that you participate in this study in order
                  to help out the researchers.
              </p>
              <p>In order to function, the web app needs to store information in your local storage - if you do not consent then none of this data will be logged or available to the 
                  researchers.
              </p>
              <p><a href=''>Here is a link to the project information sheet.</a></p>
              <p> Are you happy to take part in the study?</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" id='consent-yes-button' @click="consent(true)">Yes</button>
              <button type="button" class="btn btn-danger" id='consent-no-button' data-dismiss="modal" data-bs-dismiss="modal" @click='consent(false)'>No</button>
            </div>
          </div>
        </div>
      </div>
</transition>
</template>

<script>
import { mapGetters } from 'vuex';
export default {

  name: 'Consent',
  emits:['consentSet'],
  data () {
    return {
        
    }
  },
  components: {
    
  },
  computed:{
     ...mapGetters([
         'getUsesLocalStorage'
     ])
  },
  watch:{
      
  },
  created(){
      
  },
  mounted(){
      

  },
  methods: {
      consent(set){
          this.$store.dispatch('setConsent', set);
          if(this.getUsesLocalStorage){
              window.localStorage.setItem('remote-lab-consent', set);
          }
          

          this.$emit('consentSet');
          
      }
      
  }
}
</script>

<style scoped>
#consent-modal{
  display: block;
  
}

</style>