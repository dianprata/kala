import Vue from 'vue';
import Vuesax from 'vuesax';
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue';
import Axios from 'axios';
import Default from './layouts/Default.vue';
import Home from './layouts/Home.vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';

Vue.component('default-layout', Default);
Vue.component('home-layout', Home);
Vue.prototype.$axios = Axios;
Vue.use(Vuesax, {});
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
