<template>
<div class="search">
  <b-tabs v-model="tabIndex">
    <b-tab title="Semua">
      <section id="tracks">
        <h4 @click="tabIndex = 1"
            v-show="dataSong.length !== 0"
            class="title-search my-3">
          Tracks
          <i class="fa fa-angle-right"></i>
        </h4>
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
                       :src="d.preview_url"></audio>
                <img :id="`img-track-${d.id}`"
                     class="image-track rounded"
                     width="40px"
                     :alt="`image-${d.name}`"
                     v-show="hover !== d.id && playing !== d.id && !d.album.images[2].url"
                     src="https://e-cdns-images.dzcdn.net/images/cover/d41d8cd98f00b204e9800998ecf8427e/28x28-000000-80-0-0.jpg">
                <img :id="`img-track-${d.id}`"
                     class="image-track rounded"
                     width="40px"
                     :alt="`image-${d.name}`"
                     v-show="hover !== d.id && playing !== d.id && d.album.images[2].url"
                     :src="d.album.images[2].url">
                <vs-button
                    icon
                    dark
                    flat
                    width="40px"
                    v-show="hover === d.id || playing === d.id"
                    @click="playPreview(d)"
                >
                  <i class="fa text-light" :class="playTrack ? 'fa-pause' : 'fa-play'"></i>
                </vs-button>
              </vs-col>
              <vs-button icon transparent dark circle>
                <i class="fa fa-heart"></i>
              </vs-button>
              <vs-col w="3" class="track-title">
                {{ d.name }}
              </vs-col>
              <vs-col w="2" class="track-artist">
                {{ d.artists[0].name }}
              </vs-col>
              <vs-col w="3" class="track-album">
                {{ d.album.name }}
              </vs-col>
              <vs-col w="1">
                {{ d.duration_ms | filterDuration }}
              </vs-col>
              <vs-col w="2">
                <vs-tooltip>
                  <b-form-rating :value="d.popularity | filterRank"
                                 readonly
                                 inline
                                 size="sm"
                                 no-border
                                 stars="5">
                  </b-form-rating>
                  <template #tooltip>
                    {{ d.popularity | filterRank }}
                  </template>
                </vs-tooltip>
              </vs-col>
            </div>
          </vs-row>
        </div>
      </section>
      <section id="albums" class="mt-3">
        <h4 @click="tabIndex = 2"
            v-show="dataAlbum.length !== 0"
            class="title-search my-3">
          Album
          <i class="fa fa-angle-right"></i>
        </h4>
        <vs-row>
          <vs-col w="3"
                  justify="center"
                  align="center"
                  v-for="(d, index) in dataAlbum"
                  :key="index">
            <div class="picture">
              <img :src="d.images[1].url"
                   v-if="d.images.length > 0"
                   width="200px"
                   :alt="d.name"
                   class="img-thumbnail rounded">
              <div class="no-picture img-thumbnail rounded" v-else>
                <i class="fas fa-user-astronaut"></i>
              </div>
              <vs-button icon color="#fff"
                         dark circle
                         class="button-play m-0"
                         :class="{ 'button-preview' : holdButton }"
                         v-long-click="() => holdPlay(1, d.id)"
                         @mouseleave="holdStop"
                         @mouseup="holdStop"
                         style="padding: 5px">
                <i class="fa fa-play" style="font-size: 1rem; margin-left: 2px"></i>
              </vs-button>
              <div class="information">
                <span class="info-name">{{ d.name }}</span>
                <span class="info-more">{{ d.artists[0].name }}</span>
              </div>
            </div>
          </vs-col>
        </vs-row>
      </section>
      <section id="artists" class="mt-3">
        <h4 @click="tabIndex = 3"
            v-show="dataArtist.length !== 0"
            class="title-search my-3">
          Artist
          <i class="fa fa-angle-right"></i>
        </h4>
        <vs-row>
          <vs-col w="3"
                  justify="center"
                  align="center"
                  v-for="(d, index) in dataArtist"
                  :key="index">
            <div class="picture">
              <img :src="d.images[1].url"
                   v-if="d.images.length > 0"
                   width="200px"
                   :alt="d.name"
                   class="img-thumbnail rounded">
              <div class="no-picture img-thumbnail rounded" v-else>
                <i class="fas fa-user-astronaut"></i>
              </div>
              <vs-button icon color="#fff"
                         dark circle
                         class="button-play m-0"
                         :class="{ 'button-preview' : holdButton }"
                         v-long-click="() => holdPlay(1, d.id)"
                         @mouseleave="holdStop"
                         @mouseup="holdStop"
                         style="padding: 5px">
                <i class="fa fa-play" style="font-size: 1rem; margin-left: 2px"></i>
              </vs-button>
              <div class="information">
                <span class="info-name">{{ d.name }}</span>
                <span class="info-more followers">
                  {{ d.followers.total | filterNumeral }} followers
                </span>
              </div>
            </div>
          </vs-col>
        </vs-row>
      </section>
      <section id="playlists" class="mt-3">
        <h4 @click="tabIndex = 4"
            v-show="dataPlaylist.length !== 0"
            class="title-search my-3">
          Playlist
          <i class="fa fa-angle-right"></i>
        </h4>
        <vs-row>
          <vs-col w="3"
                  justify="center"
                  align="center"
                  v-for="(d, index) in dataPlaylist"
                  :key="index">
            <div class="picture">
              <img :src="d.images[1] ? d.images[1].url : d.images[0].url"
                   v-if="d.images.length > 0"
                   width="200px"
                   :alt="d.name"
                   class="img-thumbnail rounded">
              <div class="no-picture img-thumbnail rounded" v-else>
                <i class="fas fa-user-astronaut"></i>
              </div>
              <vs-button icon color="#fff"
                         dark circle
                         class="button-play m-0"
                         :class="{ 'button-preview' : holdButton }"
                         v-long-click="() => holdPlay(1, d.id)"
                         @mouseleave="holdStop"
                         @mouseup="holdStop"
                         style="padding: 5px">
                <i class="fa fa-play" style="font-size: 1rem; margin-left: 2px"></i>
              </vs-button>
              <div class="information">
                <span class="info-name">{{ d.name }}</span>
                <span class="info-more followers">by {{ d.owner.display_name }}</span>
              </div>
            </div>
          </vs-col>
        </vs-row>
      </section>
    </b-tab>
    <b-tab title="Tracks">
      <h3 class="my-3">{{ totalSong | filterNumeral }} Tracks</h3>
      <div class="data-track">
        <vs-row class="data-track-row"
                align="center"
                v-for="(d, index) in dataAllSong" :key="index">
          <div @mouseover="mouseOver(d.id)"
               @mouseleave="mouseLeave"
               class="w-100 d-flex align-items-center"
          >
            <vs-col w="1" align="center">
              <audio :id="`audio-${d.id}`"
                     @timeupdate="currentTime = $event.target.currentTime"
                     :src="d.preview_url"></audio>
              <img :id="`img-track-${d.id}`"
                   class="image-track rounded"
                   width="40px"
                   :alt="`image-${d.name}`"
                   v-show="hover !== d.id && playing !== d.id && d.album.images.length === 0"
                   src="https://e-cdns-images.dzcdn.net/images/cover/d41d8cd98f00b204e9800998ecf8427e/28x28-000000-80-0-0.jpg">
              <img :id="`img-track-${d.id}`"
                   class="image-track rounded"
                   width="40px"
                   :alt="`image-${d.name}`"
                   v-show="hover !== d.id && playing !== d.id && d.album.images.length > 0"
                   :src="d.album.images[2] ? d.album.images[2].url : d.album.images[1].url">
              <vs-button
                  icon
                  dark
                  flat
                  v-show="hover === d.id || playing === d.id"
                  @click="playPreview(d)"
              >
                <i class="fa text-light" :class="playTrack ? 'fa-pause' : 'fa-play'"></i>
              </vs-button>
            </vs-col>
            <vs-button icon transparent dark circle>
              <i class="fa fa-heart"></i>
            </vs-button>
            <vs-col w="3" class="track-title">
              {{ d.name }}
            </vs-col>
            <vs-col w="2" class="track-artist">
              {{ d.artists[0].name }}
            </vs-col>
            <vs-col w="3" class="track-album">
              {{ d.album.name }}
            </vs-col>
            <vs-col w="1">
              {{ d.duration_ms | filterDuration }}
            </vs-col>
            <vs-col w="2">
              <vs-tooltip>
                <b-form-rating :value="d.popularity | filterRank"
                               readonly
                               inline
                               size="sm"
                               no-border
                               stars="5">
                </b-form-rating>
                <template #tooltip>
                  {{ d.popularity | filterRank }}
                </template>
              </vs-tooltip>
            </vs-col>
          </div>
        </vs-row>
        <vs-button transparent block danger
                   v-if="nextSong !== ''"
                   @click="searchNext(nextSong, 'track')"
        >More</vs-button>
      </div>
    </b-tab>
    <b-tab title="Albums">
      <h3 class="my-3">{{ totalAlbum | filterNumeral }} Albums</h3>
      <vs-row>
        <vs-col w="3"
                justify="center"
                align="center"
                class="my-2"
                v-for="(d, index) in dataAllAlbum"
                :key="index">
          <div class="picture">
            <img :src="d.images[1].url"
                 v-if="d.images.length > 0"
                 width="200px"
                 :alt="d.name"
                 class="img-thumbnail rounded">
            <div class="no-picture img-thumbnail rounded" v-else>
              <i class="fas fa-user-astronaut"></i>
            </div>
            <vs-button icon color="#fff"
                       dark circle
                       class="button-play m-0"
                       :class="{ 'button-preview' : holdButton }"
                       v-long-click="() => holdPlay(1, d.id)"
                       @mouseleave="holdStop"
                       @mouseup="holdStop"
                       style="padding: 5px">
              <i class="fa fa-play" style="font-size: 1rem; margin-left: 2px"></i>
            </vs-button>
            <div class="information">
              <span class="info-name">{{ d.name }}</span>
              <span class="info-more">{{ d.artists[0].name }}</span>
            </div>
          </div>
        </vs-col>
      </vs-row>
      <vs-button transparent block danger
                 v-if="nextAlbum !== ''"
                 @click="searchNext(nextAlbum, 'album')"
      >More</vs-button>
    </b-tab>
    <b-tab title="Artists">
      <h3 class="my-3">{{ totalArtist | filterNumeral }} Artists</h3>
      <vs-row>
        <vs-col w="3"
                justify="center"
                align="center"
                class="my-2"
                v-for="(d, index) in dataAllArtist"
                :key="index">
          <div class="picture">
            <img :src="d.images[1].url"
                 v-if="d.images.length > 0"
                 width="200px"
                 :alt="d.name"
                 class="img-thumbnail rounded">
            <div class="no-picture img-thumbnail rounded" v-else>
              <i class="fas fa-user-astronaut"></i>
            </div>
            <vs-button icon color="#fff"
                       dark circle
                       class="button-play m-0"
                       :class="{ 'button-preview' : holdButton }"
                       v-long-click="() => holdPlay(1, d.id)"
                       @mouseleave="holdStop"
                       @mouseup="holdStop"
                       style="padding: 5px">
              <i class="fa fa-play" style="font-size: 1rem; margin-left: 2px"></i>
            </vs-button>
            <div class="information">
              <span class="info-name">{{ d.name }}</span>
              <span class="info-more followers">
                  {{ d.followers.total | filterNumeral }} followers
                </span>
            </div>
          </div>
        </vs-col>
      </vs-row>
      <vs-button transparent block danger
                 v-if="nextArtist !== ''"
                 @click="searchNext(nextArtist, 'artist')"
      >More</vs-button>
    </b-tab>
    <b-tab title="Playlists">
      <h3 class="my-3">{{ totalPlaylist | filterNumeral }} Playlists</h3>
      <vs-row>
        <vs-col w="3"
                justify="center"
                align="center"
                class="my-2"
                v-for="(d, index) in dataAllPlaylist"
                :key="index">
          <div class="picture">
            <img :src="d.images[1] ? d.images[1].url : d.images[0].url"
                 v-if="d.images.length > 0"
                 width="200px"
                 :alt="d.name"
                 class="img-thumbnail rounded">
            <div class="no-picture img-thumbnail rounded" v-else>
              <i class="fas fa-user-astronaut"></i>
            </div>
            <vs-button icon color="#fff"
                       dark circle
                       class="button-play m-0"
                       :class="{ 'button-preview' : holdButton }"
                       v-long-click="() => holdPlay(1, d.id)"
                       @mouseleave="holdStop"
                       @mouseup="holdStop"
                       style="padding: 5px">
              <i class="fa fa-play" style="font-size: 1rem; margin-left: 2px"></i>
            </vs-button>
            <div class="information">
              <span class="info-name">{{ d.name }}</span>
              <span class="info-more followers">by {{ d.owner.display_name }}</span>
            </div>
          </div>
        </vs-col>
      </vs-row>
      <vs-button transparent block danger
                 v-if="nextPlaylist !== ''"
                 @click="searchNext(nextArtist, 'playlist')"
      >More</vs-button>
    </b-tab>
  </b-tabs>
