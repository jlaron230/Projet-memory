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

// Filtrage des thèmes en fonction du thème sélectionnée
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

  // Désactiver l'édition après avoir sauvegardé
  isEditable.value = false
  editingTheme.value = null
  themeName.value = ''
  themeDescription.value = ''
}

// Fonction pour supprimer un thème
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

//Montage et rendu des éléments d'affichage
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
      <h1 class="text-3xl font-bold tracking-tight text-gray-900">Thèmes de la catégorie {{ themeId
        }}</h1>
    </div>
    <!--Formulaire de création de thème-->
    <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <form @submit.prevent="Createtheme">
        <label for="themeName" class="block text-sm font-bold tracking-tight text-gray-900">
          Nom du thème :
        </label>
        <input
          id="themeName"
          v-model="themeName"
          type="text"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
        <label for="themeDescription"
               class="block text-sm font-bold tracking-tight text-gray-900 mt-4">
          Description du thème :
        </label>
        <textarea
          id="themeDescription"
          v-model="themeDescription"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        ></textarea>
        <div class="flex justify-end mt-4">
          <button
            type="submit"
            class="mt-1 block rounded-md bg-indigo-600 text-white px-4 py-2 shadow-sm hover:bg-indigo-700"
          >
            Ajouter
          </button>
        </div>
      </form>

      <!-- Liste des thèmes -->
      <div v-if="filteredThemes.length > 0" class="space-y-6">
        <div v-for="(theme, index) in filteredThemes" :key="index"
             class="bg-gray-100 p-4 rounded-lg flex gap-4">
          <div class="flex items-center gap-4">
            <!-- Afficher le nom du thème si on n'est pas en mode édition -->
            <h2 v-if="!isEditable || editingTheme?.name !== theme.name"
                class="text-xl font-semibold text-gray-900">
              <router-link
                :to="{ name: 'CardTheme', params: { themeId: theme.name }}"
                class="cursor-pointer text-xl font-semibold text-gray-900 hover:text-blue-600">
                {{ theme.name }}
              </router-link>
            </h2>
            <div>
              <p v-if="!isEditable || editingTheme?.name !== theme.name">{{ theme.description }}</p>
            </div>

            <!-- Formulaire d'édition de thème -->
            <form v-if="isEditable && editingTheme?.name === theme.name" @submit.prevent="PutTheme"
                  class="mt-5 flex flex-col gap-4">
              <input
                v-model="themeName"
                type="text"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <div class="flex gap-4">
                <button type="submit"
                        class="inline-flex items-center rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white ring-1 shadow-xs ring-blue-300 ring-inset hover:bg-blue-600">
                  Sauvegarder
                </button>
                <!-- Bouton de suppression pour chaque thème -->
                <buttondelete @click.prevent="DeleteTheme(theme.name)" />
              </div>
            </form>

            <button @click.prevent="toggleEdit(theme)">
              <PencilIcon class="px-3 py-2 w-[3rem]" />
            </button>
          </div>
        </div>
      </div>
      <div v-else class="text-center text-gray-500">
        <p>Aucune catégorie créée pour le moment.</p>
      </div>
    </div>
  </section>
</template>’
