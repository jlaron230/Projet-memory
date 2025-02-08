const CACHE_ASSETS = 'assets-v1';
const assets = [
  '/',
  '/index.html',
  '/manifest.json',
  '/static/main.css',
  '/static/main.js',
  '/favicon.ico'
];

// Installation du service worker
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installation...');
  event.waitUntil(
    caches.open(CACHE_ASSETS).then((cache) => {
      console.log('[ServiceWorker] Mise en cache des ressources...');
      return cache.addAll(assets);
    }).catch((error) => console.error('⚠️ Erreur de mise en cache :', error))
  );
});

//  Activation du service worker et suppression des anciens caches
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

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'UPDATE_CATEGORY') {
    const { originalName, newName, options } = event.data.data;

    const categoryData = JSON.stringify({ name: newName, options });

    // Ouvrir le cache
    caches.open('v1').then((cache) => {
      const oldRequest = new Request(`/categories/${originalName}`);

      // Supprimer l'ancienne catégorie du cache si elle existe
      cache.delete(oldRequest).then(() => {
        console.log(`Ancienne catégorie ${originalName} supprimée du cache`);

        // Ajouter la nouvelle catégorie avec le nouveau nom
        const newRequest = new Request(`/categories/${newName}`);
        const response = new Response(categoryData, { status: 200, statusText: 'success' });

        cache.put(newRequest, response).then(() => {
          console.log(`Catégorie ${newName} mise à jour dans le cache`);
        }).catch((error) => {
          console.error('Erreur lors de la mise à jour du cache de la catégorie :', error);
        });
      }).catch((error) => {
        console.error('Erreur lors de la suppression de l\'ancienne catégorie du cache :', error);
      });
    });
  }

  if (event.data && event.data.type === 'DELETE_CATEGORY') {
    const categoryName = event.data.category;
    console.log('Suppression de la catégorie dans le service worker:', categoryName);

    // Supprimer la catégorie du cache
    caches.open('v1').then((cache) => {
      const request = new Request(`/categories/${categoryName}`);
      cache.delete(request).then(() => {
        console.log(`Catégorie ${categoryName} supprimée du cache du Service Worker`);
      }).catch((error) => {
        console.error('Erreur lors de la suppression du cache de la catégorie :', error);
      });
    });
  }
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        console.log(` Ressource servie depuis le cache : ${event.request.url}`);
        return cachedResponse;
      }

      // Si ce n'est pas une catégorie, on récupère normalement du réseau
      return fetch(event.request).then((networkResponse) => {
        return caches.open(CACHE_ASSETS).then((cache) => {
          putInCache(event.request, networkResponse.clone());
          return networkResponse;
        });
      });
    })
  );
});

const putInCache = async (request, response) => {
  const url = new URL(request.url);
  if (!url.protocol.includes('http')) {
    console.warn(`mise en cache impossible sur ${request.url}`);
    return;
  }
  const cache = await caches.open("v1");
  await cache.put(request, response);
};
