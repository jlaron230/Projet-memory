<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import buttondelete from '@/components/button/button-delete.vue'
import { PencilIcon } from '@heroicons/vue/20/solid'
import modalMemory from '@/components/cardTheme/modalMemory.vue'
import { nextTick } from 'vue';
const CardName = ref<string>('') // Pour la création de la carte
const CardQuestion = ref<string>('') // Pour la création de la question
const CardResponse = ref<string>('') // Pour la création de la réponse
const CardImage = ref<any[]>([])
const fileInput = ref<any>(null)
const form = ref<any>({
  media: {},
});
const selectedFiles = ref<any>([]);
const cards = ref<any[]>([]) // Liste des cartes
const isEditable = ref(false) // Si un formulaire est en mode édition
const editingCard = ref<any | null>(null) // carte en édition
const isModalOpen = ref(false)
const selectedQuestion = ref<string | null>(null)
const selectedNameCard = ref<string | null>(null)
const selectedResponseCard = ref<string | null>(null)
const selectedImage = ref<string | null>(null)
const props = defineProps<{ themeId: string }>()
const dailyNewCardLimit = ref<number>(3)
const totalReviewedToday = ref<number>(0)

// Fonction pour sauvegarder la limite personnalisée dans le cache
const saveLimitToCache = async () => {
  if ('caches' in window) {
    try {
      const cache = await caches.open('settings-v1')
      await cache.put('dailyNewCardLimit', new Response(JSON.stringify(dailyNewCardLimit.value)))
      console.log('Limite quotidienne sauvegardée :', dailyNewCardLimit.value)
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la limite quotidienne', error)
    }
  }
}

// Fonction pour récupérer la limite personnalisée depuis le cache
const loadLimitFromCache = async () => {
  if ('caches' in window) {
    try {
      const cache = await caches.open('settings-v1')
      const response = await cache.match('dailyNewCardLimit')
      if (response) {
        const limit = await response.json()
        dailyNewCardLimit.value = limit
        console.log('Limite quotidienne chargée :', limit)
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la limite quotidienne', error)
    }
  }
}

watch(dailyNewCardLimit, (newLimit) => {
  saveLimitToCache()
})

const convertBase64 = (file: File) => {
return new Promise<string>((resolve, reject) => {
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => resolve(reader.result as string)
  reader.onerror = reject
})
}

// Fonction pour suivre le nombre total de cartes révisées aujourd'hui
const updateTotalReviewedToday = () => {
  const today = new Date().toISOString().split('T')[0];
  totalReviewedToday.value = cards.value.filter(card => card.lastReviewed === today).length;
}
watch(cards, updateTotalReviewedToday, { deep: true });

// Fonction pour activer et désactiver la modal
const modalVisible = (question: string, nameCard: string, responseC: string, image: string) => {
  isModalOpen.value = true
  selectedQuestion.value = question
  selectedNameCard.value = nameCard
  selectedResponseCard.value = responseC
  selectedImage.value = image
}

// Filtrage des thèmes en fonction de la catégorie sélectionnée
const filteredThemes = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return cards.value.filter(
    (card) =>
      card.themeId == props.themeId && (!card.nextReviewDate || card.nextReviewDate <= today),
  )
})

const closeModal = () => {
  isModalOpen.value = false
  selectedQuestion.value = null
  selectedNameCard.value = null
  selectedResponseCard.value = null
  selectedImage.value = null
}

const sortedCards = computed(() => {
  return cards.value
    .filter((card) => card.themeId === props.themeId)
    .sort((a, b) => (a.lastReviewed || '').localeCompare(b.lastReviewed || ''))
    .slice(0, dailyNewCardLimit.value)
})

// Fonction pour activer l'édition
const toggleEdit = (cards: any) => {
  // Garde une référence à la carte à éditer
  editingCard.value = cards
  CardName.value = cards.name // Affiche les options sous forme de texte
  CardQuestion.value = cards.value // Affiche les options sous forme de texte
  CardResponse.value = cards.responseCard
  isEditable.value = true
  CardImage.value = cards.image
}

const handelFileUpload = async (e: any) => {
  const files = e.target.files || e.dataTransfer.files;
  if (!files.length) return;

  for (let i = 0; i < files.length; i++) {
    selectedFiles.value.push(files[i]);
    const src = await convertBase64(files[i]);
    CardImage.value.push(src);
  }
  console.log(selectedFiles.value, "seldjhfdh fikes");

  form.value.media = e.target.files[0];
  console.log(form.value.media, "file upload");

  console.log("files already uploaded", CardImage.value);
};

