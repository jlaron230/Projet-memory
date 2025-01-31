<script setup lang="ts">
import { ref } from 'vue';  // Importation de `ref` pour la réactivité

// Déclaration d'une variable réactive
const message = ref('Bienvenue sur la page d\'accueil');
</script>

<template>
  <div>
    <!-- Affichage du message -->
    <h1>{{ message }}</h1>
    <p>Voici le contenu de la page d'accueil sans image.</p>
  </div>
</template>

<style scoped>
h1 {
  color: #42b983;
}

p {
  font-size: 18px;
}
</style>
