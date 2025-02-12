<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

// Props : Liste des thèmes
const props = defineProps<{
  themes: { name: string; description: string }[];
}>();

// Émission d'événements pour informer le parent
const emit = defineEmits(['edit', 'delete']);

const editTheme = (index: number) => {
  emit('edit', index);
};

const deleteTheme = (index: number) => {
  emit('delete', index);
};
</script>

<template>
  <ul>
    <li v-for="(theme, index) in props.themes" :key="index" class="p-4 bg-gray-100 rounded-md mb-2 flex justify-between">
      <div>
        <strong>{{ theme.name }}</strong>: {{ theme.description }}
      </div>
      <div>
        <button @click="editTheme(index)" class="text-blue-500 hover:text-blue-700">Modifier</button>
        <button @click="deleteTheme(index)" class="text-red-500 hover:text-red-700 ml-4">Supprimer</button>
      </div>
    </li>
  </ul>
</template>
