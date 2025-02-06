<script setup lang="ts">
import { ref, onMounted } from 'vue'
import buttondelete from '@/components/button/button-delete.vue'

// Liste des thèmes
const themeName = ref<string>('')
const themeDescription = ref('')
const themes = ref<any[]>([])

// Prop pour modifier un thème existant
const props = defineProps({
  themeToEdit: {
    type: Object,
    default: null
  }
})

const CreateThemes = () => {
  if (!themeName.value.trim() || !themeDescription.value.trim()) {
    alert('Le nom et la description du thème sont requis')
    return
  }

  const themeData = {
    name: themeName.value,
    description: themeDescription.value
  }

  // Envoi du thème au Service Worker
  if (navigator.serviceWorker && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'CREATE_THEME',
      data: themeData
    })
    console.log('Thème envoyé au Service Worker:', themeData)

    // Ajout immédiat du thème dans la liste
    themes.value.push(themeData)
  } else {
    console.error('Service Worker non disponible')
  }

  // Réinitialisation des champs du formulaire
  themeName.value = ''
  themeDescription.value = ''
}

const getThemesFromCache = async () => {
  if (navigator.serviceWorker && navigator.serviceWorker.controller) {
    const cache = await caches.open('v1')
    const cachedThemes = []


    const cacheKeys = await cache.keys()
    console.log('Clés du cache :', cacheKeys)

    for (const request of cacheKeys) {
      const requestUrl = new URL(request.url)

      if (requestUrl.pathname.startsWith('/themes/')) {
        try {
          const response = await cache.match(request)

          if (response && response.ok) {
            const themeData = await response.json()
            console.log('Thème récupéré depuis le cache :', themeData)
            cachedThemes.push(themeData)
          }
        } catch (error) {
          console.error('Erreur lors de la récupération du thème du cache :', error)
        }
      }
    }

    // Log pour vérifier que les thèmes sont bien récupérés
    console.log('Thèmes mis à jour :', cachedThemes)

    // Mise à jour de la variable `themes`
    themes.value = cachedThemes
  }
}

const DeleteThemes = async (themeName: string) => {
  if (!themeName || typeof themeName !== 'string') {
    console.error(' Aucun nom de thème spécifié ou mauvais type.', themeName)
    return
  }

  console.log(` Suppression du thème : ${themeName}`)

  if ('caches' in window) {
    try {
      const cache = await caches.open('v1')
      const cacheKeys = await cache.keys()

      for (const request of cacheKeys) {
        const requestUrl = new URL(request.url)

        // On vérifie si le cache contient le thème que l'on veut supprimer
        if (requestUrl.pathname === `/themes/${encodeURIComponent(themeName)}`) {
          await cache.delete(request)
          console.log(` Thème supprimé du cache : ${requestUrl.pathname}`)
          break
        }
      }

      // Envoyer un message au Service Worker pour supprimer le thème
      if (navigator.serviceWorker && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'DELETE_THEME',
          theme: themeName
        })
      }

      const index = themes.value.findIndex(theme => theme.name === themeName)
      if (index !== -1) {
        themes.value.splice(index, 1) // Supprime seulement la première occurrence trouvée
      }

    } catch (error) {
      console.error(' Erreur lors de la suppression du cache :', error)
    }
  }
}

onMounted(() => {
  if (navigator.serviceWorker) {
    navigator.serviceWorker.ready.then((registration) => {
      console.log('Service Worker est prêt')
      // Appelle la fonction pour récupérer les thèmes à partir du cache ici
      getThemesFromCache()

    }).catch((error) => {
      console.error('Service Worker n\'est pas prêt :', error)
    })
  } else {
    console.error('Service Worker n\'est pas pris en charge par ce navigateur')
  }
})

</script>

<template>
  <section class="bg-white shadow-sm">
    <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex place-content-between">
      <h1 class="text-3xl font-bold tracking-tight text-gray-900">Mes Thèmes</h1>
    </div>
    <!-- Formulaire pour créer un thème -->
    <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <form @submit.prevent="CreateThemes" class="mt-5 flex flex-col gap-4">
        <div>
          <label for="themeName" class="block text-sm font-medium text-gray-700">Nom du thème</label>
          <input
            id="themeName"
            v-model="themeName"
            type="text"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <!-- Description du thème -->
        <div>
          <label for="themeDescription" class="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="themeDescription"
            v-model="themeDescription"
            type="text"
            placeholder="Description du thème"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          ></textarea>
        </div>

        <div class="flex justify-end">
          <button type="submit" class="inline-flex items-center rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white ring-1 shadow-xs ring-blue-300 ring-inset hover:bg-blue-600">
            Créer le thème
          </button>
        </div>
      </form>

      <!-- Liste des thèmes -->
      <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div v-if="themes.length > 0" class="space-y-6">
          <div v-for="(theme, index) in themes" :key="index" class="bg-gray-100 p-4 rounded-lg">
            <h2 class="text-xl font-semibold text-gray-900">{{ theme.name }}</h2>
            <p class="text-sm text-gray-600">{{ theme.description }}</p>

            <!-- Bouton de suppression pour chaque thème -->
            <buttondelete @click.prevent="DeleteThemes(theme.name)" />
          </div>
        </div>
        <div v-else class="text-center text-gray-500">
          <p>Aucun thème créé pour le moment.</p>
        </div>
      </div>
    </div>
  </section>
</template>
