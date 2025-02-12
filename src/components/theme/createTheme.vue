<script setup lang="ts">
import { ref, onMounted } from 'vue';
const themes = ref<{ name: string; description: string }[]>([]);
const themeName = ref('');
const themeDescription = ref('');

const addTheme = () => {
  if (!themeName.value.trim() || !themeDescription.value.trim()) return;

  const newTheme = {
    name: themeName.value,
    description: themeDescription.value
  };

  themes.value.push(newTheme);
  localStorage.setItem('themes', JSON.stringify([...themes.value]));

  // Réinitialisation des champs après l'ajout
  themeName.value = '';
  themeDescription.value = '';
};

// Lire les thèmes enregistrés dans le localStorage au montage du composant
onMounted(() => {
  const savedThemes = JSON.parse(localStorage.getItem('themes') || '[]');
  if (Array.isArray(savedThemes)) {
    themes.value = savedThemes;
  }
});
</script>

<template>
  <section class="bg-white shadow-sm">
    <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between">
      <h1 class="text-3xl font-bold tracking-tight text-gray-900">Mes Thèmes</h1>
    </div>
    <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <form @submit.prevent="addTheme">
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
        <label for="themeDescription" class="block text-sm font-bold tracking-tight text-gray-900 mt-4">
          Description du thème :
        </label>
        <input
          id="themeDescription"
          v-model="themeDescription"
          type="text"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
        <div class="flex justify-end mt-4">
          <button
            type="submit"
            class="mt-1 block rounded-md bg-indigo-600 text-white px-4 py-2 shadow-sm hover:bg-indigo-700"
          >
            Ajouter
          </button>
        </div>
      </form>

      <!-- Affichage des thèmes enregistrés -->
      <ul class="mt-6">
        <li v-for="(theme, index) in themes" :key="index" class="p-4 bg-gray-100 rounded-md mb-2">
          <strong>{{ theme.name }}</strong>: {{ theme.description }}
        </li>
      </ul>
    </div>
  </section>
</template>
