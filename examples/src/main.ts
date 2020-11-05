import { createApp } from 'vue';
import App from './App.vue';
import router from './routes';
import counterStore from './store/counter';
import postStore from './store/posts';

import './index.css';

createApp(App)
  .use(counterStore)
  .use(postStore)
  .use(router)
  .mount('#app');
