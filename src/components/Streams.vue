<template>
  <div>
    <div><webcam-stream /></div>
    <!-- <div v-if="remoteLabVersion == 'variable_governor'"><control-panel-variable-governor :remoteLabVersion="remoteLabVersion" :isDataRecorderOn="isDataRecorderOn" :disableTooltips="disableTooltips"/></div>
    <div v-else-if="remoteLabVersion == 'spinning_disk'"><control-panel-spinning-disk :remoteLabVersion="remoteLabVersion" :isDataRecorderOn="isDataRecorderOn" :disableTooltips="disableTooltips"/></div>
    <div v-else-if="remoteLabVersion == 'robot_arm'"><control-panel-robot-arm :remoteLabVersion="remoteLabVersion" :isDataRecorderOn="isDataRecorderOn" :disableTooltips="disableTooltips"/></div> -->
    <div><data-stream :remoteLabVersion="remoteLabVersion" :isDataRecorderOn="isDataRecorderOn" :disableTooltips="disableTooltips"/></div>
</div>
</template> 

<script>
import WebcamStream from "./WebcamStream.vue";
// import ControlPanelRobotArm from "./ControlPanelRobotArm.vue";
// import ControlPanelSpinningDisk from "./ControlPanelSpinningDisk.vue";
// import ControlPanelVariableGovernor from "./ControlPanelVariableGovernor.vue";
import DataStream from "./DataStream.vue";

export default {
  name: "Streams",
  props:{
    remoteLabVersion: String,
    isDataRecorderOn: Boolean,
    disableTooltips: Boolean,
  },
  components: {
    WebcamStream,
    DataStream,
    // ControlPanelRobotArm,
    // ControlPanelSpinningDisk,
    // ControlPanelVariableGovernor,
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
      console.log("getting videpo stream");
      console.log(this.$store.getters.getStream("video"));
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
      let streams = query.get('streams');
      let decodedStreams = JSON.parse(decodeURIComponent(String(streams)));

      this.$store.dispatch("setStreams", decodedStreams);
    } catch (e) {
      console.log("error decoding streams");
      this.$store.dispatch("deleteStreams");
    }
  },
  watch: {
    
  },
};

</script>