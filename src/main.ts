import { createApp } from 'vue';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import 'primeflex/primeflex.css';
import './assets/main.css';

const app = createApp(App);

app.use(PrimeVue, {
  theme: {
    preset: Aura
  }
});

app.mount('#app');
