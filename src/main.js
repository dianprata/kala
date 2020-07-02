import Vue from 'vue';
import Vuesax from 'vuesax';
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue';
import { longClickDirective } from 'vue-long-click';
import Axios from 'axios';
import spotifyApi from './spotifyApi';
import Home from './layouts/Home.vue';
import Default from './layouts/Default.vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';

Vue.component('default-layout', Default);
Vue.component('home-layout', Home);
Vue.prototype.$axios = Axios;
Vue.prototype.$spotifyApi = spotifyApi;
spotifyApi.setAccessToken(localStorage.getItem('accessToken'));
spotifyApi.setRefreshToken(localStorage.getItem('refreshToken'));
Vue.use(Vuesax, {});
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
const longClickInstance = longClickDirective({ delay: 100, interval: 1000 });
Vue.directive('longClick', longClickInstance);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
