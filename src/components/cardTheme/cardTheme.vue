<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import buttondelete from '@/components/button/button-delete.vue'
import { PencilIcon } from '@heroicons/vue/20/solid'
import modalMemory from '@/components/cardTheme/modalMemory.vue'

const CardName = ref<string>('') // Pour la création de la carte
const CardQuestion = ref<string>('') // Pour la création de la question
const CardResponse = ref<string>('') // Pour la création de la réponse
const cards = ref<any[]>([]) // Liste des cartes
const isEditable = ref(false) // Si un formulaire est en mode édition
const editingCard = ref<any | null>(null) // carte en édition
const isModalOpen = ref(false)
const selectedQuestion = ref<string | null>(null)
const selectedNameCard = ref<string | null>(null)
const selectedResponseCard = ref<string | null>(null)
const props = defineProps<{themeId: string}>();

// Fonction pour activer et désactiver la modal
const modalVisible = (question: string, nameCard: string, responseC: string) => {
  isModalOpen.value = true
  selectedQuestion.value = question
  selectedNameCard.value = nameCard
  selectedResponseCard.value = responseC
}

// Filtrage des thèmes en fonction de la catégorie sélectionnée
const filteredThemes = computed(() => {
  return cards.value.filter((card) => card.themeId == props.themeId);
})

const closeModal = () => {
  isModalOpen.value = false
  selectedQuestion.value = null
  selectedNameCard.value = null
  selectedResponseCard.value = null
}

// Fonction pour activer l'édition
const toggleEdit = (cards: any) => {
  // Garde une référence à la carte à éditer
  editingCard.value = cards
  CardName.value = cards.name // Affiche les options sous forme de texte
  CardQuestion.value = cards.value // Affiche les options sous forme de texte
  CardResponse.value = cards.responseCard
  isEditable.value = true
}

// Fonction pour créer une nouvelle carte
const CreateCards = () => {
  if (!CardName.value.trim() && !CardQuestion.value.trim() && !CardResponse.value.trim()) {
    alert('Le nom de la carte et la question est requis')
    return
  }

  const cardData = {
    name: CardName.value,
    value: CardQuestion.value,
    responseCard: CardResponse.value,
    themeId: props.themeId,
  }

  // Envoi de la carte au Service Worker
  if (navigator.serviceWorker && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'CREATE_CARD',
      data: cardData,
    })
    console.log('Carte envoyée au Service Worker:', cardData)

    // Ajout immédiat de la carte dans la liste
    cards.value.push(cardData)
  } else {
    console.error('Service Worker non disponible')
  }

  // Réinitialisation des champs du formulaire
  CardName.value = ''
  CardQuestion.value = ''
  CardResponse.value = ''
}

// Fonction pour récupérer les cartes depuis le cache
const getCardsFromCache = async () => {
  if (navigator.serviceWorker && navigator.serviceWorker.controller) {
    const cache = await caches.open('cards-v1')
    const cachedCards = []

    const cacheKeys = await cache.keys()
    console.log('Clés du cache :', cacheKeys)

    for (const request of cacheKeys) {
      const requestUrl = new URL(request.url)

      if (requestUrl.pathname.startsWith('/cards/')) {
        // Vérifie bien que les cartes sont dans le bon cache
        try {
          const response = await cache.match(request)

          if (response && response.ok) {
            const cardData = await response.json()
            console.log('Carte récupérée depuis le cache :', cardData)
            cachedCards.push(cardData)
          }
          } catch (error) {
          console.error('Erreur lors de la récupération de la carte du cache :', error)
        }
      }
    }

    cards.value = cachedCards.filter(theme => theme.themeId === props.themeId)
    console.log('cartes après récupération du cache :', cards.value)
  }
}

// Fonction pour mettre à jour une carte
const PutCards = () => {
  if (!CardName.value.trim() && !CardQuestion.value.trim() && !CardResponse.value.trim()) {
    alert('Le nom de la carte et la question est requis')
    return
  }

  // Mise à jour de la carte dans le tableau local de Vue
  const cardIndex = cards.value.findIndex((c) => c.name === editingCard.value.name)
  if (cardIndex !== -1) {
    cards.value = cards.value.map((c, i) =>
      i === cardIndex
        ? {
            themeId: props.themeId,
            name: CardName.value,
            value: CardQuestion.value,
            responseCard: CardResponse.value,
          }
        : c,
    )
  }

  // Envoi de la mise à jour au Service Worker pour qu'il mette à jour le cache
  if (navigator.serviceWorker && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'UPDATE_CARD',
      data: {
        originalName: editingCard.value.name, // Nom original à mettre à jour
        newName: CardName.value, // Nouveau nom// Options mises à jour
        originalQuestion: editingCard.value.value,
        newQuestion: CardQuestion.value,
        originalResponse: editingCard.value.responseCard,
        newResponse: CardResponse.value,
        themeId: props.themeId,
      },
    })
  }

  // Désactiver l'édition après avoir sauvegardé
  isEditable.value = false
  editingCard.value = null
  CardName.value = ''
  CardQuestion.value = ''
  CardResponse.value = ''
}

