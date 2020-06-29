import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    nowPlaying: {},
    play: false,
    repeat: false,
    shuffle: false,
    elementPlay: {},
    currentTime: 0,
    durationFull: 0,
  },
  mutations: {
    SET_NOW_PLAYING(state, data) {
      state.nowPlaying = data;
    },
    SET_PLAY(state, play) {
      state.play = play;
    },
    SET_ELEMENT(state, element) {
      state.elementPlay = element;
    },
    SET_CURRENT_TIME(state, currentTime) {
      state.currentTime = currentTime;
    },
    SET_DURATION_FULL(state, durationFull) {
      state.durationFull = durationFull;
    },
    SET_REPEAT(state, repeat) {
      state.repeat = repeat;
    },
    SET_SHUFFLE(state, shuffle) {
      state.shuffle = shuffle;
    },
  },
  actions: {
  },
  modules: {
  },
});
