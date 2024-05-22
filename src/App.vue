<template>
  <!-- <div class="container d-flex flex-column justify-content-center align-items-center my-5"> -->
    <!-- <audio v-for="(clip, index) in audioClips" :key="index" controls :src="clip.url"></audio> -->
    <!-- <audio controls :src="audioUrl"></audio>
    <div class="p-3 px-4 my-3 border rounded-circle" @click="toggleRecording">
      <i v-if="!isRecording" class="bi bi-mic fs-5"></i>
      <i v-if="isRecording" class="bi bi-mic-fill fs-5"></i>
    </div> -->
    <!-- <button v-if="audioClips.length > 0" class="btn btn-success" @click="sendAllToServer">
      Upload All to Server
    </button> -->
  <!-- </div> -->
  <router-view></router-view>
</template>

<script>
// import axios from 'axios';
export default {
  data() {
    return {
      isRecording: false,
      mediaRecorder: null,
      audioData: [],
      audioUrl:null,
    };
  },
  computed: {
    audioClips() {
      return this.$store.state.audioClips;
    },
  },
  methods: {
    async toggleRecording() {
      if (this.isRecording) {
        this.stopRecording();
      } else {
        
        await this.startRecording();
      }
    },
    async startRecording() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        this.mediaRecorder = new MediaRecorder(stream);

        this.mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            this.audioData.push(event.data);
          }
        };

        this.mediaRecorder.onstop = () => {
          const audioBlob = new Blob(this.audioData, { type: 'audio/mp3' });

          const audioUrl = URL.createObjectURL(audioBlob);
          this.$store.commit('addAudioClip', { blob: audioBlob, url: audioUrl });

          // const formData = new FormData();
          // formData.append('audio', audioBlob);

          // Send the audio file to the server
          // const response = axios.post('http://192.168.1.133:8006/api/chat', formData);
         
          // Handle the response, assuming the server returns the URL of the audio file
          // this.audioUrl = response.data.audioUrl;

          localStorage.setItem('recordedAudio', audioBlob)
          // console.log('Blob content:', audioBlob);
        };

        this.isRecording = true;
        this.mediaRecorder.start();
      } catch (error) {
        console.error('Error accessing microphone:', error);
      }
    },

    stopRecording() {
      if (this.mediaRecorder) {
        this.isRecording = false;
        this.mediaRecorder.stop();
      }
    },
    sendAllToServer() {
      this.$store.dispatch('uploadAllToServer');
    },
  },
};
</script>
