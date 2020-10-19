<template>
    <div class="popup" :id="id" :style="{width:active_width, height:active_height}" @mouseover="popup_showing = true" @mouseleave="popup_showing = false">
        <span :id="id" class="popuptext" :class="popup_showing ? 'show' : ''"> 
            <slot></slot>
        </span>
    </div>
</template>

<script>
// import { store } from "../store.js";
// import { eventBus } from "../main.js";

export default {

  name: 'Tooltip',
  props:{
    active_height: String,
    active_width: String,  
    id: String,
  },
  data () {
    return {
       popup_showing: false,
    }
  },
  components: {
    
  },
  computed:{
    
  },
  methods: {
      
  }
}
</script>

<style scoped>
/* Popup container */
.popup {
  position: absolute;
  display: inline-block;
  cursor: pointer;
  z-index: 1;
  width: 100%;
  height:100%;
}

/* The actual popup (appears on top) */
.popup .popuptext {
  visibility: hidden;
  width: 300px;
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 8px 0;
  position: absolute;
  z-index: 1;
  top: 0%;
  bottom: auto;
  right: 50%;
  margin-left: -80px;
  opacity: 0.8;
}

/* Toggle this class when clicking on the popup container (hide and show the popup) */
.popup .show {
  visibility: visible;
  -webkit-animation: fadeIn 1s;
  animation: fadeIn 1s;
  animation-delay: 2s;
  transition-delay: 2s;
}

/* Add animation (fade in the popup) */
@-webkit-keyframes fadeIn {
  from {opacity: 0;}
  to {opacity: 0.8;}
}

@keyframes fadeIn {
  from {opacity: 0;}
  to {opacity:0.8 ;}
}
/* .popup .popuptext::after {
  content: "";
  position: absolute;
  top: -5px;
  right: 128%;
  bottom: auto;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #555 transparent transparent transparent;
} */
</style>