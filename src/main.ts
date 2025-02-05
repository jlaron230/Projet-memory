import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker enregistré avec succès :', registration.scope);
      })
      .catch((error) => {
        console.log('Échec de l\'enregistrement du Service Worker :', error);
      });
  });
}

app.use(createPinia())
app.use(router)

app.mount('#app')

