<template>
  <div>
    <vs-navbar center-collapsed>
      <template #left>
        <i class="fab fa-kickstarter-k" style="font-size: 35px"></i>
      </template>
      <template #right>
        <vs-button
            transparent
            circle
            dark
            size="large"
            @click="loginDialog = !loginDialog"
        >Login
        </vs-button>
        <vs-button
            circle
            flat
            dark
            size="large"
            to="/signup"
        >Signup
        </vs-button>
        <vs-button
            icon
            color="#fff"
            circle
            flat
            size="large"
            v-if="theme === 'light'"
            @click="toggleTheme('dark')"
        >
          <i class="fa fa-moon"></i>
        </vs-button>
        <vs-button
            icon
            dark
            circle
            flat
            size="large"
            v-else
            @click="toggleTheme('light')"
        >
          <i class="fa fa-sun"></i>
        </vs-button>
      </template>
    </vs-navbar>

    <vs-dialog v-model="loginDialog">
      <template #header>
        <h4 class="not-margin">
          Welcome to <b>Kala</b>
        </h4>
      </template>

      <div class="con-form">
        <form @keypress.enter="login">
          <vs-input v-model="email" placeholder="Email">
            <template #icon>
              @
            </template>
            <template v-if="validEmail" #message-success>
              Email Valid
            </template>
            <template v-if="!validEmail && email !== ''" #message-danger>
              Email Invalid
            </template>
          </vs-input>
          <vs-input type="password" v-model="password" placeholder="Password">
            <template #icon>
              <b-icon-lock></b-icon-lock>
            </template>
          </vs-input>
          <div class="flex">
            <vs-checkbox v-model="remember">Remember me</vs-checkbox>
            <a href="#">Forgot Password?</a>
          </div>
        </form>
      </div>

      <template #footer>
        <div class="footer-dialog">
          <vs-button block dark @click="login"
                     :disabled="email === '' || password === '' || !validEmail">
            Sign In
          </vs-button>
          <vs-button block success @click="loginSpotify" class="mt-2">
            <i class="fab fa-spotify mr-2"></i>Login with Spotify
          </vs-button>

          <div class="new">
            New Here? <router-link to="signup">Create New Account</router-link>
          </div>
        </div>
      </template>
    </vs-dialog>
  </div>
</template>

<script>
import querystring from 'querystring';

export default {
  name: 'Index',
  data() {
    return {
      loginDialog: false,
      email: '',
      password: '',
      remember: false,
    };
  },
  watch: {
    loginDialog() {
      if (this.dataLs) {
        this.email = this.dataLs.email;
        this.password = Buffer.from(this.dataLs.password, 'base64').toString('ascii');
        this.remember = true;
      }
    },
  },
  computed: {
    dataLs() {
      return JSON.parse(localStorage.getItem('account'));
    },
    theme() {
      return this.$store.state.theme;
    },
    validEmail() {
      // eslint-disable-next-line no-useless-escape
      return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.email);
    },
  },
  methods: {
    login() {
      if (this.email !== '' && this.password !== '' && this.validEmail) {
        if (this.email === 'dev@kala.com' && this.password === 'kala123') {
          const loading = this.$vs.loading({
            type: 'scale',
            color: 'dark',
          });
          setTimeout(() => {
            let token = '';
            const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            // eslint-disable-next-line no-restricted-syntax,no-unused-vars
            for (const p of possible) {
              token += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            this.$store.commit('SET_TOKEN', token);
            this.$router.push('/home');
            loading.close();
          }, 3000);
          if (this.remember) {
            this.setRemember();
          }
        } else {
          this.$vs.notification({
            title: 'Login Failed',
            text: 'Check your email or password !',
            position: 'top-right',
            progress: 'auto',
            color: 'danger',
          });
        }
      }
    },
    loginSpotify() {
      const stateKey = 'spotify_auth_state';
      let text = '';
      const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const loop = '111111111111111';
      // eslint-disable-next-line no-restricted-syntax,no-unused-vars
      for (const p of loop) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }

      const state = text;
      localStorage.setItem(stateKey, state);
      const scope = 'user-read-private user-read-email';
      window.location.replace(`https://accounts.spotify.com/authorize?${
        querystring.stringify({
          response_type: 'code',
          client_id: process.env.VUE_APP_CLIENT_ID,
          scope,
          redirect_uri: process.env.VUE_APP_REDIRECT_URI,
          state,
        })}`);
    },
    setRemember() {
      const data = JSON.stringify({
        email: this.email,
        password: Buffer.from(this.password).toString('base64'),
        remember: true,
      });
      localStorage.setItem('account', data);
    },
    toggleTheme(theme) {
      this.$store.commit('SET_THEME', theme);
      this.$vs.setTheme(theme);
    },
  },
};
</script>

<style lang="scss">
  .not-margin {
    margin: 0px;
    font-weight: normal;
    padding: 10px;
  }

  .con-form {
    width: 100%;
  }

  .con-form .flex {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .con-form .flex a {
    font-size: 0.8rem;
    opacity: 0.7;
  }

  .con-form .flex a:hover {
    opacity: 1;
  }

  .con-form .vs-checkbox-label {
    font-size: 0.8rem;
  }

  .con-form .vs-input-content {
    margin: 10px 0;
    width: calc(100%);
  }

  .con-form .vs-input-content .vs-input {
    width: 100%;
  }

  .footer-dialog {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: calc(100%);
  }

  .footer-dialog .new {
    margin-top: 20px;
    padding: 0;
    font-size: 0.7rem;
  }

  .footer-dialog .new a {
    color: rgba(var(--vs-primary), 1) !important;
    margin-left: 6px;
  }

  .footer-dialog .new a:hover {
    text-decoration: underline;
  }

  .footer-dialog .vs-button {
    margin: 0;
  }
</style>
