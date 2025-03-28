import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
// Importation de la configuration du routeur Vue
import router from './router'

// Création de l'instance de l'application Vue
const app = createApp(App)

// Vérification si le navigateur supporte les Service Workers
if ('serviceWorker' in navigator) {
  // Lorsque la fenêtre est chargée, nous tentons d'enregistrer le Service Worker
  window.addEventListener('load',async () => {
    try {
      // Enregistrement du Service Worker (fichier `service-worker.js`)
      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        type: 'module'
      })
      console.log('Service Worker enregistré avec succès :', registration.scope);

      // Si le Service Worker est en attente d'activation, on lui demande de passer à l'état actif immédiatement
      if (registration.waiting) {
        console.log(' Service Worker en attente d\'activation, mise à jour en cours...');
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
      // Écoute de l'événement `updatefound` lors de la découverte d'une nouvelle version du Service Worker
      registration.addEventListener('updatefound', () => {
        const network = registration.installing
        if (network) {
          // Surveillance de l'état du Service Worker jusqu'à ce qu'il soit activé
          network.addEventListener('statechange', () => {
            if (network.state === 'activated') {
              // Lorsque le Service Worker est activé, recharger la page pour appliquer les changements
              console.log('service Worker activé immédiatement !')
              window.location.reload()
            }
          })
        }
      })
    }
  catch (error) {
    // Gestion des erreurs si l'enregistrement du Service Worker échoue
    console.error('Échec de l\'enregistrement du Service Worker :', error);
  }});
}

app.use(createPinia())
app.use(router)

app.mount('#app')

