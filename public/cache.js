// cache.js
export const cacheAssets = () => {
  return caches.open('assets-v1').then((cache) => {
    console.log('[ServiceWorker] Mise en cache des ressources...');
    return cache.addAll([
      '/',
      '/index.html',
      '/manifest.json',
      '/static/main.css',
      '/static/main.js',
      '/favicon.ico'
    ]);
  }).catch((error) => {
    console.error('⚠️ Erreur de mise en cache :', error);
  });
};

export const cleanUpOldCaches = () => {
  return caches.keys().then((cacheNames) => {
    return Promise.all(
      cacheNames.map((cache) => {
        if (cache !== 'assets-v1') {
          console.log('[ServiceWorker] Suppression de l\'ancien cache :', cache);
          return caches.delete(cache);
        }
      })
    );
  });
};

export const putInCache = async (request, response) => {
  const url = new URL(request.url);
  if (!url.protocol.includes('http')) {
    console.warn(`mise en cache impossible sur ${request.url}`);
    return;
  }
  const cache = await caches.open('v1');
  await cache.put(request, response);
};
