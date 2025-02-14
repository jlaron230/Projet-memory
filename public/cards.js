import { CACHE_CATEGORIES } from './categories.js'

export const CACHE_CARDS = 'cards-v1'
const MAX_CARDS_PER_DAY = 3
const CACHE_SETTINGS = 'settings-v1'
const REVIEW_INTERVALS = [1, 3, 7, 14, 30];

// Fonction pour définir le nombre de nouvelles cartes par jour
export const setMaxCardsPerDay = async (maxCards) => {
  const cache = await caches.open(CACHE_SETTINGS);
  const settings = JSON.stringify({ maxCardsPerDay: maxCards });
  await cache.put('/settings/maxCardsPerDay', new Response(settings, { status: 200, statusText: 'success' }));
  console.log(`Nombre de cartes par jour défini à ${maxCards}`);
};

// Fonction pour récupérer le paramètre du nombre de cartes par jour
export const getMaxCardsPerDay = async () => {
  const cache = await caches.open(CACHE_SETTINGS);
  const response = await cache.match('/settings/maxCardsPerDay');
  if (response) {
    const data = await response.json();
    return data.maxCardsPerDay || DEFAULT_MAX_CARDS_PER_DAY;
  }
  return DEFAULT_MAX_CARDS_PER_DAY;
};

export const createCard = async (themeId, name, options, value, CardResponse, level = 1) => {
  const cardData = JSON.stringify({
    themeId,
    name,
    options,
    value,
    responseCard: CardResponse,
    level,
    lastReviewed: null,
    nextReview: new Date().toISOString().split('T')[0],
  })
  const request = new Request(`/cards/${themeId}/${name}`)
  const responseObj = new Response(cardData, { status: 200, statusText: 'success' })

  const cache = await caches.open(CACHE_CARDS)
  const existingCard = await cache.match(request)
  if (existingCard) {
    console.warn(`La carte ${name} existe déjà dans le cache, ajout annulé.`)
    return
  }
  await cache.put(request, responseObj)
  console.log(`Carte ${name} mise en cache`)
}

export const updateCard = async (
  themeId,
  originalName,
  newName,
  options,
  newQuestion,
  originalQuestion,
  newResponse,
  originalResponse,
  level,
) => {
  const cardData = JSON.stringify({
    themeId,
    name: newName,
    options,
    value: newQuestion,
    responseCard: newResponse,
    level,
  })

  const oldRequest = new Request(`/cards/${themeId}/${originalName}`)
  const newRequest = new Request(`/cards/${themeId}/${newName}`)
  const responseObj = new Response(cardData, { status: 200, statusText: 'success' })

  const cache = await caches.open(CACHE_CARDS)

  if (originalName !== newName) {
    await cache.delete(oldRequest)
  }

  await cache.put(newRequest, responseObj)
  console.log(
    `Carte ${newName} mise à jour dans le cache avec question : ${newQuestion} et réponse : ${newResponse}`,
  )
}

export const deleteCard = async (themeId, CardName) => {
  const request = new Request(`/cards/${themeId}/${CardName}`)
  const cache = await caches.open(CACHE_CARDS)
  const deleted = await cache.delete(request)
  if (deleted) {
    console.log(`Carte ${CardName} supprimée du cache`)
  } else {
    console.warn(`Aucune Carte trouvée pour ${CardName} dans le cache`)
  }
}

export async function getDailyCards() {
  const cache = await caches.open(CACHE_CARDS);
  const keys = await cache.keys();
  const today = new Date();

  let dailyCards = [];

  for (let request of keys) {
    if (!request.url.includes('/cards/themeId/cardName')) continue;

    const response = await cache.match(request);
    const cardData = await response.json();

    const nextReviewDate = new Date(cardData.nextReview);
    if (nextReviewDate <= today) {
      dailyCards.push(cardData);
    }
  }

  return dailyCards;
}

export async function updateCardReview(themeId, cardName, success) {
  const cache = await caches.open(CACHE_CARDS);
  const key = `card-${themeId}-${cardName}`;

  let cardData = await cache.match(key).then(res => res ? res.json() : null);

  if (!cardData) {
    console.warn(`Carte non trouvée dans le cache : ${cardName}`);
    return;
  }

  let { level, nextReview } = cardData;

  if (success) {
    level = Math.min(level + 1, 5); // Augmente le niveau, max 5
  } else {
    level = Math.max(level - 1, 1); // Diminue le niveau, min 1
  }

  // Calculer la nouvelle date de révision en fonction du niveau
  const daysToWait = [1, 3, 7, 14, 30]; // Espacement progressif
  nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + daysToWait[level - 1]);

  // Mettre à jour dans le cache
  await cache.put(key, new Response(JSON.stringify({ ...cardData, level, nextReview })));

  console.log(`Carte "${cardName}" mise à jour : niveau ${level}, prochaine révision le ${nextReview}`);
}

export const validateCard = async (themeId, name, success) => {
  const request = new Request(`/cards/${themeId}/${name}`)
  const cache = await caches.open(CACHE_CARDS)
  const response = await cache.match(request)
  if (response) {
    const card = await response.json();
    const today = new Date();
    if (success) {
      card.level = Math.min(card.level + 1, 5);
    } else {
      card.level = Math.max(card.level - 1, 1);
    }

    const nextReviewDate = new Date(today);
    nextReviewDate.setDate(today.getDate() + REVIEW_INTERVALS[card.level - 1]);
    card.lastReviewed = today.toISOString().split('T')[0];
    card.nextReview = nextReviewDate.toISOString().split('T')[0];

    const updatedResponse = new Response(JSON.stringify(card), {
      status: 200,
      statusText: 'success',
    });

    await cache.put(request, updatedResponse);
    console.log(`Carte ${name} mise à jour : Niveau ${card.level}, prochaine révision le ${card.nextReview}`);
  }
};
