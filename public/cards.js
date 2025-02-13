
export const CACHE_CARDS = 'cards-v1';

export const createCard = async (themeId, name, options, value, CardResponse) => {
  const cardData = JSON.stringify({themeId, name, options, value, responseCard: CardResponse });
  const request = new Request(`/cards/${themeId}/${name}`);
  const responseObj = new Response(cardData, { status: 200, statusText: 'success' });

  const cache = await caches.open(CACHE_CARDS);
  await cache.put(request, responseObj);
  console.log(`Carte ${name} mise en cache`);
};

export const updateCard = async (themeId, originalName, newName, options, newQuestion, originalQuestion, newResponse, originalResponse) => {
  const cardData = JSON.stringify({themeId, name: newName, options, value: newQuestion, responseCard: newResponse });

  const oldRequest = new Request(`/cards/${themeId}/${originalName}`);
  const newRequest = new Request(`/cards/${themeId}/${newName}`);
  const responseObj = new Response(cardData, { status: 200, statusText: 'success' });

  const cache = await caches.open(CACHE_CARDS);

  if (originalName !== newName) {
    await cache.delete(oldRequest);
  }

  await cache.put(newRequest, responseObj);
  console.log(`Carte ${newName} mise à jour dans le cache avec question : ${newQuestion} et réponse : ${newResponse}`);
};



export const deleteCard = async (themeId, CardName) => {
  const request = new Request(`/cards/${themeId}/${CardName}`);
  const cache = await caches.open(CACHE_CARDS);
  const deleted = await cache.delete(request);
  if (deleted) {
    console.log(`Carte ${CardName} supprimée du cache`);
  } else {
    console.warn(`Aucune Carte trouvée pour ${CardName} dans le cache`);
  }
};
