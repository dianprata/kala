<template>
  <vs-navbar center-collapsed shadow fixed class="page-navbar">
    <template #left>
      <div class="nav-search">
        <vs-input placeholder="Search" v-model="search" @keypress="searching"></vs-input>
      </div>
    </template>
    <template #right>
      <div class="popper">
        <vs-button
            circle
            icon
            dark
            flat
            @click.prevent="profileDropdown=!profileDropdown"
        >
          <i class="fa fa-user" style="font-size: 1rem"></i>
        </vs-button>
        <div v-show="profileDropdown" class="popper-content">
          <ul class="account-menu">
            <li class="account-item">
              <router-link to="#" class="account-link">
                Pengaturan akun
                <i class="fa fa-angle-right"></i>
              </router-link>
            </li>
            <li class="account-item">
              <router-link to="#" class="account-link">
                Mengelola Penyisihan saya
                <i class="fa fa-angle-right"></i>
              </router-link>
            </li>
            <li class="account-item">
              <router-link to="#" class="account-link">
                Mengaktifkan kode
                <i class="fa fa-angle-right"></i>
              </router-link>
            </li>
            <li class="account-item">
              <span @click="logout" class="account-link">Logout</span>
            </li>
            <hr>
            <li class="account-item">
              <span>Dark Mode</span>
              <vs-switch v-model="darkMode" color="danger" @click="changeDarkMode">
                <template #circle>
                  <i v-if="!darkMode" class='fa fa-sun' ></i>
                  <i v-else class='fa fa-moon' ></i>
                </template>
              </vs-switch>
            </li>
          </ul>
        </div>
      </div>
    </template>
  </vs-navbar>
</template>

<script>
import _ from 'lodash';

export default {
  name: 'Navbar',
  data() {
    return {
      profileDropdown: false,
      search: '',
    };
  },
  watch: {
    search() {
      this.searching();
    },
  },
  computed: {
    theme() {
      return this.$store.state.theme;
    },
    darkMode() {
      return this.$store.getters.darkMode;
    },
  },
  methods: {
    logout() {
      setTimeout(() => {
        this.$store.commit('SET_TOKEN', '');
        this.$store.commit('SET_REFRESH_TOKEN', '');
        this.$router.push('/');
      }, 1000);
    },
    changeDarkMode() {
      if (this.darkMode) {
        this.$vs.setTheme('light');
        this.$store.commit('SET_THEME', 'light');
      } else {
        this.$vs.setTheme('dark');
        this.$store.commit('SET_THEME', 'dark');
      }
    },
    searching: _.debounce(function () {
      const search = encodeURIComponent(this.search.trim());
      this.$router.push(`/search/${search}`);
    }, 1500),
  },
};
</script>

<style scoped>

</style>
