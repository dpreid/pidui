//vue3 update


<template>
<div class='m-2 p-2 bg-white border rounded'>
    <div v-if='isWorkspaceOn'>
      <p>Hotkeys:</p>
        <p>Press 'w' to swap between workspace (ruler and protractor tool) and the UI.</p>
        <p>Rotate a tool by holding 'o' and clicking and dragging it.</p>
        <p>Click 'Clear Workspace' in the navigation bar to remove the ruler and protractor.</p>
    </div>
</div>
</template>

<script>



export default {

  name: 'Instructions',
  props:{
      isWorkspaceOn: Boolean
  },
  data () {
    return {
       
    }
  },
  components: {
    
  },
  mounted(){
    
  },
  computed:{
      
  },
  methods: {
      
  }
}
</script>

<style scoped>


</style>