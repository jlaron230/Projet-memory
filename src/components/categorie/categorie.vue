<script setup lang="ts">
import buttonCreate from '../button/button-create.vue'
import {ref, onMounted } from 'vue'
import {
  BriefcaseIcon,
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  CurrencyDollarIcon,
  LinkIcon,
  MapPinIcon,
  PencilIcon
} from '@heroicons/vue/20/solid'

const isVisible = ref(false)

const toggleVisible = () => {
  isVisible.value = !isVisible.value
}

const categoryName = ref('')
const categoryOptions = ref('')

const categories = ref<any[]>([])

const CreateCategories = () => {
  if (!categoryName.value.trim()) {
    alert('le nom de la catégorie est requis');
    return;
  }
  const categoryData = {
    name: categoryName.value,
    options: categoryOptions.value
      .split(',')
      .map((option) => option.trim())
      .filter(Boolean)
  }

  // Envoi de la catégorie au Service Worker
  if (navigator.serviceWorker && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'CREATE_CATEGORY',
      data: categoryData
    });
    console.log('Catégorie envoyée au Service Worker:', categoryData);

    // Ajout immédiat de la catégorie dans la liste
    categories.value.push(categoryData); // Ajout direct de la catégorie sans attendre le cache
  } else {
    console.error('Service Worker non disponible');
  }

  // Réinitialisation des champs du formulaire
  categoryName.value = '';
  categoryOptions.value = '';
};


const getCategoriesFromCache = async () => {
  if (navigator.serviceWorker && navigator.serviceWorker.controller) {
    const cache = await caches.open('v1');
    const cachedCategories = [];

    // Parcourir toutes les clés du cache pour récupérer les catégories
    const cacheKeys = await cache.keys();
    console.log('Clés du cache :', cacheKeys); // Log pour vérifier les clés du cache

    for (const request of cacheKeys) {
      const requestUrl = new URL(request.url); // Créer un objet URL à partir de la requête

      // Vérifier le chemin relatif de l'URL (sans le domaine)
      if (requestUrl.pathname.startsWith('/categories/')) {
        try {
          const response = await cache.match(request);

          if (response && response.ok) {
            const categoryData = await response.json();
            console.log('Catégorie récupérée depuis le cache :', categoryData); // Log pour vérifier la catégorie récupérée
            cachedCategories.push(categoryData);
          }
        } catch (error) {
          console.error('Erreur lors de la récupération de la catégorie du cache :', error);
        }
      }
    }

    // Log pour vérifier que les catégories sont bien récupérées
    console.log('Catégories mises à jour :', cachedCategories);

    // Mise à jour de la variable `categories`
    categories.value = cachedCategories;
  }
};



onMounted(() => {
  if (navigator.serviceWorker) {
    navigator.serviceWorker.ready.then((registration) => {
      console.log('Service Worker est prêt');
      // Appelle ta fonction pour récupérer les catégories à partir du cache ici
      getCategoriesFromCache();
    }).catch((error) => {
      console.error('Service Worker n\'est pas prêt :', error);
    });
  } else {
    console.error('Service Worker n\'est pas pris en charge par ce navigateur');
  }
});

</script>

<template>
  <section class="bg-white shadow-sm">
    <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex place-content-between">
      <h1 class="text-3xl font-bold tracking-tight text-gray-900">Mes catégories</h1>
    </div>

    <!-- Formulaire pour créer une catégorie -->
    <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <form @submit.prevent="CreateCategories" class="mt-5 flex flex-col gap-4">
        <div>
          <label for="categoryName" class="block text-sm font-medium text-gray-700">Nom de la catégorie</label>
          <input
            id="categoryName"
            v-model="categoryName"
            type="text"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <!-- Options supplémentaires -->
        <div>
          <label for="categoryOptions" class="block text-sm font-medium text-gray-700">Options</label>
          <input
            id="categoryOptions"
            v-model="categoryOptions"
            type="text"
            placeholder="Exemple: option 1, option 2"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div class="flex justify-end">
          <button type="submit" class="inline-flex items-center rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white ring-1 shadow-xs ring-blue-300 ring-inset hover:bg-blue-600">
            Créer la catégorie
          </button>
        </div>
      </form>
      <section class="bg-white shadow-sm">
        <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex place-content-between">
          <h1 class="text-3xl font-bold tracking-tight text-gray-900">Mes catégories</h1>
        </div>

        <!-- Liste des catégories -->
        <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div v-if="categories.length > 0" class="space-y-6">
            <div v-for="(category, index) in categories" :key="index" class="bg-gray-100 p-4 rounded-lg">
              <h2 class="text-xl font-semibold text-gray-900">{{ category.name }}</h2>
              <p class="text-sm text-gray-600">Options: {{ category.options ? category.options.join(', ') : 'Aucune option' }}</p>
            </div>
          </div>
          <div v-else class="text-center text-gray-500">
            <p>Aucune catégorie créée pour le moment.</p>
          </div>
        </div>
      </section>
    </div>
  </section>
</template>
