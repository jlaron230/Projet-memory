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

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CREATE_CATEGORY') {
    const { name, options } = event.data.data;
    console.log('Nouvelle catégorie reçue:', { name, options });

    const categoryData = JSON.stringify({ name, options });
    const request = new Request(`/categories/${name}`);
    const response = new Response(categoryData, { status: 200, statusText: 'success' });

    // Mise en cache de la catégorie
    caches.open('v1').then((cache) => {
      cache.put(request, response).then(() => {
        console.log(`Catégorie ${name} mise en cache`);
      }).catch((error) => {
        console.error('Erreur lors de la mise en cache de la catégorie :', error);
      });
    });
  }
});



const putInCache = async (request, response) => {
  const cache = await caches.open("v1");
  await cache.put(request, response);
};

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        console.log(`✅ Ressource servie depuis le cache : ${event.request.url}`);
        return cachedResponse;
      }

      // Vérification si la requête correspond à une catégorie
      const url = new URL(event.request.url);
      if (url.pathname.startsWith('/categories/')) {
        const categoryName = url.pathname.replace('/categories/', ''); // Récupère le nom de la catégorie
        console.log(`🔄 Requête pour la catégorie: ${categoryName}`);

        return caches.match(`/categories/${categoryName}`).then((cachedCategory) => {
          if (cachedCategory) {
            console.log(`✅ Catégorie ${categoryName} servie depuis le cache`);
            return cachedCategory;
          }

          console.log(`🌍 Aucune catégorie trouvée dans le cache, tentative de récupération depuis le réseau`);
          return fetch(event.request).then((networkResponse) => {
            // Mise en cache de la catégorie après récupération du réseau
            return caches.open('v1').then((cache) => {
              cache.put(event.request, networkResponse.clone());
              console.log(`📥 Catégorie ${categoryName} mise en cache`);
              return networkResponse;
            });
          });
        });
      }

      // Si ce n'est pas une requête pour une catégorie, récupérer normalement du réseau
      return fetch(event.request).then((networkResponse) => {
        return caches.open(CACHE_ASSETS).then((cache) => {
          putInCache(event.request, networkResponse.clone());
          return networkResponse;
        });
      });
    })
  );
});

