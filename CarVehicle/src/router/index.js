import { createRouter, createWebHistory } from 'vue-router'
import { isAdminAuthenticated } from '../services/adminAuth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: () => false,
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
    {
      path: '/su-kien',
      name: 'events',
      component: () => import('../views/EventsView.vue'),
    },
    {
      path: '/su-kien/:id',
      name: 'event-detail',
      component: () => import('../views/EventDetailView.vue'),
      props: true,
    },
    {
      path: '/san-pham/:id',
      name: 'product-detail',
      component: () => import('../views/ProductDetailView.vue'),
    },

    // Admin
    {
      path: '/quanly/login',
      name: 'admin-login',
      component: () => import('../views/admin/AdminLoginView.vue'),
    },
    {
      path: '/quanly',
      name: 'admin-dashboard',
      component: () => import('../views/admin/AdminDashboardView.vue'),
      meta: { requiresAdmin: true },
    },
  ],
})

router.beforeEach((to) => {
  if (to.meta?.requiresAdmin && !isAdminAuthenticated()) {
    return { path: '/quanly/login', query: { redirect: to.fullPath } }
  }

  if (to.path === '/quanly/login' && isAdminAuthenticated()) {
    return { path: '/quanly' }
  }

  return true
})

export default router
