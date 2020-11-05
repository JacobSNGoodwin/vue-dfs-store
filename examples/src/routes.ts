import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import Counter from './views/Counter.vue';
import FetchPosts from './views/FetchPosts.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Counter',
    component: Counter,
  },
  {
    path: '/fetch-posts',
    name: 'Fetch Posts',
    component: FetchPosts,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
