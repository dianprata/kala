import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/signup',
    name: 'Signup',
    component: () => import('../views/Signup.vue'),
  },
  {
    path: '/',
    name: 'Index',
    component: () => import('../views/Index.vue'),
  },
  {
    path: '/home',
    name: 'Home',
    meta: { layout: 'home' },
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/search',
    name: 'Search',
    meta: { layout: 'home' },
    component: () => import('../views/Search.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
