
export const CACHE_CARDS = 'cards-v1';

export const createCard = async (name, options) => {
  const cardData = JSON.stringify({ name, options });
  const request = new Request(`/cards/${name}`);
  const response = new Response(cardData, { status: 200, statusText: 'success' });

  const cache = await caches.open(CACHE_CARDS);
  await cache.put(request, response);
  console.log(`Carte ${name} mise en cache`);
};

export const updateCard = async (originalName, newName, options) => {
  const cardData = JSON.stringify({ name: newName, options });
  const oldRequest = new Request(`/cards/${originalName}`);
  const newRequest = new Request(`/cards/${newName}`);
  const response = new Response(cardData, { status: 200, statusText: 'success' });

  const cache = await caches.open(CACHE_CARDS);
  await cache.delete(oldRequest);
  await cache.put(newRequest, response);
  console.log(`Carte ${newName} mise à jour dans le cache`);
};

export const deleteCard = async (CardName) => {
  const request = new Request(`/cards/${CardName}`);
  const cache = await caches.open('cards-v1');
  const deleted = await cache.delete(request);
  if (deleted) {
    console.log(`Carte ${CardName} supprimée du cache`);
  } else {
    console.warn(`Aucune Carte trouvée pour ${CardName} dans le cache`);
  }
};
