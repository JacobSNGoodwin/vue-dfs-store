import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import Counter from './views/Counter.vue';
import FetchData from './views/FetchData.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'counter',
    component: Counter,
  },
  {
    path: '/fetch-data',
    name: 'fetchData',
    component: FetchData,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
