import { createRouter, createWebHistory } from 'vue-router'
import Accueil from '@/views/Accueil.vue'
import Categorie from '@/views/Categorie.vue'
import CardTheme from '@/views/CardTheme.vue'
import Theme from '@/views/Theme.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'accueil',
      component: Accueil,
    },
    {
      path: '/categorie',
      name: 'categorie',
      component: Categorie,
    },
    {
      path: '/theme/:themeId',
      name: 'CardTheme',
      component: CardTheme,
      props: true,
    },
    {
      path: '/categorie/:categoryId',
      name: 'Theme',
      component: Theme,
      props: true,
    },

  ],
})

export default router
