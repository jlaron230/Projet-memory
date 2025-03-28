<script setup lang="ts">
import { ref, onMounted } from 'vue'
import buttondelete from '@/components/button/button-delete.vue'
import { PencilIcon } from '@heroicons/vue/20/solid'
import CardTheme from '@/views/CardTheme.vue'
import Theme from '@/views/Theme.vue'

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
    const cache = await caches.open('categories-v1');
    const cachedCategories = [];

    const cacheKeys = await cache.keys();
    console.log('Clés du cache :', cacheKeys);

    for (const request of cacheKeys) {
      const requestUrl = new URL(request.url);

      if (requestUrl.pathname.startsWith('/categories/')) { // Vérifie bien que les catégories sont dans le bon cache
        try {
          const response = await cache.match(request);

          if (response && response.ok) {
            const categoryData = await response.json();
            console.log('Catégorie récupérée depuis le cache :', categoryData);
            cachedCategories.push(categoryData);
          }
        } catch (error) {
          console.error('Erreur lors de la récupération de la catégorie du cache :', error);
        }
      }
    }

    categories.value = cachedCategories;
    console.log('Catégories après récupération du cache :', categories.value);
  }
};

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

// Fonction pour supprimer une catégorie
const DeleteCategories = async (categoryName: string) => {
  if (!categoryName || typeof categoryName !== 'string') return console.error('Nom de catégorie invalide');

  console.log(`Suppression de la catégorie : ${categoryName}`);

  // 1. Supprimer de la liste locale
  categories.value = categories.value.filter(c => c.name !== categoryName);

  // 2. Supprimer du cache et envoyer au Service Worker
  if ('caches' in window) {
    try {
      const cache = await caches.open('categories-v1');
      for (const request of await cache.keys()) {
        if (new URL(request.url).pathname === `/categories/${encodeURIComponent(categoryName)}`) {
          await cache.delete(request);
          console.log(`Catégorie supprimée du cache`);
          break;
        }
      }
      navigator.serviceWorker?.controller?.postMessage({ type: 'DELETE_CATEGORY', category: categoryName });
    } catch (error) {
      console.error('Erreur lors de la suppression du cache', error);
    }
  }
};

//Montage et rendu des éléments d'affichage
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
  <section
    class="py-12 px-6 bg-gradient-to-br from-indigo-100 via-white to-blue-100
           border-2 border-blue-400 rounded-3xl shadow-xl max-w-3xl mx-auto mt-16"
  >
    <div class="mx-auto max-w-4xl px-6 py-6 sm:px-8 lg:px-10">
      <div class="mb-8">
        <h1 class="text-3xl text-center p-5 font-bold tracking-tight text-gray-900"> Mes catégories</h1>
      </div>
      <form
        @submit.prevent="CreateCategories"
        class="bg-white border border-gray-200 shadow-md rounded-xl p-8 space-y-6"
      >
        <h2 class="text-xl text-center p-5 font-semibold text-gray-800">Créer une nouvelle catégorie</h2>
        <div>
          <label for="categoryName" class="block text-sm font-medium text-gray-700 mb-2">
            Nom de la catégorie
          </label>
          <input
            id="categoryName"
            v-model="categoryName"
            type="text"
            required
            class="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 p-4"
          />
        </div>
        <div class="flex p-3 justify-end">
          <button
            type="submit"
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium"
          >
             Créer la catégorie
          </button>
        </div>
      </form>

      <!-- Liste des catégories -->
      <div v-if="categories.length > 0" class="space-y-6">
        <div v-for="(category, index) in categories" :key="index" class="bg-gray-100 p-4 rounded-lg flex gap-4">
          <div class="flex items-center gap-4">
            <!-- Afficher le nom de la catégorie si on n'est pas en mode édition -->
            <div>
            <h2 v-if="!isEditable || editingCategory?.name !== category.name" class="text-xl font-semibold text-gray-900">
              <router-link
              :to="{ name: 'Theme', params: { categoryId: category.name }}"
              class="cursor-pointer text-xl font-semibold text-gray-900 hover:text-blue-600">
              {{ category.name }}
              </router-link>
            </h2>
            </div>
            <!-- Formulaire d'édition de catégorie -->
            <form v-if="isEditable && editingCategory?.name === category.name" @submit.prevent="PutCategories" class="mt-5 flex flex-col gap-4">
              <input
                v-model="categoryName"
                type="text"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <div class="flex gap-4">
              <button type="submit" class="inline-flex items-center rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white ring-1 shadow-xs ring-blue-300 ring-inset hover:bg-blue-600">
                Sauvegarder
              </button>
              <!-- Bouton de suppression pour chaque catégorie -->
              <buttondelete @click.prevent="DeleteCategories(category.name)" />
              </div>
            </form>

            <button @click.prevent="toggleEdit(category)">
              <PencilIcon class="w-6 h-6 text-gray-500 hover:text-gray-800" />
            </button>
          </div>
        </div>
      </div>
       <div v-else class="text-center p-3 0text-gray-500 mt-8">
        <p>Aucune catégorie créée pour le moment.</p>
      </div>
    </div>
  </section>
</template>






