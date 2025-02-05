
<!-- src/components/Accueil.vue -->

<script setup lang="ts">
import { ref } from 'vue';

const count = ref<number>(0); // Variable réactive de type nombre

function increment(): void {
  count.value++; // Incrémentation de la valeur
}

onMounted(() => {
  console.log(`The initial count is ${count.value}.`);
});
</script>

<template>
  <button @click="increment">Count is: {{ count }}</button>
</template>

<style scoped>
/* Styles ici si nécessaire */
</style>