// Fonction pour créer une nouvelle carte
const CreateCards = async () => {
  if (!CardName.value.trim() || !CardQuestion.value.trim() || !CardResponse.value.trim()) {
    alert('Le nom de la carte et la question est requis')
    return
  }

  const today = new Date().toISOString().split('T')[0]
  const todayCards = cards.value.filter((card) => card.lastReviewed === today).length
  console.log(todayCards)
  if (todayCards >= dailyNewCardLimit.value) {
    alert(`Vous avez atteint la limite de ${dailyNewCardLimit.value} cartes par jour`)
    return
  }
  // Vérifier si les images doivent être converties en base64
  const base64Images = await Promise.all(
    CardImage.value.map(async (file) => {
      if (file instanceof File) {
        return await convertBase64(file)
      }
      return file // Si ce n'est pas un fichier, garder tel quel
    })
  )
    const cardData = {
      name: CardName.value,
      value: CardQuestion.value,
      responseCard: CardResponse.value,
      themeId: props.themeId,
      level: 1,
      lastReviewed: null,
      image: base64Images,
    }
    console.log(cardData)

    // ✅ Mettre à jour immédiatement `cards.value` pour afficher la carte
    cards.value.push(cardData)
    updateCardInCache(cardData);
    // Envoi de la carte au Service Worker
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'CREATE_CARD',
        data: cardData,
      })
      console.log('Carte envoyée au Service Worker:', cardData)
    } else {
      console.error('Service Worker non disponible')
    }

  // Réinitialisation des champs du formulaire
  CardName.value = ''
  CardQuestion.value = ''
  CardResponse.value = ''
  CardImage.value = []
  if(fileInput.value) {
    fileInput.value.value = ''
  }
  fileInput.value = null
}

const validateCard = async (card: any) => {
  const today = new Date().toISOString().split('T')[0]

  // Ne pas valider plusieurs fois par jour
  if (card.lastReviewed === today) {
    alert("Vous avez déjà révisé cette carte aujourd'hui.")
    return
  }

  // Délais de révision basés sur le niveau
  const intervals = [1, 2, 5, 10, 30] // jours d'attente pour chaque niveau
  card.level = Math.min(card.level + 1, intervals.length - 1)

  // Calculer la prochaine date de révision
  const nextReview = new Date()

  if (isNaN(nextReview.getTime())){
    console.log(`erreur : next review est une date invalide : ${nextReview}`)
    return
  }
  nextReview.setDate(nextReview.getDate() + intervals[card.level - 1])
  card.nextReviewDate = nextReview.toISOString().split('T')[0]

  card.lastReviewed = today // Mettre à jour la date de révision
  await updateCardInCache(card)

  // Mettre à jour la liste des cartes
  const index = cards.value.findIndex((c) => c.name === card.name && c.themeId === card.themeId)
  if (index !== -1) {
    cards.value[index] = { ...card }
    cards.value = [...cards.value]
  }
  await getCardsFromCache();
}

const updateCardInCache = async (updatedCard: any) => {
  if ('caches' in window) {
    try {
      const cache = await caches.open('cards-v1')
      const requestUrl = `/cards/${encodeURIComponent(updatedCard.themeId)}/${encodeURIComponent(updatedCard.name)}`

      // Supprimer l'ancienne version de la carte
      const existing = await cache.match(requestUrl)
      if (existing) {
        await cache.delete(requestUrl);
      }
      await cache.put(new Request(requestUrl), new Response(JSON.stringify(updatedCard)))

      console.log('Carte mise à jour dans le cache :', updatedCard)
    } catch (error) {
      console.error('Erreur lors de la mise à jour du cache', error)
    }
  }
}

// Fonction pour récupérer les cartes depuis le cache
const getCardsFromCache = async () => {
  if (!('caches' in window)) return;

  try {
    const cache = await caches.open('cards-v1');
    const keys = await cache.keys();
    console.log('🗂️ Clés trouvées dans le cache:', keys.map(k => k.url));

    const themeCards = keys
      .filter((request) => new URL(request.url).pathname.includes(`/cards/${props.themeId}/`))
      .map(async (request) => {
        const response = await cache.match(request);
        return response ? await response.json() : null;
      });

    const resolvedCards = await Promise.all(themeCards);

    // Mise à jour des cartes avec nextTick pour forcer Vue à voir le changement
    cards.value = resolvedCards.filter(card => card !== null);
    await nextTick();
    console.log('✅ Cartes finales après nextTick:', cards.value);
  } catch (error) {
    console.error('❌ Erreur récupération cache:', error);
  }
};

// Fonction pour mettre à jour une carte
const PutCards = () => {
  if (!CardName.value.trim() || !CardQuestion.value.trim() || !CardResponse.value.trim()) {
    alert('Le nom de la carte et la question est requis')
    return
  }

  // Mise à jour de la carte dans le tableau local de Vue
  const cardIndex = cards.value.findIndex((c) => c.name === editingCard.value.name)
  if (cardIndex !== -1) {
    const updatedCard = {
      ...cards.value[cardIndex], // Garde les anciennes valeurs
      name: CardName.value,
      value: CardQuestion.value,
      responseCard: CardResponse.value,
    }
    cards.value[cardIndex] = updatedCard
    updateCardInCache(updatedCard) // Met à jour dans le cache
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
        level: editingCard.value.level,
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
      navigator.serviceWorker?.controller?.postMessage({
        type: 'DELETE_CARD',
        cardName: cardName,
        themeId: props.themeId,
      })
    } catch (error) {
      console.error('Erreur lors de la suppression du cache', error)
    }
  }
}

