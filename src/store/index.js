import Vue from 'vue';
import Vuex from 'vuex';
// import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: '',
    refreshToken: '',
    expireToken: 0,
    loginTime: 0,
    theme: 'light',
    nowPlaying: {},
    nextPlaying: {},
    play: false,
    repeat: false,
    shuffle: false,
    elementPlay: {},
    currentTime: 0,
    durationFull: 0,
    dataTracks: [],
  },
  getters: {
    darkMode: (state) => {
      if (state.theme === 'dark') {
        return true;
      }
      return false;
    },
  },
  mutations: {
    SET_THEME(state, theme) {
      state.theme = theme;
    },
    SET_TOKEN(state, token) {
      state.token = token;
    },
    SET_REFRESH_TOKEN(state, refreshToken) {
      state.refreshToken = refreshToken;
    },
    SET_EXPIRE_TOKEN(state, expireToken) {
      state.expireToken = expireToken;
    },
    SET_LOGIN_TIME(state, loginTime) {
      state.loginTime = loginTime;
    },
    SET_NOW_PLAYING(state, data) {
      state.nowPlaying = data;
    },
    SET_NEXT_PLAYING(state, data) {
      state.nextPlaying = data;
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
    SET_DATA_TRACKS(state, dataTracks) {
      state.dataTracks = dataTracks;
    },
  },
  actions: {
  },
  modules: {
  },
  // plugins: [
  //   createPersistedState({
  //     storage: {
  //       getItem: (key) => localStorage.getItem(key),
  //       setItem: (key, value) => localStorage.setItem(key, value),
  //       removeItem: (key) => localStorage.removeItem(key),
  //     },
  //   }),
  // ],
});
