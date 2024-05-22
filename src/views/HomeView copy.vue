<template>
  <div>
    <div class="audio-container">
      <div class="audio-controls">
        <button class="btn btn-primary" @click="startRecording" :disabled="recording">Start Recording</button>
        <button class="btn btn-danger" @click="stopRecording" :disabled="!recording">Stop Recording</button>
      </div>
      <!-- <audio ref="audioPlayer" src="http://192.168.1.133:8001/storage/3/file_example_MP3_2MG.mp3" controls></audio> -->
      <audio ref="audioPlayer" controls></audio>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      recording: false,
      audioChunks: [],
      mediaRecorder: null,
      audioPlayer: null,
    };
  },
  mounted() {
    this.audioPlayer = this.$refs.audioPlayer;
  },
  methods: {
    startRecording() {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          this.mediaRecorder = new MediaRecorder(stream);

          this.mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              this.audioChunks.push(event.data);
            }
          };

          this.mediaRecorder.onstop = () => {
            const audioBlob = new Blob(this.audioChunks, { type: 'audio/mp3' });
            const audioUrl = URL.createObjectURL(audioBlob);
            this.audioPlayer.src = audioUrl;
            localStorage.setItem('recordedAudio', audioUrl);
            
            const formData = new FormData();
            formData.append('audio', audioBlob);
            axios.post('http://192.168.1.133:8006/api/chat', formData);

            this.recording = false;
          };

          this.mediaRecorder.start();
          this.recording = true;
        })
        .catch((error) => {
          console.error('Error accessing microphone:', error);
        });
    },
    stopRecording() {
      if (this.mediaRecorder) {
        this.mediaRecorder.stop();
      }
    },
  },
};
</script>

<style scoped>
.audio-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
}

.audio-controls {
  margin-bottom: 10px;
}
</style>
