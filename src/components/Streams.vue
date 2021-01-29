<template>
  <div>
    <div><webcam-stream /></div>
    <div><data-stream /></div>
</div>
</template> 

<script>
import WebcamStream from "./WebcamStream.vue";
import DataStream from "./DataStream.vue";

export default {
  name: "Streams",
  components: {
    WebcamStream,
    DataStream,
  },
  computed: {
    // id() {
    //   return this.$route.params.id;
    // },
    decodedStreams() {
      return this.$store.getters.getStreams;
    },
    streamsObtained() {
      return this.$store.getters.getStreamsObtained;
    },
    videoStream() {
      return this.$store.getters.getStream("video");
    },
    dataStream() {
      return this.$store.getters.getStream("data");
    },
  },
  mounted() {
    if (this.streamsObtained) {
      return;
    }
    try {
      let query = new URLSearchParams(window.location.search);
      //add the streams data to the store
      let streams = query.get('streams');
      let decodedStreams = JSON.parse(decodeURIComponent(String(streams)));

      this.$store.dispatch("setStreams", decodedStreams);
      //add expiry time data to store
      let expire_time = query.get('exp');
      this.$store.dispatch('setExpiryTime', expire_time);

    } catch (e) {
      console.log("error decoding streams");
      this.$store.dispatch("deleteStreams");
    }
  },
  watch: {
    
  },
};

</script>