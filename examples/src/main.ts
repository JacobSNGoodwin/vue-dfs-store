import { createApp } from 'vue';
import App from './App.vue';
import counterStore from './store/counter';

// import router from './router';

createApp(App)
  .use(counterStore.provider)
  // .use(router)
  .mount('#app');
