<template>
  <div>
    <button class="btn my-3 border rounded-circle" style="width: 60px; height: 60px" @mousedown="toggleRecording"
      @mouseup="toggleRecording">
      <div class="d-flex flex-column justify-content-center align-items-center h-100">
        <i v-if="!isRecording" class="bi bi-mic fs-5"></i>
        <i v-if="isRecording" class="bi bi-mic-fill fs-5"></i>
      </div>
    </button>
    <hr>
    <p class="p-2 text-danger">{{ computedChats.length }}</p>
    <div class="card card-body p-0" v-for="(chat, chatIndex) in computedChats" :key="chatIndex">
      <div v-if="chat.audio && chat.audio.length" class="audio-container">
        <audio :ref="`audioPlayer-${chatIndex}`" :src="chat.audio[0].url" controls></audio>
      </div>
      <div v-else class="">
        {{ chat.message }}
      </div>
    </div>
  </div> 
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      isRecording: false,
      audioChunks: [],
      mediaRecorder: null,
      audioPlayer: null,
      chats: [],
    };
  },
  mounted() {
    this.loadAllChats();
  },
  computed: {
    computedChats() {
      return this.chats;
    }
  },
  methods: {
    async loadAllChats() {
      await axios.get('http://192.168.1.133:8001/api/chats?ledger_sid=DG-L-0001', {
        headers: {
          'Accept': 'application/json',
        }
      })
        .then((response) => {
          this.chats = response.data.data
        });
    },
    toggleRecording() {
      if (this.isRecording) {
        this.stopRecording();
      } else {
        this.startRecording();
      }
    },
    startRecording() {

      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          this.mediaRecorder = new MediaRecorder(stream);
          this.audioChunks = [];

          this.mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              this.audioChunks.push(event.data);
            }
          };

          this.mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(this.audioChunks, { type: 'audio/mp3' });
            const audioUrl = URL.createObjectURL(audioBlob);
            const formData = new FormData();
            formData.append('audio', audioBlob, 'recording.mp3');
            formData.append('message', 'chat audio');
            formData.append('ledger_sid', 'DG-L-0001');

            try {
              const response = await axios.post('http://192.168.1.133:8001/api/chats', formData, {
                headers: { 'Accept': 'application/json', 'Content-Type': 'multipart/form-data' }
              });
              this.chats.push(response.data.data);
              const newChatIndex = this.chats.length - 1;
              const newAudioPlayerRef = `audioPlayer-${newChatIndex}`;
              this.$nextTick(() => {
                if (this.$refs[newAudioPlayerRef] && this.$refs[newAudioPlayerRef][0]) {
                  this.$refs[newAudioPlayerRef][0].src = audioUrl;
                }
              });
              this.$forceUpdate();
              console.log('Server response:', response.data);
            } catch (error) {
              console.error('Error uploading file:', error);
            }

          this.isRecording = false;
        };

      this.mediaRecorder.start();
      this.isRecording = true;
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
