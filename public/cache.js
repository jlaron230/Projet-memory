// cache.js
export const cacheAssets = () => {
  //Ouverture ou création du cache
  return caches.open('assets-v1').then((cache) => {
    console.log('[ServiceWorker] Mise en cache des ressources...');
    // Ajout de toutes les ressources statiques à la cache
    return cache.addAll([
      '/',
      '/index.html',
      '/manifest.json',
      '/static/main.css',
      '/static/main.js',
      '/favicon.ico'
    ]);
  }).catch((error) => {
    console.error('Erreur de mise en cache :', error);
  });
};

export const cleanUpOldCaches = () => {
  //On récupère l'identifiant des caches avec les clés
  return caches.keys().then((cacheNames) => {
    //retourne une promesse de la requête
    return Promise.all(
      //On map sur les fichiers de cache
      cacheNames.map((cache) => {
        //Si le fichier de cache est trouvé on le supprime
        if (cache !== 'assets-v1') {
          console.log('[ServiceWorker] Suppression de l\'ancien cache :', cache);
          return caches.delete(cache);
        }
      })
    );
  });
};

export const putInCache = async (request, response) => {
  // Extraction de l'URL de la requête pour vérifier son protocole
  const url = new URL(request.url);
  // Vérification si la requête concerne une extension Chrome (impossible à mettre en cache)
  if (url.protocol === "chrome-extension:") {
    console.warn("Mise en cache impossible pour :", request.url);
    return;
  }
  // Ouverture (ou création si inexistant) du cache nommé 'v1'
  const cache = await caches.open('v1');
  // Ajout de la réponse en cache associée à la requête
  await cache.put(request, response);
};