</div>
</template>

<script>
import _ from 'lodash';
import numeral from 'numeral';

export default {
  name: 'Search',
  data() {
    return {
      dataSong: [],
      dataAllSong: [],
      totalSong: '',
      nextSong: '',

      dataAlbum: [],
      dataAllAlbum: [],
      totalAlbum: '',
      nextAlbum: '',

      dataArtist: [],
      dataAllArtist: [],
      totalArtist: '',
      nextArtist: '',

      dataPlaylist: [],
      dataAllPlaylist: [],
      totalPlaylist: '',
      nextPlaylist: '',

      dataUser: [],
      dataAllUser: [],
      totalUser: '',
      nextUser: '',

      tabIndex: 0,
      hover: '',
      playing: '',
      playingPrev: '',
      currentTime: 0,
      duration: 0,
      holdTouch: 0,
      holdButton: false,
    };
  },
  filters: {
    filterDuration(duration) {
      const hrs = Math.floor(duration / 3600000);
      const mins = Math.floor((duration % 3600000) / 60000);
      const secs = Math.floor((duration % 60000) / 1000);
      let ret = '';

      if (hrs > 0) {
        ret += `${hrs}:${mins < 10 ? '0' : ''}`;
      }

      ret += `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}`;
      ret += `${secs}`;
      return ret;
    },
    filterRank(rank) {
      const ranking = Math.abs(rank / 10);
      const ranks = ranking.toFixed(2) / 2;
      return ranks.toFixed(2);
    },
    filterNumeral(num) {
      return numeral(num).format('0,0');
    },
  },
  watch: {
    $route() {
      this.searching('track');
    },
    playTrack() {
      if (this.playTrack) {
        this.playing = this.nowPlaying.id;
      }
    },
    currentTime() {
      this.$store.commit('SET_CURRENT_TIME', this.currentTime);
      const index = _.findIndex(this.dataAllSong, { id: this.playing });

      // next and shuffle song
      if (this.duration === this.currentTime) {
        if (!this.$store.state.repeat) {
          this.playPreview(this.dataAllSong[index + 1]);
        }
        if (this.$store.state.shuffle) {
          const shuffleIndex = Math.floor(Math.random() * Math.floor(this.dataAllSong.length));
          this.playPreview(this.dataAllSong[shuffleIndex]);
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
        this.$store.commit('SET_PLAY', true);
        this.$store.commit('SET_NOW_PLAYING', data);
        this.$store.commit('SET_ELEMENT', audio);
        this.$store.commit('SET_DURATION_FULL', audio.duration);
      } else {
        audio.pause();
        parentEl.classList.add('pause');
        parentEl.classList.remove('play');
        this.$store.commit('SET_PLAY', false);
      }
    },
    holdPlay(amount, id) {
      this.holdTouch += amount;
      if (this.holdTouch > 1) {
        this.fetchAlbum(id);
        this.holdButton = true;
      }
    },
    holdStop() {
      this.holdButton = false;
    },
    searchNext(url, type) {
      this.$axios({
        method: 'get',
        url,
        headers: {
          Authorization: `Bearer ${this.$store.state.token}`,
        },
      }).then((res) => {
        const { data } = res;
        if (type === 'track') {
          data.tracks.items.map((d) => this.dataAllSong.push(d));
        }
        if (type === 'album') {
          data.albums.items.map((d) => this.dataAllAlbum.push(d));
        }
        if (type === 'artist') {
          data.artists.items.map((d) => this.dataAllArtist.push(d));
        }
        if (type === 'playlist') {
          data.playlists.items.map((d) => this.dataAllPlaylist.push(d));
        }
      });
    },
    fetchAlbum(id) {
      this.$spotifyApi.getAlbum(id).then((res) => {
        console.log(res);
      }).catch((err) => {
        throw new Error(err);
      });
    },
    searching: _.debounce(function (types) {
      const search = this.$route.params.code;
      if (search && this.$route.params) {
        let loading;
        if (types === 'track') {
          loading = this.$vs.loading({
            type: 'scale',
            color: 'dark',
          });
        }
        this.$spotifyApi.search(search, [types])
          .then((res) => {
            const data = res.body;
            const dataSong = [];
            const dataAlbum = [];
            const dataArtist = [];
            const dataPlaylist = [];
            if (types === 'track') {
              data.tracks.items.forEach((item, index) => {
                if (index < 5) {
                  dataSong.push(data.tracks.items[index]);
                }
              });
            }
            if (types === 'album') {
              data.albums.items.forEach((item, index) => {
                if (index < 4) {
                  dataAlbum.push(data.albums.items[index]);
                }
              });
            }
            if (types === 'artist') {
              data.artists.items.forEach((item, index) => {
                if (index < 4) {
                  dataArtist.push(data.artists.items[index]);
                }
              });
            }
            if (types === 'playlist') {
              data.playlists.items.forEach((item, index) => {
                if (index < 4) {
                  dataPlaylist.push(data.playlists.items[index]);
                }
              });
            }
            if (types === 'track') {
              this.totalSong = data.tracks.total;
              this.dataSong = dataSong;
              this.dataAllSong = data.tracks.items;
              this.$store.commit('SET_DATA_TRACKS', data.tracks.items);
              if (data.tracks.next) {
                this.nextSong = data.tracks.next;
              } else {
                this.nextSong = '';
              }
              this.searching('album');
            } else if (types === 'album') {
              this.dataAlbum = dataAlbum;
              this.totalAlbum = data.albums.total;
              this.dataAllAlbum = data.albums.items;
              if (data.albums.next) {
                this.nextAlbum = data.albums.next;
              } else {
                this.nextAlbum = '';
              }
              this.searching('artist');
            } else if (types === 'artist') {
              this.dataArtist = dataArtist;
              this.totalArtist = data.artists.total;
              this.dataAllArtist = data.artists.items;
              if (data.artists.next) {
                this.nextArtist = data.artists.next;
              } else {
                this.nextArtist = '';
              }
              this.searching('playlist');
            } else if (types === 'playlist') {
              this.dataPlaylist = dataPlaylist;
              this.totalPlaylist = data.playlists.total;
              this.dataAllPlaylist = data.playlists.items;
              if (data.playlists.next) {
                this.nextPlaylist = data.playlists.next;
              } else {
                this.nextPlaylist = '';
              }
            }
            if (types === 'track') {
              loading.close();
            }
          }).catch((err) => {
            throw new Error(err);
          });
      } else {
        this.$router.push('/home');
      }
    }, 1500),
  },
  created() {
    this.searching('track');
  },
};
</script>

<style scoped>

</style>
