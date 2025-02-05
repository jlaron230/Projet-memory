import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue'; // Plugin Vue
import vueDevTools from 'vite-plugin-vue-devtools'; // Pour Vue DevTools

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools() // Ajout de vue-devtools si nécessaire pour le développement
  ],
  resolve: {
    alias: {
      '@': '/src', // Alias pour la structure de ton projet
    }
  }
});
