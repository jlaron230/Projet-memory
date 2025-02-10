
export const CACHE_CARDS = 'cards-v1';

export const createCard = async (name, options, value) => {
  const cardData = JSON.stringify({ name, options, value });
  const request = new Request(`/cards/${name}`);
  const response = new Response(cardData, { status: 200, statusText: 'success' });

  const cache = await caches.open(CACHE_CARDS);
  await cache.put(request, response);
  console.log(`Carte ${name} mise en cache`);
};

export const updateCard = async (originalName, newName, options, newQuestion, originalQuestion) => {
  const cardData = JSON.stringify({ name: newName, options, newQuestion, originalQuestion });
  const oldRequest = new Request(`/cards/${originalName}`);
  const newRequest = new Request(`/cards/${newName}`);
  const oldRequestQuestion = new Request(`/cards/${originalQuestion}`);
  const response = new Response(cardData, { status: 200, statusText: 'success' });

  const cache = await caches.open(CACHE_CARDS);
  await cache.delete(oldRequest, oldRequestQuestion);
  await cache.put(newRequest, response);
  console.log(`Carte ${newName} et ${newQuestion} mise à jour dans le cache`);
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
