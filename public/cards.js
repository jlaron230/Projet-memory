//export de fichier de cache
export const CACHE_CARDS = 'cards-v1'
//déclaration de la limite par jour
const DEFAULT_MAX_CARDS_PER_DAY = 3
//déclaration du paramètre
const CACHE_SETTINGS = 'settings-v1'
//Interval de révision
const REVIEW_INTERVALS = [1, 3, 7, 14, 30]

// Fonction pour définir le nombre de nouvelles cartes par jour
export const setMaxCardsPerDay = async (maxCards) => {
  const cache = await caches.open(CACHE_SETTINGS)
  const settings = JSON.stringify({ maxCardsPerDay: maxCards })
  await cache.put(
    '/settings/maxCardsPerDay',
    new Response(settings, {
      status: 200,
      statusText: 'success',
    }),
  )
  console.log(`Nombre de cartes par jour défini à ${maxCards}`)
}

// Fonction pour récupérer le paramètre du nombre de cartes par jour
export const getMaxCardsPerDay = async () => {
  const cache = await caches.open(CACHE_SETTINGS)
  const response = await cache.match('/settings/maxCardsPerDay')

  if (response) {
    const data = await response.json()
    return data.maxCardsPerDay || DEFAULT_MAX_CARDS_PER_DAY
  }
  return DEFAULT_MAX_CARDS_PER_DAY
}

//fonction pour la création de carte
export const createCard = async (themeId, name, options, value, CardResponse, level = 1, image) => {
  //On converti les données en json
  const cardData = JSON.stringify({
    themeId,
    name,
    options,
    value,
    responseCard: CardResponse,
    level,
    image,
    lastReviewed: null,
    nextReview: new Date().toISOString().split('T')[0],
  })
  //Envoi de la requête avec en paramètre l'id du thème et le nom de la carte
  const request = new Request(`/cards/${themeId}/${name}`)
  const responseObj = new Response(cardData, { status: 200, statusText: 'success' })

  //On vérifie que la carte n'existe pas déjà dans le dossier de cache
  const cache = await caches.open(CACHE_CARDS)
  const existingCard = await cache.match(request)
  if (existingCard) {
    console.warn(`La carte ${name} existe déjà dans le cache, ajout annulé.`)
    return
  }
  //On met à jour le cache avec la nouvelle carte récemment crée
  await cache.put(request, responseObj)
  console.log(`Carte ${name} mise en cache`)
}

//Fonction pour mettre à jour une carte
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
  //On converti les données en json
  const cardData = JSON.stringify({
    themeId,
    name: newName,
    options,
    value: newQuestion,
    responseCard: newResponse,
    level,
  })
  //On met à jour avec 2 requêtes, une pour le nom original et et celui pour le nouveau avec l'objet
  const oldRequest = new Request(`/cards/${themeId}/${originalName}`)
  const newRequest = new Request(`/cards/${themeId}/${newName}`)
  const responseObj = new Response(cardData, { status: 200, statusText: 'success' })

  const cache = await caches.open(CACHE_CARDS)
  //Si l'ancien nom est différent du nouveau, on supprime du cache l'ancien nom de la carte
  if (originalName !== newName) {
    await cache.delete(oldRequest)
  }
  //On met à jour avec le nouvelle request
  await cache.put(newRequest, responseObj)
  console.log(
    `Carte ${newName} mise à jour dans le cache avec question : ${newQuestion} et réponse : ${newResponse}`,
  )
}

//fonction pour supprimer une carte
export const deleteCard = async (themeId, CardName) => {
  //Sélection du nom de la carte
  const request = new Request(`/cards/${themeId}/${CardName}`)
  const cache = await caches.open(CACHE_CARDS)
  const deleted = await cache.delete(request)
  //Si la carte est trouvée on la supprime du cache
  if (deleted) {
    console.log(`Carte ${CardName} supprimée du cache`)
  } else {
    console.warn(`Aucune Carte trouvée pour ${CardName} dans le cache`)
  }
}

//Fonction pour la révision espacée
export async function getDailyCards() {
  const cache = await caches.open(CACHE_CARDS)
  //l'identifiant unique d'un objet dans le cache
  const keys = await cache.keys()
  //On récupère une nouvelle date
  const today = new Date()

  let dailyCards = []
  //On boucle pour toutes les requêtes sur les clés présente
  for (let request of keys) {
    if (!request.url.includes('/cards/themeId/cardName')) continue

    const response = await cache.match(request)
    const cardData = await response.json()
    //Si la prochaine date de révision et inférieur à celle d'aujourd'hui on transmet les données de la carte révisé
    const nextReviewDate = new Date(cardData.nextReview)
    if (nextReviewDate <= today) {
      dailyCards.push(cardData)
    }
  }

  return dailyCards
}

//Fonction pour mettre à jour les cartes de révision
export async function updateCardReview(themeId, cardName, success) {
  const cache = await caches.open(CACHE_CARDS)
  const key = new Request(`/cards/${themeId}/${cardName}`)

  let cardData = await cache.match(key).then((res) => (res ? res.json() : null))

  if (!cardData) {
    console.warn(`Carte non trouvée dans le cache : ${cardName}`)
    return
  }

  let { level, nextReview } = cardData

  if (success) {
    level = Math.min(level + 1, 5) // Augmente le niveau, max 5
  } else {
    level = Math.max(level - 1, 1) // Diminue le niveau, min 1
  }

  // Calculer la nouvelle date de révision en fonction du niveau
  const daysToWait = [1, 3, 7, 14, 30] // Espacement progressif
  nextReview = new Date()
  nextReview.setDate(nextReview.getDate() + daysToWait[level - 1])

  // Met à jour dans le cache
  await cache.put(key, new Response(JSON.stringify({ ...cardData, level, nextReview })))

  console.log(
    `Carte "${cardName}" mise à jour : niveau ${level}, prochaine révision le ${nextReview}`,
  )
}

//fonction de validation de carte
export const validateCard = async (themeId, name, success) => {
  const request = new Request(`/cards/${themeId}/${name}`)
  const cache = await caches.open(CACHE_CARDS)
  // Recherche de la carte dans le cache
  const response = await cache.match(request)

  // Vérification si la carte existe bien dans le cache
  if (response) {
    const card = await response.json()
    const today = new Date()
    // Mise à jour du niveau de la carte en fonction du succès ou de l'échec
    if (success) {
      card.level = Math.min(card.level + 1, 5)
    } else {
      card.level = Math.max(card.level - 1, 1)
    }

    // Calcul de la prochaine date de révision selon le niveau
    const nextReviewDate = new Date(today)
    nextReviewDate.setDate(today.getDate() + REVIEW_INTERVALS[card.level - 1])

    // Mise à jour des métadonnées de révision
    card.lastReviewed = today.toISOString().split('T')[0]
    card.nextReview = nextReviewDate.toISOString().split('T')[0]
    // Création d'une nouvelle réponse avec les données mises à jour
    const updatedResponse = new Response(JSON.stringify(card), {
      status: 200,
      statusText: 'success',
    })

    await cache.put(request, updatedResponse)
    console.log(
      `Carte ${name} mise à jour : Niveau ${card.level}, prochaine révision le ${card.nextReview}`,
    )
  }
}
