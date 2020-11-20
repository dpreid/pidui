<template>
<div id='login'>
  <form class="login" @submit.prevent="login">
     <h1>Sign in</h1>
     <label>Email</label>
     <input required v-model="email" type="email" placeholder="Name"/>
     <hr/>
     <button type="submit">Login</button>
   </form>
</div>
</template>

<script>
//import { userData } from "../store.js";
//import { eventBus } from "../main.js";
import userStore from '../userDataStore';

export default {

  name: 'Login',
  data () {
    return {
        email : "",
    }
  },
  components: {
    
  },
  computed:{
      
  },
  created(){
      //window.indexedDB.deleteDatabase('db');      //for testing, to delete database
      userStore.dispatch('autoLogin');
  },
  methods: {
      login() {
        let email = this.email
        userStore.dispatch('login', { email })
       //.then(() => this.$router.push('/app'))
       .catch(err => console.log(err))
      }
  }
}
</script>

<style scoped>


</style>