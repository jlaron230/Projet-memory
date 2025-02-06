<template>
  <div>
    <!-- Ton header -->
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
          <li>
            <router-link to="/" class="!text-white text-lg hover:text-blue-300 transition">
              Accueil
            </router-link>
          </li>
          <li>
            <router-link to="/categorie" class="!text-white text-lg hover:text-blue-300 transition">
              Catégorie
            </router-link>
          </li>
          <li>
            <router-link to="/theme" class="!text-white text-lg hover:text-blue-300 transition">
              Mes theme
            </router-link>
          </li>
          <li>
            <router-link to="/reviser" class="!text-white text-lg hover:text-yellow-300 transition">
              Réviser
            </router-link>
          </li>
          <li>
            <router-link to="/importer" class="!text-white text-lg hover:text-blue-300 transition">
              Importer un thème
            </router-link>
          </li>
          <li>
            <router-link to="/parametres" class="!text-white text-lg hover:text-blue-300 transition">
              Paramètres
            </router-link>
          </li>
          <li>
            <router-link to="/aide" class="!text-white text-lg hover:text-blue-300 transition">
              Aide / À propos
            </router-link>
          </li>
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

  </div>
</template>

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
