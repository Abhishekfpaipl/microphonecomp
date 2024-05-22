<template>
  <div>
    <button
      @mousedown="startRecording"
      @touchstart.prevent="startRecording"
      @mouseup="stopRecording"
      @touchend.prevent="stopRecording"
      class="btn btn-primary"
    >
      {{ recording ? 'Recording...' : 'Press and hold to record' }}
    </button>

    <audio v-if="audioPreview" controls class="mt-2">
      <source :src="audioPreview" type="audio/wav">
      Your browser does not support the audio element.
    </audio>

    <button v-if="audioPreview" @click="sendAudio" class="btn btn-success mt-2">
      Send Audio
    </button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      recording: false,
      audioPreview: null,
      recordedAudio: null,
      mediaRecorder: null,
      chunks: [],
    };
  },
  methods: {
    startRecording() {
      this.recording = true;
      this.recordedAudio = null;
      this.audioPreview = null;
      this.chunks = [];

      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          this.mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/wav' });

          this.mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              this.chunks.push(event.data);
            }
          };

          this.mediaRecorder.onstop = () => {
            const blob = new Blob(this.chunks, { type: 'audio/wav' });
            this.recordedAudio = blob;
            this.audioPreview = URL.createObjectURL(blob);
            // Save the recorded audio to localStorage
            localStorage.setItem('recordedAudio', this.audioPreview);
          };

          this.mediaRecorder.start();
        })
        .catch((error) => {
          console.error('Error accessing microphone:', error);
        });
    },
    stopRecording() {
      console.log('stop called')
      // if (this.recording && this.mediaRecorder) {
        this.mediaRecorder.stop();
        this.recording = false;
      // }
    },
    sendAudio() {
      // You can replace the URL with your server endpoint
      const uploadUrl = 'https://your-server/upload-audio';

      // Simulating a FormData object with the audio file
      const formData = new FormData();
      formData.append('audio', this.recordedAudio, 'audio.wav');

      // Sending the audio file to the server using Axios
      axios.post(uploadUrl, formData)
        .then(response => {
          // Handle the response from the server if needed
          console.log('Audio sent successfully!', response.data);
        })
        .catch(error => {
          console.error('Error sending audio:', error);
        });
    },
  },
  mounted() {
    // Load previously recorded audio from localStorage
    const storedAudio = localStorage.getItem('recordedAudio');
    if (storedAudio) {
      this.audioPreview = storedAudio;
    }
  },
};
</script>

<style scoped>
/* Bootstrap styling or your own styling */
.btn {
  margin: 10px;
}
</style>
