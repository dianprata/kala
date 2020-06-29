<template>
<div class="search">
  <b-tabs v-model="tabIndex">
    <b-tab title="Semua">
      <section class="search-song">
        <h3 @click="tabIndex = 1"
            class="title-search-song">
          Lagu
          <i class="fa fa-angle-right"></i>
        </h3>
        <div class="data-track">
          <vs-row class="data-track-row"
                  align="center"
                  v-for="(d, index) in dataSong" :key="index">
            <div @mouseover="mouseOver(d.id)"
                 @mouseleave="mouseLeave"
                 class="w-100 d-flex align-items-center"
            >
              <vs-col w="1" align="center">
                <audio :id="`audio-${d.id}`"
                       @timeupdate="currentTime = $event.target.currentTime"
                       :src="d.preview"></audio>
                <img :id="`img-track-${d.id}`"
                     class="image-track rounded"
                     width="40px"
                     :alt="`image-${d.title}`"
                     v-show="hover !== d.id && playing !== d.id"
                     :src="d.album.cover_small">
                <vs-button
                    icon
                    dark
                    flat
                    v-show="hover === d.id || playing === d.id"
                    @click="playPreview(d)"
                >
                  <i class="fa text-light" :class="playing !== '' ? 'fa-pause' : 'fa-play'"></i>
                </vs-button>
              </vs-col>
              <vs-button icon transparent dark circle>
                <i class="fa fa-heart"></i>
              </vs-button>
              <vs-col w="3" class="track-title">
                {{ d.title }}
              </vs-col>
              <vs-col w="2" class="track-artist">
                {{ d.artist.name }}
              </vs-col>
              <vs-col w="3" class="track-album">
                {{ d.album.title }}
              </vs-col>
              <vs-col w="1">
                {{ d.duration | filterDuration }}
              </vs-col>
              <vs-col w="2">
                <vs-tooltip>
                  <b-form-rating :value="d.rank | filterRank"
                                 readonly
                                 inline
                                 size="sm"
                                 no-border
                                 stars="5">
                  </b-form-rating>
                  <template #tooltip>
                    {{ d.rank | filterRank }}
                  </template>
                </vs-tooltip>
              </vs-col>
            </div>
          </vs-row>
        </div>
      </section>
    </b-tab>
    <b-tab title="Lagu">
      Lagu
    </b-tab>
    <b-tab title="Album">
      Album
    </b-tab>
  </b-tabs>
</div>
</template>

<script>
import _ from 'lodash';

export default {
  name: 'Search',
  data() {
    return {
      dataSong: [],
      nextDataSongUrl: '',
      totalSong: '',
      tabIndex: 0,
      hover: '',
      playing: '',
      playingPrev: '',
      currentTime: 0,
      duration: 0,
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
    filterRank(rank) {
      const ranking = Math.abs(rank / 100000);
      const ranks = ranking.toFixed(2) / 2;
      return ranks.toFixed(2);
    },
  },
  watch: {
    $route() {
      this.searching();
    },
    playTrack() {
      if (this.playTrack) {
        this.playing = this.nowPlaying.id;
      }
    },
    currentTime() {
      this.$store.commit('SET_CURRENT_TIME', this.currentTime);
      const index = _.findIndex(this.dataSong, { id: this.playing });

      // next and shuffle song
      if (this.duration === this.currentTime) {
        if (!this.$store.state.repeat) {
          this.playPreview(this.dataSong[index + 1]);
        }
        if (this.$store.state.shuffle) {
          const shuffleIndex = Math.floor(Math.random() * Math.floor(this.dataSong.length));
          this.playPreview(this.dataSong[shuffleIndex]);
        }
      }
    },
  },
  computed: {
    nowPlaying() {
      return this.$store.state.nowPlaying;
    },
    playTrack() {
      return this.$store.state.play;
    },
  },
  methods: {
    mouseOver(id) {
      this.hover = id;
    },
    mouseLeave() {
      this.hover = '';
    },
    reset() {
      if (this.playingPrev !== '') {
        const resetAudio = document.getElementById(`audio-${this.playingPrev}`);
        const parentEl = resetAudio.parentElement.parentElement.parentElement;
        parentEl.classList.remove('play');
        parentEl.classList.remove('pause');
        resetAudio.pause();
        resetAudio.currentTime = 0;
      }
    },
    playPreview(data) {
      this.playingPrev = this.playing;
      this.playing = data.id;
      const audio = document.getElementById(`audio-${this.playing}`);
      const parentEl = audio.parentElement.parentElement.parentElement;
      if (this.playingPrev !== this.playing) {
        this.reset();
      }
      if (audio.paused) {
        audio.play();
        this.playing = data.id;
        this.duration = audio.duration;
        parentEl.classList.add('play');
        parentEl.classList.remove('pause');
        this.$store.commit('SET_NOW_PLAYING', data);
        this.$store.commit('SET_PLAY', true);
        this.$store.commit('SET_ELEMENT', audio);
        this.$store.commit('SET_DURATION_FULL', audio.duration);
      } else {
        audio.pause();
        parentEl.classList.add('pause');
        parentEl.classList.remove('play');
        this.$store.commit('SET_PLAY', false);
      }
    },
    searching: _.debounce(function () {
      const search = this.$route.query.q;
      if (search !== '') {
        const loading = this.$vs.loading({
          type: 'scale',
          color: 'dark',
        });
        this.$axios({
          method: 'GET',
          url: 'https://deezerdevs-deezer.p.rapidapi.com/search',
          headers: {
            'content-type': 'application/octet-stream',
            'x-rapidapi-host': 'deezerdevs-deezer.p.rapidapi.com',
            'x-rapidapi-key': '94008eba3emsh8705be1cc4f5ae9p1933f3jsn5a1144116d06',
            useQueryString: true,
          },
          params: {
            q: search,
          },
        }).then((response) => {
          loading.close();
          const { data } = response;
          this.nextDataSongUrl = data.next;
          const dataSong = [];
          this.dataSong = dataSong;
        }).catch((error) => {
          console.log(error);
        });
      }
    }, 1000),
  },
  created() {
    this.searching();
  },
};
</script>

<style scoped>

</style>
