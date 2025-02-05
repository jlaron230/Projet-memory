
import { createRouter, createWebHistory } from 'vue-router'
import Categorie from '@/views/Categorie.vue'
import Accueil from '@/views/Accueil.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'accueil',
      component: Accueil,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },

    {
      path: '/categorie',
      name: 'categorie',
      component: Categorie,
    },

  ],
})

export default router
