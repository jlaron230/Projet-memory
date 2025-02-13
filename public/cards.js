import { CACHE_CATEGORIES } from './categories.js'

export const CACHE_CARDS = 'cards-v1';
const MAX_CARDS_PER_DAY = 5;

export const createCard = async (themeId, name, options, value, CardResponse ,level = 1) => {
  const cardData = JSON.stringify({themeId, name, options, value, responseCard: CardResponse, level, lastReviewed: null });
  const request = new Request(`/cards/${themeId}/${name}`);
  const responseObj = new Response(cardData, { status: 200, statusText: 'success' });

  const cache = await caches.open(CACHE_CARDS);
  await cache.put(request, responseObj);
  console.log(`Carte ${name} mise en cache`);
};

export const updateCard = async (themeId, originalName, newName, options, newQuestion, originalQuestion, newResponse, originalResponse, level) => {
  const cardData = JSON.stringify({themeId, name: newName, options, value: newQuestion, responseCard: newResponse, level });

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

export const GetDailyCards = async () => {
  const cache = await caches.open(CACHE_CARDS);
  const requests = await caches.keys();
  const cards = await Promise.all(
    requests.map(async (request) => {
      const response = await cache.match(request);
      return response ? response.json() : null;
    })
  )

  const today = new Date().toISOString().split('T')[0];
  const filteredCards = cards
    .filter((card) => card && (!card.lastReviewed || card.lastReviewed !== today))
    .sort((a, b) => b.level - a.level)
    .slice(0, MAX_CARDS_PER_DAY);

  return filteredCards;
}

export const validateCard = async (themeId, name) => {
  const request = new Request(`/cards/${themeId}/${name}`);
  const cache = await caches.open(CACHE_CARDS);
  const response = await cache.match(request);

  if (response) {
    const card = await response.json();
    card.level += 1;
    card.lastReviewed = new Date().toISOString().split('T')[0];
    const updatedResponse = new Response(JSON.stringify(card), { status: 200, statusText: 'success' });
    await cache.put(request, updatedResponse);
    console.log(`Carte ${name} validée, nouveau niveau : ${card.level}`);
  }
};
