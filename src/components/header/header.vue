<template>
  <div>
    <header
      class="justify-between w-full fixed top-0 left-0 z-50 transition-all duration-300 flex items-center px-6 md:px-16 lg:px-24 bg-blue-600"
      :class="{ 'bg-blue-800 py-2 shadow-md': isScrolled, 'bg-blue-600 py-4': !isScrolled }"
    >
      <router-link to="/">
      <h1 class="text-xl md:text-3xl font-bold flex-shrink-0 !text-white">Projet Memory</h1>
      </router-link>
      <nav class="hidden md:flex flex-grow justify-center">
        <ul class=" text-center flex gap-4 text-lg">
          <li><router-link to="/categorie" class="!text-white hover:text-blue-300 transition">Catégorie</router-link></li>
        </ul>
      </nav>
      <button @click="notification" class="!text-white">
        <Cog6ToothIcon class="w-10"/>
      </button>
      <div v-if="isOpenModal">
      <ModalNotification :isOpen="isOpenModal" @close="isOpenModal = false"/>
      </div>
      <button
        @click="toggleMenu"
        class="md:hidden ml-auto focus:outline-none"
        aria-label="Ouvrir le menu"
        :aria-expanded="isMenuOpen"
      >
        <svg v-if="!isMenuOpen" class="w-8 h-8 !text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
        </svg>
      </button>
      <div
        :class="[
          'fixed top-0 right-0 w-3/4 max-w-xs h-auto max-h-[70vh] bg-blue-700 shadow-lg transform transition-transform duration-300 ease-in-out md:hidden rounded-bl-lg !text-white',
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        ]"
      >
        <div class="flex justify-between items-center px-6 py-4 border-b border-white">
          <h2 class="text-lg font-semibold !text-white">Menu</h2>
          <button @click="closeMenu" aria-label="Fermer le menu">
            <svg class="w-6 h-6 !text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <ul class="flex flex-col gap-4 px-6 py-4 text-lg">
          <li @click="closeMenu"><router-link to="/categorie" class="!text-white hover:text-blue-300 transition">Catégories</router-link></li>
        </ul>
      </div>
    </header>

    <!-- Overlay (Clique en dehors pour fermer) -->
    <div
      v-if="isMenuOpen"
      class="fixed inset-0  md:hidden"
      @click="closeMenu"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Cog6ToothIcon } from '@heroicons/vue/24/outline'
import ModalNotification from '@/components/header/modal-notification.vue'
const isScrolled = ref(false);
const isMenuOpen = ref(false); // Gère l'affichage du menu burger
const isOpenModal = ref(false);

// Vérifier si le menu doit être affiché en desktop
onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

// Gestion du scroll pour changer l'apparence du header
const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

const notification = () => {
  isOpenModal.value = !isOpenModal.value;
}

// Ouvrir / fermer le menu burger
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

// Fermer le menu burger
const closeMenu = () => {
  isMenuOpen.value = false;
};
</script>
