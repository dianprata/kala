<template>
<div>

</div>
</template>

<script>
import querystring from 'querystring';

export default {
  name: 'Callback',
  methods: {
    getCallback() {
      const req = this.$route;
      const res = window.location;
      const ls = localStorage;
      const stateKey = 'spotify_auth_state';
      if (req.path === '/callback') {
        const code = req.query.code || null;
        const state = req.query.state || null;
        const storedState = ls ? ls.getItem(stateKey) : null;

        if (state === null || state !== storedState) {
          res.replace(`/#${
            querystring.stringify({
              error: 'state_mismatch',
            })}`);
        } else {
          ls.removeItem(stateKey);
          const authOptions = {
            method: 'post',
            url: 'https://accounts.spotify.com/api/token',
            data: querystring.stringify({
              grant_type: 'authorization_code',
              code,
              redirect_uri: process.env.VUE_APP_REDIRECT_URI,
            }),
            headers: {
              Authorization: `Basic ${Buffer.from(`${process.env.VUE_APP_CLIENT_ID}:${process.env.VUE_APP_CLIENT_SECRET}`).toString('base64')}`,
            },
          };

          this.$axios(authOptions).then((response) => {
            if (response.status === 200) {
              const accessToken = response.data.access_token;
              const refreshToken = response.data.refresh_token;
              const expireToken = response.data.expires_in;

              // we can also pass the token to the browser to make requests from there
              this.$router.push('/home');
              localStorage.setItem('accessToken', accessToken);
              localStorage.setItem('refreshToken', refreshToken);
              localStorage.setItem('loginTime', new Date());
              this.$store.commit('SET_EXPIRE_TOKEN', expireToken);
              this.$store.commit('SET_TOKEN', accessToken);
              this.$store.commit('SET_REFRESH_TOKEN', refreshToken);
              this.$store.commit('SET_LOGIN_TIME', new Date());
            } else {
              res.redirect(`/#${
                querystring.stringify({
                  error: 'invalid_token',
                })}`);
            }
          });
        }
      }
    },
  },
  created() {
    this.getCallback();
  },
};
</script>

<style scoped>

</style>
