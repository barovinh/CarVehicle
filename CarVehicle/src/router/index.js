import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/ds-san-pham',
      name: 'product-list',
      component: () => import('../views/ProductListView.vue'),
    },
    {
      path: '/gioi-thieu',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/lien-he',
      name: 'contact',
      component: () => import('../views/ContactView.vue'),
    },
  ],
})

export default router
