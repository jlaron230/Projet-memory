<script setup lang="ts" xmlns="http://www.w3.org/1999/html">
import { ref, onMounted, computed } from 'vue'
import buttondelete from '@/components/button/button-delete.vue'
import { PencilIcon } from '@heroicons/vue/20/solid'
const themes = ref<any[]>([])
const themeName = ref<string>('')
const themeDescription = ref<string>('')
const isEditable = ref(false)
const editingTheme = ref<any | null>(null)
const props = defineProps<{ themeId: string }>()

// Fonction pour activer l'édition
const toggleEdit = (theme: any) => {
  // Garde une référence à la du thème à éditer
  editingTheme.value = theme
  themeName.value = theme.name// Affiche les options sous forme de texte
  isEditable.value = true
  themeDescription.value = theme.description
}

// Filtrage des thèmes en fonction de la catégorie sélectionnée
const filteredThemes = computed(() => {
  return themes.value.filter((theme) => theme.themeId == props.themeId)
})

// Fonction pour créer un nouveau thème
const Createtheme = () => {
  if (!themeName.value.trim() && !themeDescription.value.trim()) {
    alert('Le nom du thème est requis')
    return
  }

  const themeData = {
    name: themeName.value,
    description: themeDescription.value,
    themeId: props.themeId,
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

// Fonction pour récupérer les thèmes depuis le cache
const getThemesFromCache = async () => {
  if (navigator.serviceWorker && navigator.serviceWorker.controller) {
    const cache = await caches.open('themes-v1')
    const cachedThemes = []

    const cacheKeys = await cache.keys()
    console.log('Clés du cache :', cacheKeys)

    for (const request of cacheKeys) {
      const requestUrl = new URL(request.url)

      if (requestUrl.pathname.startsWith('/themes/')) { // Vérifie bien que les thèmes sont dans le bon cache
        try {
          const response = await cache.match(request)

          if (response && response.ok) {
            const themeData = await response.json()
            console.log('Thèmes récupérée depuis le cache :', themeData)
            cachedThemes.push(themeData)
          }
        } catch (error) {
          console.error('Erreur lors de la récupération du thème du cache :', error)
        }
      }
    }
    themes.value = cachedThemes.filter(theme => theme.themeId === props.themeId)
    console.log('Thèmes après récupération du cache :', themes.value)
  }
}
// Fonction pour mettre à jour un thème
const PutTheme = () => {
  if (!themeName.value.trim() && !themeDescription.value.trim()) {
    alert('Le nom du thème est requis')
    return
  }
  // Mise à jour du thème dans le tableau local de Vue
  const themeIndex = themes.value.findIndex(c => c.name === editingTheme.value.name)
  if (themeIndex !== -1) {
    themes.value[themeIndex] = {
      themeId: props.themeId,
      name: themeName.value,
      description: themeDescription.value
    }
  }
  // Envoi de la mise à jour au Service Worker pour qu'il mette à jour le cache
  if (navigator.serviceWorker && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'UPDATE_THEME',
      data: {
        originalName: editingTheme.value.name,  // Nom original à mettre à jour
        newName: themeName.value, // Nouveau nom// Options mises à jour
        newDescription: themeDescription.value,
        originalDescription: editingTheme.value.description,
        themeId: props.themeId
      }
    })
  }
  isEditable.value = false
  editingTheme.value = null
  themeName.value = ''
  themeDescription.value = ''
}
const DeleteTheme = async (themeName: string) => {
  if (!themeName || typeof themeName !== 'string') return console.error('Nom du thème invalide')

  console.log(`Suppression de la catégorie : ${themeName}`)

  // 1. Supprimer de la liste locale
  themes.value = themes.value.filter(c => c.name !== themeName)

  // 2. Supprimer du cache et envoyer au Service Worker
  if ('caches' in window) {
    try {
      const cache = await caches.open('themes-v1')
      for (const request of await cache.keys()) {
        if (new URL(request.url).pathname === `/themes/${encodeURIComponent(themeName)}`) {
          await cache.delete(request)
          console.log(`Thème supprimée du cache`)
          break
        }
      }
      navigator.serviceWorker?.controller?.postMessage({
        type: 'DELETE_THEME',
        name: themeName,
        themeId: props.themeId
      })
    } catch (error) {
      console.error('Erreur lors de la suppression du cache', error)
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
  <section class="py-12 px-6 bg-gradient-to-br from-indigo-100 via-white to-blue-100
          border-2 border-blue-400 rounded-3xl shadow-2xl max-w-3xl mx-auto mt-16">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-12">
      <h1 class="text-3xl text-center p-5 font-bold tracking-tight text-gray-900">Thèmes de la catégorie {{ themeId }}</h1>
    </div>
    <form @submit.prevent="Createtheme" class="bg-white border border-gray-200 shadow-lg rounded-xl p-8 space-y-6">
      <h2 class="text-xl font-semibold text-gray-800">Créer un nouveau thème</h2>
      <div>
        <label for="themeName" class="block text-sm font-medium text-gray-700 mb-2">
          Nom du thème :
        </label>
        <input
          id="themeName"
          v-model="themeName"
          type="text"
          required
          class="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 p-4"
        />
      </div>
      <div>
        <label for="themeDescription" class="block text-sm font-medium text-gray-700 mb-2">
          Description du thème :
        </label>
        <textarea
          id="themeDescription"
          v-model="themeDescription"
          required
          class="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 p-4"
        ></textarea>
      </div>

      <div class="flex justify-end mt-4">
        <button
          type="submit"
          class="bg-blue-600 text-white p-5 px-6 py-3 rounded-md font-medium hover:bg-blue-700"
        >
          Ajouter
        </button>
      </div>
    </form>
    <div v-if="filteredThemes.length > 0" class="space-y-8 mt-10">
      <div v-for="(theme, index) in filteredThemes" :key="index" class="bg-white border border-gray-200 shadow-md rounded-xl p-6">
        <div class="flex justify-between items-start gap-6">
          <div class="flex-1">
            <!-- Affichage nom -->
            <h2 v-if="!isEditable || editingTheme?.name !== theme.name" class="text-xl font-semibold text-gray-900">
              <router-link
                :to="{ name: 'CardTheme', params: { themeId: theme.name }}"
                class="cursor-pointer text-xl font-semibold text-gray-900 hover:text-blue-600"
              >
                {{ theme.name }}
              </router-link>
            </h2>
            <div>
              <p v-if="!isEditable || editingTheme?.name !== theme.name">{{ theme.description }}</p>
            </div>
            <form v-if="isEditable && editingTheme?.name === theme.name" @submit.prevent="PutTheme" class="mt-6 space-y-4">
              <input
                v-model="themeName"
                type="text"
                required
                class="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 p-4"
              />
              <div class="flex gap-4">
                <button type="submit" class="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700">
                  Sauvegarder
                </button>
                <button
                  type="button"
                  @click.prevent="DeleteTheme(theme.name)"
                  class="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700"
                >
                  Supprimer
                </button>
              </div>
            </form>
          </div>
          <button @click.prevent="toggleEdit(theme)">
            <PencilIcon class="w-6 h-6 text-gray-500 hover:text-gray-800" />
          </button>
        </div>
      </div>
    </div>
    <div v-else class="text-center p-5 text-gray-500 mt-8">
      <p>Aucune thème créée pour le moment.</p>
    </div>
  </section>
</template>

