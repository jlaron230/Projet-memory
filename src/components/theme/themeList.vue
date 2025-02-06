<script setup lang="ts">


import { ref, onMounted } from 'vue';

// Liste des thèmes
const themes = ref<{ name: string; description: string }[]>([]);

// Ajouter un thème à la liste
const addTheme = (newTheme: { name: string; description: string }) => {
  themes.value.push(newTheme);
  localStorage.setItem('themes', JSON.stringify(themes.value));  // Sauvegarder dans localStorage
};

// Modifier un thème
const editTheme = (index: number) => {
  const themeToEdit = themes.value[index];
  console.log('Modification du thème', themeToEdit);

};

// Supprimer un thème
const deleteTheme = (index: number) => {
  themes.value.splice(index, 1);
  localStorage.setItem('themes', JSON.stringify(themes.value)); // Mettre à jour le localStorage après suppression
};

// Charger les thèmes au démarrage
onMounted(() => {
  const savedThemes = JSON.parse(localStorage.getItem('themes') || '[]');
  themes.value = savedThemes;
});
</script>

<template>
  <div class="max-w-4xl mx-auto p-6">
    <!-- Affichage des thèmes créés sous forme de cartes -->
    <div v-if="themes.length === 0" class="text-center">
      <p>Aucun thème créé encore. Créez un thème pour commencer.</p>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="(theme, index) in themes"
        :key="index"
        class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300"
      >
        <h3 class="text-xl font-semibold">{{ theme.name }}</h3>
        <p class="text-gray-500">{{ theme.description }}</p>
        <div class="mt-4 flex justify-between">
          <button @click="editTheme(index)" class="text-blue-500 hover:text-blue-700">Modifier</button>
          <button @click="deleteTheme(index)" class="text-red-500 hover:text-red-700">Supprimer</button>
        </div>
      </div>
    </div>
  </div>
</template>
