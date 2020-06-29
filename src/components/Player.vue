<template>
<div class="player">
  <div class="player-control">
    <ul class="icon-group">
      <li>
        <vs-button circle dark flat icon>
          <i class="fa fa-step-backward"></i>
        </vs-button>
      </li>
      <li>
        <vs-button circle dark flat icon
                   @keyup.space="setPlaying"
                   @click="setPlaying">
          <i class="fa"
             :class="play ? 'fa-pause' : 'fa-play'"
             style="font-size: 1.5rem"></i>
        </vs-button>
      </li>
      <li>
        <vs-button circle dark flat icon>
          <i class="fa fa-step-forward"></i>
        </vs-button>
      </li>
    </ul>
  </div>
  <div class="player-track">
    <div class="track-container">
      <div class="track-heading">
        <div class="track-title">
          <router-link to="#title">{{ title }}</router-link> ·
          <router-link to="#artist">{{ artist }}</router-link>
        </div>
        <div class="track-actions">
          <ul class="icon-group">
            <vs-tooltip>
              <li>
                <i class="fa fa-microphone"></i>
              </li>
              <template #tooltip>
                Show lyrics
              </template>
            </vs-tooltip>
            <vs-tooltip>
              <li>
                <i class="fa fa-plus"></i>
              </li>
              <template #tooltip>
                Add to playlist
              </template>
            </vs-tooltip>
            <vs-tooltip>
              <li>
                <i class="far fa-heart"></i>
              </li>
              <template #tooltip>
                Like
              </template>
            </vs-tooltip>
          </ul>
        </div>
      </div>
      <div class="track-seekbar">
        <div class="slider">
          <div class="slider-counter slider-counter-current">{{ seekSlider | filterDuration }}</div>
          <div class="slider-track">
            <input id="seekslider"
                   class="slider-track-input"
                   :max="fullTime" min="0" step="1"
                   v-model.number="seekSlider"
                   @mousemove="setSeek"
                   @mousedown="seeking = setSeek"
                   @mouseup="seeking = false"
                   type="range">
          </div>
          <div class="slider-counter slider-counter-max">{{ durationFull | filterDuration }}</div>
        </div>
      </div>
    </div>
  </div>
  <div class="player-options">
    <vs-row>
      <vs-col w="6">
        <ul class="icon-group">
          <li>
            <vs-tooltip>
              <vs-button circle icon transparent dark
                         @click="setRepeat"
              >
                <i class="fa fa-redo-alt"
                   :class="{'txt-danger': repeat}"
                   style="font-size: 14px"></i>
              </vs-button>
              <template #tooltip>
                Repeat
              </template>
            </vs-tooltip>
          </li>
          <li>
            <vs-tooltip>
              <vs-button circle icon transparent dark
                         @click="setShuffle"
              >
                <i class="fa fa-random"
                   :class="{'txt-danger': shuffle}"
                   style="font-size: 14px"></i>
              </vs-button>
              <template #tooltip>
                Shuffle
              </template>
            </vs-tooltip>
          </li>
          <li>
            <vs-tooltip not-hover v-model="volumeTooltip">
              <vs-button
                  @click="volumeTooltip=!volumeTooltip"
                  circle
                  icon
                  dark
                  transparent>
                <i class="fa fa-volume-up" style="font-size: 14px"></i>
              </vs-button>
              <template #tooltip>
                <input id="volume-slider"
                       max="100" min="0"
                       step="1" v-model.number="volume"
                       @mousemove="setVolume"
                       type="range">
              </template>
            </vs-tooltip>
          </li>
        </ul>
      </vs-col>
      <vs-col w="6">
        <vs-button dark square transparent>
          <img alt="" :src="coverAlbum" v-show="coverAlbum !== ''" width="28px">
          <img alt=""
               src="https://e-cdns-images.dzcdn.net/images/cover/d41d8cd98f00b204e9800998ecf8427e/28x28-000000-80-0-0.jpg"
               v-show="coverAlbum === ''">
          <span style="margin-left: .5rem">Daftar Antrean</span>
        </vs-button>
      </vs-col>
    </vs-row>
  </div>
</div>
</template>

<script>
export default {
  name: 'Player',
  data() {
    return {
      title: '',
      artist: '',
      coverAlbum: '',
      seeking: false,
      seekSlider: 0,
      volumeTooltip: false,
      volume: 100,
      fullTime: 0,
      repeat: false,
      shuffle: false,
    };
  },
  filters: {
    filterDuration(duration) {
      const hrs = Math.floor(duration / 3600);
      const mins = Math.floor((duration % 3600) / 60);
      const secs = Math.floor(duration % 60);
      let ret = '';

      if (hrs > 0) {
        ret += `${hrs}:${mins < 10 ? '0' : ''}`;
      }

      ret += `${mins}:${secs < 10 ? '0' : ''}`;
      ret += `${secs}`;
      return ret;
    },
  },
  watch: {
    nowPlaying() {
      this.title = this.nowPlaying.title;
      this.artist = this.nowPlaying.artist.name;
      this.coverAlbum = this.nowPlaying.album.cover;
      this.fullTime = this.durationFull;
    },
    currentTime() {
      this.seekSlider = this.currentTime;
      if (this.seekSlider === this.fullTime && this.repeat) {
        this.audio.play();
        this.$store.commit('SET_PLAY', true);
      }
    },
  },
  computed: {
    audio() {
      return this.$store.state.elementPlay;
    },
    nowPlaying() {
      return this.$store.state.nowPlaying;
    },
    play() {
      return this.$store.state.play;
    },
    currentTime() {
      return this.$store.state.currentTime;
    },
    durationFull() {
      return this.$store.state.durationFull;
    },
  },
  methods: {
    setSeek() {
      if (this.seeking) {
        this.audio.currentTime = this.seekSlider;
      }
    },
    setPlaying() {
      if (this.audio.paused) {
        this.audio.play();
        this.$store.commit('SET_PLAY', true);
      } else {
        this.audio.pause();
        this.$store.commit('SET_PLAY', false);
      }
    },
    setRepeat() {
      this.repeat = !this.repeat;
      this.$store.commit('SET_REPEAT', this.repeat);
    },
    setShuffle() {
      this.shuffle = !this.shuffle;
      this.$store.commit('SET_SHUFFLE', this.shuffle);
    },
    setVolume() {
      this.audio.volume = this.volume / 100;
    },
  },
};
</script>

<style scoped>

</style>