// Fonction pour annuler l'édition
const cancelEdit = () => {
  isEditable.value = false
  editingCard.value = null
  CardName.value = ''
  CardQuestion.value = ''
  CardResponse.value = ''
}

// Fonction pour supprimer une carte
const DeleteCards = async (cardName: string) => {
  if (!cardName || typeof cardName !== 'string') return console.error('Nom de carte invalide')

  console.log(`Suppression de la carte : ${cardName}`)

  // 1. Supprimer de la liste locale
  cards.value = cards.value.filter((c) => c.name !== cardName)

  // 2. Supprimer du cache et envoyer au Service Worker
  if ('caches' in window) {
    try {
      const cache = await caches.open('cards-v1')
      for (const request of await cache.keys()) {
        if (new URL(request.url).pathname === `/cards/${encodeURIComponent(cardName)}`) {
          await cache.delete(request)
          console.log(`Carte supprimée du cache`)
          break
        }
      }
      navigator.serviceWorker?.controller?.postMessage({ type: 'DELETE_CARD', cardName: cardName, themeId: props.themeId })
    } catch (error) {
      console.error('Erreur lors de la suppression du cache', error)
    }
  }
}

onMounted(() => {
  if (navigator.serviceWorker) {
    navigator.serviceWorker.ready
      .then((registration) => {
        console.log('Service Worker est prêt')
        // Appelle la fonction pour récupérer les cartes à partir du cache ici
        getCardsFromCache()
      })
      .catch((error) => {
        console.error("Service Worker n'est pas prêt :", error)
      })
  } else {
    console.error("Service Worker n'est pas pris en charge par ce navigateur")
  }
})
</script>

<template>
  <section class="bg-white shadow-sm">
    <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex place-content-between">
      <h1 class="text-3xl font-bold tracking-tight text-gray-900">Mes cartes</h1>
    </div>
    <!-- Formulaire pour créer une carte -->
    <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <form @submit.prevent="CreateCards" class="mt-5 flex flex-col gap-4">
        <div>
          <label for="cardName" class="block text-sm font-medium text-gray-700"
            >Nom de la carte</label
          >
          <input
            id="cardName"
            v-model="CardName"
            type="text"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          <label for="cardQuestion" class="block text-sm font-medium text-gray-700">Question</label>
          <input
            id="cardQuestion"
            v-model="CardQuestion"
            type="text"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          <label for="cardResponse" class="block text-sm font-medium text-gray-700">Réponse</label>
          <input
            id="cardResponse"
            v-model="CardResponse"
            type="text"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div class="flex justify-end">
          <button
            type="submit"
            class="inline-flex items-center rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white ring-1 shadow-xs ring-blue-300 ring-inset hover:bg-blue-600"
          >
            Créer la carte
          </button>
        </div>
      </form>

      <!-- Liste des cartes -->
      <div v-if="filteredThemes.length > 0" class="space-y-6">
        <div
          v-for="(card, index) in filteredThemes"
          :key="index"
          class="bg-gray-100 p-4 rounded-lg flex gap-4"
           >
          <div class="flex items-center gap-4">
            <!-- Afficher le nom de la carte si on n'est pas en mode édition -->
            <h2 v-if="editingCard?.name !== card.name" class="text-xl font-semibold text-gray-900">
              <a href="#" @click.prevent="modalVisible(card.value, card.name, card.responseCard)">{{
                card.name
              }}</a>
            </h2>

            <!-- Formulaire d'édition de cartes -->
            <form
              v-if="isEditable && editingCard?.name === card.name"
              @submit.prevent="PutCards"
              class="mt-5 flex flex-col gap-4"
            >
              <input
                v-model="CardName"
                type="text"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <input
                v-model="CardQuestion"
                type="text"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <input
                v-model="CardResponse"
                type="text"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <div class="flex gap-3">
              <button
                type="submit"
                class="inline-flex items-center rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white ring-1 shadow-xs ring-blue-300 ring-inset hover:bg-blue-600"
              >
                Sauvegarder
              </button>
              <!-- Bouton de suppression pour chaque cartes -->
              <buttondelete @click.prevent="DeleteCards(card.name)" />
              </div>
            </form>

            <button @click.prevent="toggleEdit(card)">
              <PencilIcon class="px-3 py-2 w-[3rem]" />
            </button>
          </div>
        </div>
      </div>
      <div v-else class="text-center text-gray-500">
        <p>Aucune cartes créée pour le moment.</p>
      </div>
    </div>
    <modalMemory
      :open="isModalOpen"
      :question="selectedQuestion"
      :nameCard="selectedNameCard"
      :responseC="selectedResponseCard"
      @close="closeModal"
    />
  </section>
</template>
