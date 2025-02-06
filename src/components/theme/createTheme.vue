<script setup lang="ts">
import { ref } from 'vue';

const themeName = ref('');
const themeDescription = ref('');

const createTheme = () => {
  if (!themeName.value.trim()) {
    alert('Le nom du thème est requis');
    return;
  }
  if (!themeDescription.value.trim()) {
    alert('La description est requise');
    return;
  }

  const newTheme = {
    name: themeName.value,
    description: themeDescription.value,
  };

  console.log('Thème créé :', newTheme);

  themeName.value = '';
  themeDescription.value = '';
};
</script>

<template>
  <form @submit.prevent="createTheme" class="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-xl border border-gray-300">
    <h2 class="text-3xl font-semibold text-center text-gray-800 mb-6">Créer un Nouveau Thème</h2>

    <div class="space-y-6">
      <div class="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-200">
        <label for="themeName" class="block text-sm font-medium text-gray-700">Nom du Thème</label>
        <input
          id="themeName"
          v-model="themeName"
          type="text"
          required
          class=" text-black mt-2 block w-full rounded-md border border-gray-300 p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div class="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-200">
        <label for="themeDescription" class="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="themeDescription"
          v-model="themeDescription"
          required
          type="text"
          rows="5"
          class="text-black mt-2 block w-full rounded-md border border-gray-300 p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        ></textarea>
      </div>
    </div>

    <div class="mt-8 flex justify-end">
      <button
        type="submit"
        class="px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        Créer le Thème
      </button>
    </div>
  </form>
</template>
