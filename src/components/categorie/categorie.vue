<script setup lang="ts">
import { ref, onMounted } from 'vue'
import buttondelete from '@/components/button/button-delete.vue'
import { PencilIcon } from '@heroicons/vue/20/solid'

const categoryName = ref<string>('')  // Pour la création de la catégorie
const categories = ref<any[]>([]) // Liste des catégories
const isEditable = ref(false)  // Si un formulaire est en mode édition
const editingCategory = ref<any | null>(null)  // Catégorie en édition

// Fonction pour activer l'édition
const toggleEdit = (category: any) => {
  // Garde une référence à la catégorie à éditer
  editingCategory.value = category
  categoryName.value = category.name// Affiche les options sous forme de texte
  isEditable.value = true
}

// Fonction pour créer une nouvelle catégorie
const CreateCategories = () => {
  if (!categoryName.value.trim()) {
    alert('Le nom de la catégorie est requis')
    return
  }

  const categoryData = {
    name: categoryName.value,
  }

  // Envoi de la catégorie au Service Worker
  if (navigator.serviceWorker && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'CREATE_CATEGORY',
      data: categoryData
    })
    console.log('Catégorie envoyée au Service Worker:', categoryData)

    // Ajout immédiat de la catégorie dans la liste
    categories.value.push(categoryData)
  } else {
    console.error('Service Worker non disponible')
  }

  // Réinitialisation des champs du formulaire
  categoryName.value = ''
}

// Fonction pour récupérer les catégories depuis le cache
const getCategoriesFromCache = async () => {
  if (navigator.serviceWorker && navigator.serviceWorker.controller) {
    const cache = await caches.open('v1')
    const cachedCategories = []

    // Parcourir toutes les clés du cache pour récupérer les catégories
    const cacheKeys = await cache.keys()
    console.log('Clés du cache :', cacheKeys)

    for (const request of cacheKeys) {
      const requestUrl = new URL(request.url)

      if (requestUrl.pathname.startsWith('/categories/')) {
        try {
          const response = await cache.match(request)

          if (response && response.ok) {
            const categoryData = await response.json()
            console.log('Catégorie récupérée depuis le cache :', categoryData)
            cachedCategories.push(categoryData)
          }
        } catch (error) {
          console.error('Erreur lors de la récupération de la catégorie du cache :', error)
        }
      }
    }

    // Mise à jour de la variable `categories`
    categories.value = cachedCategories
  }
}

// Fonction pour mettre à jour une catégorie
const PutCategories = () => {
  if (!categoryName.value.trim()) {
    alert('Le nom de la catégorie est requis')
    return
  }

  // Mise à jour de la catégorie dans le tableau local de Vue
  const categoryIndex = categories.value.findIndex(c => c.name === editingCategory.value.name)
  if (categoryIndex !== -1) {
    categories.value[categoryIndex] = {
      name: categoryName.value,
    }
  }

  // Envoi de la mise à jour au Service Worker pour qu'il mette à jour le cache
  if (navigator.serviceWorker && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'UPDATE_CATEGORY',
      data: {
        originalName: editingCategory.value.name,  // Nom original à mettre à jour
        newName: categoryName.value  // Nouveau nom// Options mises à jour
      }
    })
  }

  // Désactiver l'édition après avoir sauvegardé
  isEditable.value = false
  editingCategory.value = null
  categoryName.value = ''
}

// Fonction pour annuler l'édition
const cancelEdit = () => {
  isEditable.value = false
  editingCategory.value = null
  categoryName.value = ''
}

// Fonction pour supprimer une catégorie
const DeleteCategories = async (categoryName: string) => {
  categories.value = categories.value.filter(c => c.name !== categoryName)

  console.log(`Suppression de la catégorie : ${categoryName}`)

  // Envoyer un message au Service Worker pour supprimer la catégorie
  if (navigator.serviceWorker && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'DELETE_CATEGORY',
      category: categoryName
    })
  }
}

onMounted(() => {
  if (navigator.serviceWorker) {
    navigator.serviceWorker.ready.then((registration) => {
      console.log('Service Worker est prêt')
      // Appelle la fonction pour récupérer les catégories à partir du cache ici
      getCategoriesFromCache()

    }).catch((error) => {
      console.error('Service Worker n\'est pas prêt :', error)
    })
  } else {
    console.error('Service Worker n\'est pas pris en charge par ce navigateur')
  }
})
</script>

<template>
  <section class=" min-h-screen py-16 flex items-center justify-center px-6">
    <div class="max-w-3xl w-full bg-white rounded-xl shadow-xl p-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-6 text-center flex items-center justify-center gap-2">
        <span class="text-indigo-600">📁</span> Mes Catégories
      </h1>

      <form @submit.prevent="CreateCategories" class="mb-6 flex flex-col gap-4 bg-blue p-6 rounded-lg shadow">
        <label for="categoryName" class="text-gray-700 font-medium text-lg">Nom de la catégorie</label>
        <input
          id="categoryName"
          v-model="categoryName"
          type="text"
          required
          class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          placeholder="Ex : Travail, Sport, Apprentissage..."
        />
        <button
          type="submit"
          class="bg-indigo-600 text-white py-3 px-5 rounded-md font-semibold text-lg hover:bg-indigo-700 transition shadow-md flex items-center justify-center gap-2"
        >
          ➕ Ajouter une catégorie
        </button>
      </form>
      <div v-if="categories.length > 0" class="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="(category, index) in categories" :key="index" class="relative bg-white p-5 rounded-lg shadow-md flex flex-col gap-3 transition hover:shadow-lg border-l-4 border-indigo-500 hover:border-indigo-600 transform hover:scale-105">
          <h2 class="text-lg font-semibold text-gray-900 flex justify-between items-center">
            <router-link
              :to="{ name: 'Theme', params: { categoryId: category.name } }"
              class="hover:text-indigo-600 transition"
            >
              {{ category.name }}
            </router-link>
            <button @click.prevent="toggleEdit(category)" class="text-gray-500 hover:text-indigo-600 transition">
              ✏️
            </button>
          </h2>

          <form v-if="isEditable && editingCategory?.name === category.name" @submit.prevent="PutCategories" class="flex flex-col gap-3">
            <input
              v-model="categoryName"
              type="text"
              required
              class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
            <div class="flex justify-end gap-2">
              <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-600 transition">✅ Sauvegarder</button>
              <buttondelete @click.prevent="DeleteCategories(category.name)" class="bg-red-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-600 transition">🗑️</buttondelete>
            </div>
          </form>
        </div>
      </div>

      <div v-else class="text-center text-gray-600 mt-6">
        <p class="text-lg font-medium">🚀 Aucune catégorie pour le moment. Ajoutez-en une pour commencer !</p>
      </div>
    </div>
  </section>
</template>

