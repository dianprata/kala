<template>
<div class="home-layout">
  <sidebar />
  <navbar />
  <div class="content">
    <slot />
  </div>
  <player ref="player" />
</div>
</template>

<script>
import querystring from 'querystring';
import Navbar from '../components/Navbar.vue';
import Sidebar from '../components/Sidebar.vue';
import Player from '../components/Player.vue';

export default {
  name: 'Home',
  components: {
    Navbar,
    Sidebar,
    Player,
  },
  computed: {
    loginTime() {
      return localStorage.getItem('loginTime');
    },
  },
  watch: {
    $route() {
      this.checkTokenExpire();
    },
  },
  methods: {
    refreshToken() {
      this.$axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        data: querystring.stringify({
          grant_type: 'refresh_token',
          refresh_token: localStorage.getItem('refreshToken'),
        }),
        headers: {
          Authorization: `Basic ${Buffer.from(`${process.env.VUE_APP_CLIENT_ID}:${process.env.VUE_APP_CLIENT_SECRET}`).toString('base64')}`,
        },
      }).then((res) => {
        this.$spotifyApi.setAccessToken(res.data.access_token);
        localStorage.setItem('accessToken', res.data.access_token);
        localStorage.setItem('loginTime', new Date());
        this.$store.commit('SET_TOKEN', res.data.access_token);
        this.$store.commit('SET_LOGIN_TIME', new Date());
      });
    },
    checkTokenExpire() {
      const nowTime = new Date();
      const oneHour = 60 * 60 * 1000; /* ms */
      const subtraction = nowTime - new Date(this.loginTime);
      const refreshTimeout = (oneHour - 10 * 60 * 1000) - subtraction;
      if (subtraction < oneHour) {
        if (subtraction > (oneHour - 10 * 60 * 1000)) {
          this.refreshToken();
          console.log('refresh token');
        }
        console.log(`refresh token dalam waktu : ${Math.floor(refreshTimeout / (60 * 1000))} menit`);
      }
    },
  },
  mounted() {
    this.checkTokenExpire();
  },
};
</script>

<style scoped>

</style>
