import { createStore } from "vuex";

export default createStore({
  state: {
    audioClips: [ ],

  },
  getters: {
    getAudioClips: state => state.audioClips
  },
  mutations: {
    addAudioClip(state, clip) {
      console.log('Adding audio clip:', clip);
      state.audioClips.push(clip);
    },

    resetAudioClips(state) {
      state.audioClips = [];
    },
  },
  actions: {
    uploadAllToServer({ state }) {
      state.audioClips.forEach((clip, index) => {
        // TODO: Send clip.blob to the server using an HTTP request or another method.
        console.log(`Uploading audio clip ${index + 1} to server...`);
      });
    },
  },
  modules: {},
});
