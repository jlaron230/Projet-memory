import { cacheAssets, cleanUpOldCaches, putInCache } from './cache.js'
import { createCategory, deleteCategory, updateCategory, CACHE_CATEGORIES } from './categories.js'
import { createCard, deleteCard, updateCard } from './cards.js'
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
    const { name, description } = event.data.data;
    createTheme(name, description);
  }

  if (event.data && event.data.type === 'UPDATE_THEME') {
    const { originalName, newName, newDescription, originalDescription } = event.data.data;
    updateTheme(originalName, newName, newDescription, originalDescription);
  }

  if (event.data && event.data.type === 'DELETE_THEME') {
    const { name } = event.data;
    deleteTheme(name);
  }

  if (event.data && event.data.type === 'CREATE_CARD') {
    const { name, options, value, response } = event.data.data;
    createCard(name, options, value, response);
  }

  if (event.data && event.data.type === 'UPDATE_CARD') {
    const { originalName, newName, options, newQuestion, originalQuestion, originalResponse, newResponse } = event.data.data;
    updateCard(originalName, newName, options, newQuestion, originalQuestion, newResponse, originalResponse);
  }

  if (event.data && event.data.type === 'DELETE_CARD') {
    const { cardName } = event.data;
    deleteCard(cardName);
  }
});

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