onMounted(() => {
  if (navigator.serviceWorker) {
    navigator.serviceWorker.ready
      .then(() => {
        console.log('Service Worker est prêt')
        // Appelle la fonction pour récupérer les cartes à partir du cache ici
        getCardsFromCache()
        loadLimitFromCache() // Charger la limite personnalisée
        updateTotalReviewedToday()
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
  <section class="py-10 px-6 bg-gradient-to-br from-blue-500 via-indigo-100 to-purple-100 border-2 border-blue-500 rounded-3xl shadow-xl max-w-3xl mx-auto">
  <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <!-- Titre principal -->
      <div class="mb-10 flex justify-between items-center">
        <h1 class="text-4xl align-center font-bold text-gray-900">Mes cartes</h1>
      </div>

      <!-- Choix de la limite quotidienne -->
      <div class="mb-6">
        <label for="limit" class="block text-sm font-medium text-gray-700 mb-1">
          Nombre de nouvelles cartes par jour
        </label>
        <input
          id="limit"
          v-model.number="dailyNewCardLimit"
          type="number"
          min="1"
          class="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-200"
        />
      </div>

      <!-- Formulaire de création -->
      <form @submit.prevent="CreateCards" class="space-y-5 bg-white shadow-md rounded-xl p-6 border border-gray-00">
        <h2 class="text-xl font-semibold text-gray-800 mb-2">Créer une nouvelle carte</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="cardName" class="block text-sm font-medium text-gray-700 mb-1">Nom de la carte</label>
            <input
              id="cardName"
              v-model="CardName"
              type="text"
              required
              class="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-300"
            />
          </div>

          <div>
            <label for="cardQuestion" class="block text-sm font-medium text-gray-700 mb-1">Question</label>
            <input
              id="cardQuestion"
              v-model="CardQuestion"
              type="text"
              required
              class="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-300"
            />
          </div>

          <div class="md:col-span-2">
            <label for="cardResponse" class="block text-sm font-medium text-gray-700 mb-1">Réponse</label>
            <input
              id="cardResponse"
              v-model="CardResponse"
              type="text"
              required
              class="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-300"
            />
          </div>

          <div class="md:col-span-2">
            <label for="cardImage" class="block text-sm font-medium text-gray-700 mb-1">Image (optionnel)</label>
            <input
              id="cardImage"
              type="file"
              accept="image/*"
              ref="fileInput"
              @change="(event) => handelFileUpload(event)"
              class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        </div>

        <div class="flex justify-end">
          <button
            type="submit"
            class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-medium"
          >
            ➕ Créer la carte
          </button>
        </div>
      </form>

      <!-- Liste des cartes -->
      <div v-if="filteredThemes.length > 0" class="mt-10 space-y-6">
        <div
          v-for="(card, index) in filteredThemes"
          :key="index"
          class="bg-white border border-gray-200 shadow-sm rounded-xl p-6 transition hover:shadow-md"
        >
          <div class="flex justify-between items-start gap-4">
            <div class="flex-1">
              <!-- Affichage normal -->
              <h2
                v-if="editingCard?.name !== card.name"
                @click.prevent="modalVisible(card.value, card.name, card.responseCard, card.image)"
                class="text-lg font-semibold text-gray-800 hover:text-blue-600 cursor-pointer"
              >
                {{ card.name }}
              </h2>

              <!-- Formulaire édition -->
              <form
                v-if="isEditable && editingCard?.name === card.name"
                @submit.prevent="PutCards"
                class="mt-4 space-y-2"
              >
                <input
                  v-model="CardName"
                  type="text"
                  placeholder="Nom"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-300"
                />
                <input
                  v-model="CardQuestion"
                  type="text"
                  placeholder="Question"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-300"
                />
                <input
                  v-model="CardResponse"
                  type="text"
                  placeholder="Réponse"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-300"
                />
                <div class="flex gap-2 mt-2">
                  <button
                    type="submit"
                    class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Sauvegarder
                  </button>
                  <buttondelete @click.prevent="DeleteCards(card.name)" />
                </div>
              </form>
            </div>

            <div class="flex items-center gap-3">
              <button @click.prevent="toggleEdit(card)">
                <PencilIcon class="w-6 h-6 text-gray-500 hover:text-gray-800" />
              </button>
              <span
                class="text-sm font-semibold"
                :class="{
                  'text-green-600': card.level === 1,
                  'text-blue-600': card.level === 2,
                  'text-red-600': card.level >= 3
                }"
              >
                Niveau {{ card.level }}
              </span>
              <button
                @click="validateCard(card)"
                class="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 text-sm"
              >
                Valider
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Aucune carte -->
      <div v-else class="text-center text-gray-500 mt-10">
        <p class="text-lg">Aucune carte disponible pour ce thème.</p>
      </div>
    </div>

    <!-- Modal d'aperçu -->
    <modalMemory
      :open="isModalOpen"
      :question="selectedQuestion"
      :nameCard="selectedNameCard"
      :responseC="selectedResponseCard"
      :image="selectedImage"
      @close="closeModal"
    />
  </section>
</template>
