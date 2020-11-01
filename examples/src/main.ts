import { createApp } from 'vue';
import App from './App.vue';
import router from './routes';
import counterStore from './store/counter';

import './index.css';

createApp(App)
  .use(counterStore)
  .use(router)
  .mount('#app');
