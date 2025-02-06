<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const isScrolled = ref(false);
const isDarkMode = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  document.documentElement.classList.toggle('dark', isDarkMode.value);
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <header
    :class="[
      'w-full fixed top-0 left-0 z-20 transition-all duration-300 flex items-center justify-between px-12',
      isScrolled ? 'bg-blue-800 py-2 shadow-md' : 'bg-blue-600 py-4',
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-blue-600 text-white'
    ]"
  >

    <h1 class="text-3xl font-bold">Projet Memory</h1>


    <nav>
      <ul class="flex gap-4">
        <li><a href="#" class="!text-white text-lg hover:text-blue-300 transition">Accueil</a></li>
        <li><a href="#" class="!text-white text-lg hover:text-blue-300 transition">Categorie</a></li>
        <li><a href="#" class="!text-white text-lg hover:text-blue-300 transition">Mes thèmes</a></li>
        <li><a href="#" class="!text-white text-lg hover:text-yellow-300 transition">Réviser</a></li>
        <li><a href="#" class="!text-white text-lg hover:text-blue-300 transition">Importer un thème</a></li>
        <li><a href="#" class="!text-white text-lg hover:text-blue-300 transition">Paramètres</a></li>
        <li><a href="#" class="!text-white text-lg hover:text-blue-300 transition">Aide / À propos</a></li>
      </ul>
    </nav>

    <!-- Bouton Mode Sombre -->
    <button
      @click="toggleDarkMode"
      class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg transition duration-300 hover:bg-gray-300 dark:hover:bg-gray-600"
    >
      {{ isDarkMode ? '☀️ Mode Clair' : '🌙 Mode Sombre' }}
    </button>
  </header>


</template>
