import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

if ('serviceWorker' in navigator) {
  window.addEventListener('load',async () => {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        type: 'module'
      })
      console.log('Service Worker enregistré avec succès :', registration.scope);

      if (registration.waiting) {
        console.log(' Service Worker en attente d\'activation, mise à jour en cours...');
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
      registration.addEventListener('updatefound', () => {
        const network = registration.installing
        if (network) {
          network.addEventListener('statechange', () => {
            if (network.state === 'activated') {
              console.log('service Worker activé immédiatement !')
              window.location.reload()
            }
          })
        }
      })
    }
  catch (error) {
    console.error('Échec de l\'enregistrement du Service Worker :', error);
  }});
}

app.use(createPinia())
app.use(router)

app.mount('#app')

