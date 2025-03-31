import { cacheAssets, cleanUpOldCaches, putInCache } from './cache.js'
import { createCategory, deleteCategory, updateCategory, CACHE_CATEGORIES } from './categories.js'
import { createCard, deleteCard, updateCard,  getDailyCards, validateCard, setMaxCardsPerDay, getMaxCardsPerDay } from './cards.js'
import { createTheme, updateTheme, deleteTheme} from './theme.js'
// Définir le cache pour les assets
const CACHE_ASSETS = 'assets-v1';



// Écoute l'événement 'install' pour mettre en cache les ressources nécessaires

self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installation...');
  event.waitUntil(cacheAssets());
});



self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activation...');
  event.waitUntil(cleanUpOldCaches());
});


// Gestion des messages du service worker
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CREATE_CATEGORY') {
    const { name, options } = event.data.data;
    createCategory(name, options);
  }

  if (event.data && event.data.type === 'UPDATE_CATEGORY') {
    const { originalName, newName, options } = event.data.data;
    updateCategory(originalName, newName, options);
  }

  if (event.data && event.data.type === 'DELETE_CATEGORY') {
    const { categoryName } = event.data;
    deleteCategory(categoryName);
  }

  if (event.data && event.data.type === 'CREATE_THEME') {
    const { categoryId, name, description } = event.data.data;
    createTheme(categoryId, name, description);
  }

  if (event.data && event.data.type === 'UPDATE_THEME') {
    const { categoryId, originalName, newName, newDescription, originalDescription } = event.data.data;
    updateTheme(categoryId, originalName, newName, newDescription, originalDescription);
  }

  if (event.data && event.data.type === 'DELETE_THEME') {
    const {categoryId, name } = event.data;
    deleteTheme(categoryId, name);
  }

  if (event.data && event.data.type === 'SET_MAX_CARDS_PER_DAY') {
    const { maxCards } = event.data.data;
    setMaxCardsPerDay(maxCards);
  }

  if (event.data && event.data.type === 'GET_MAX_CARDS_PER_DAY') {
    getMaxCardsPerDay().then(maxCards => event.ports[0].postMessage(maxCards));
  }

  if (event.data && event.data.type === 'CREATE_CARD') {
    const { themeId, name, options, value, responseCard, image } = event.data.data;
    createCard( themeId, name, options, value, responseCard, image);
  }

  if (event.data && event.data.type === 'UPDATE_CARD') {
    const { themeId, originalName, newName, options, newQuestion, originalQuestion, originalResponse, newResponse, originalImage } = event.data.data;
    updateCard( themeId, originalName, newName, options, newQuestion, originalQuestion, newResponse, originalResponse, originalImage);
  }

  if (event.data && event.data.type === 'DELETE_CARD') {
    const { themeId, cardName } = event.data;
    deleteCard( themeId, cardName);
  }

  if (event.data && event.data.type === 'GET_DAILY_CARDS') {
    getDailyCards().then(cards => event.ports[0].postMessage(cards));
  }

  if (event.data && event.data.type === 'VALIDATE_CARD') {
    const { themeId, name, success  } = event.data.data;
    updateCardReview(themeId, name, success );
  }

});

self.addEventListener("push", (event) => {
  const options = {
    body: "Prenez quelques minutes pour réviser vos cartes ! 📖",
    icon: "/icons/notification-icon.png",
    badge: "/icons/badge.png",
  }
  event.waitUntil(
    self.registration.showNotification("Rappel de révision", options)
  );
})

// Gestion des requêtes fetch
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {

        console.log(`Ressource servie depuis le cache : ${event.request.url}`);
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        return caches.open(CACHE_ASSETS).then((cache) => {
          putInCache(event.request, networkResponse.clone());
          return networkResponse;
        });
      });
    })
  );
});
