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
    path: '/callback',
    name: 'Callback',
    component: () => import('../views/Callback.vue'),
  },
  {
    path: '/',
    name: 'Index',
    component: () => import('../views/Index.vue'),
  },
  {
    path: '/home',
    name: 'Home',
    meta: { layout: 'home', requiresAuth: true },
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/search',
    name: 'Search Default',
    meta: { layout: 'home', requiresAuth: true },
    component: () => import('../views/SearchDefault.vue'),
  },
  {
    path: '/search/:code',
    name: 'Searching',
    meta: { layout: 'home', requiresAuth: true },
    component: () => import('../views/Search.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('accessToken');
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      if (from.path === '/callback' && to.path === '/home') {
        next();
      } else {
        next({ path: '/' });
      }
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
