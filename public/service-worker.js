const CACHE_ASSETS = 'assets-v1';
const assets = [
  '/',
  '/index.html',
  '/manifest.json',
  '/static/main.css',
  '/static/main.js', // ⚠️ Vérifie le bon chemin de tes fichiers compilés
  '/favicon.ico'
];

// 📌 Installation du service worker
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installation...');
  event.waitUntil(
    caches.open(CACHE_ASSETS).then((cache) => {
      console.log('[ServiceWorker] Mise en cache des ressources...');
      return cache.addAll(assets);
    }).catch((error) => console.error('⚠️ Erreur de mise en cache :', error))
  );
});

// 📌 Activation du service worker et suppression des anciens caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activation...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_ASSETS) {
            console.log('[ServiceWorker] Suppression de l\'ancien cache :', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// 📌 Interception des requêtes réseau pour servir les fichiers en cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        console.log(`✅ Ressource servie depuis le cache : ${event.request.url}`);
        return cachedResponse;
      }
      console.log(`🌍 Récupération réseau : ${event.request.url}`);
      return fetch(event.request)
        .then((networkResponse) => {
          return caches.open(CACHE_ASSETS).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            console.log(`📥 Mise en cache de : ${event.request.url}`);
            return networkResponse;
          });
        })
        .catch(() => caches.match('/index.html')); // Fallback si offline
    })
  );
});
