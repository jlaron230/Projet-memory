if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(function(registration) {  // L'enregistrement a fonctionné//
      console.log('Enregistrement du service worker réussi pour le périmètre : ', registration.scope)
    }, function(err) {
      // L'enregistrement a échoué :(
      console.log('Échec de l\'enregistrement du service worker: ', err)
    })
  })
}

self.addEventListener('install', function(event) {
  // Code exécuté à l'installation du service worker
})

const CACHE_ASSETS = 'assets-v1'
const assets = ['/', '/static/main.css', '/static/main.js', '/index.html', '/manifest.json']
self.addEventListener('install', function(event) {
  // Installation du service worker
  // On utillise le cache des assets
  event.waitUntil(caches.open(CACHE_ASSETS).then(function(cache) {  // On pre-cache tous nos assets utiles
      return cache.addAll(assets)
    })
  )
})

self.addEventListener('activate', function(event) {
  //Définition des clés de conteneurs de cache à jour
  const cacheWhitelist = ['assets-cache-v2', 'other-cache-v2']
  event.waitUntil(  // Récupération de tous les conteneurs  de cache existants sur le périmètre
    caches.keys().then(function(cacheNames) {
      return Promise.all(cacheNames.map(function(cacheName) {  // Si le conteneur de cache ne fait pas partie de la liste à jour, on le purge
        if (cacheWhitelist.indexOf(cacheName) === -1) {
          return caches.delete(cacheName)
        }
      }))
    }))
})

self.addEventListener('fetch', function(event) {
  const requestUrl = new URL(event.request.url)
  if (requestUrl.pathname.startsWith('/static')) {
    // On ouvre le cache des assets
    const promiseResponse = caches.open(CACHE_ASSETS).then(function(cache) {  // On cherche si la requête existe dans le cache
      return cache.match(event.request).then(function(response) {
        if (response) {
          // Si la requête existe dans le cache,
// on renvoie la réponse trouvée
          return response
        } else {
          // Sinon on va chercher la ressource sur le serveur
          return fetch(event.request).then(function(response) {  // Une fois qu'on a reçu la réponse, on met en cache  // pour la prochaine fois.  // On n'oublie pas de cloner la réponse pour pouvoir  // la mettre en cache.  // Une réponse ne peut être lue qu'une seule fois,   // d'où le clone.
            cache.put(event.request, response.clone())  // Et on retourne la réponse
            return response
          })
        }
      })
    })  // Une fois que la promesse a fini de s'exécuter, on envoie la réponse  event.respondWith(promiseResponse);  } });
  }
})
