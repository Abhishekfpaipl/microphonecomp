<template>
  <div class="container mt-5">
    <div class="d-flex justify-content-center">
      <vue-audio-recorder v-model="isRecording" @audio-recorded="onRecorded" />
    </div>
    <div class="d-flex justify-content-center mt-3">
      <button class="btn btn-primary me-2" @mousedown="startRecording" @mouseup="stopRecording">Hold to Record</button>
      <button class="btn btn-success" @click="sendAudio" :disabled="!audioBlob">Send Audio</button>
    </div>
  </div>
</template>

<script>
import { VueAudioRecorder } from 'vue-audio-recorder';
// import axios from 'axios';

export default {
  components: {
    VueAudioRecorder,
  },
  data() {
    return {
      isRecording: false,
      audioBlob: null,
      recorderRef: null,
    };
  },
  methods: {
    startRecording() {
      this.isRecording = true;
      this.recorderRef.startRecording();
    },
    stopRecording() {
      this.isRecording = false;
      this.recorderRef.stopRecording();
    },
    sendAudio() {
      if (this.audioBlob) {
        console.log('Sending audio:', this.audioBlob);
        // Simulate sending audio to the server using Axios
        // axios.post('/your-server-endpoint', { audio: this.audioBlob });
      }
    },
    onRecorded(audioBlob) {
      this.audioBlob = audioBlob;
    },
  },
};
</script>

<style scoped>
/* Your styles here */
</style>
