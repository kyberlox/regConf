import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HomePage.vue'
import { useQuestionsStore } from '@/store/questions'
import { useUserStore } from '@/store/user'
import { routeHandle } from './routeHandle'
import { usePageStore } from '@/store/page'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/:token(.*)',
      name: 'homeWithToken',
      component: Home,
    },
    {
      path: '/engine',
      name: 'enginePage',
      component: () => import('../views/EnginePage.vue')
    },
    {
      path: '/history',
      name: 'history',
      component: () => import('../views/HistoryPage.vue')
    },

  ]
})

routeHandle(router, useUserStore, useQuestionsStore, usePageStore);

export default router
