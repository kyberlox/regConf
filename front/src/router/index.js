import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HomePage.vue'
import { useQuestionsStore } from '@/store/questions'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/engine',
      name: 'enginePage',
      component: () => import('../views/EnginePage.vue')
    },

  ]
})

router.beforeEach((to, from, next) => {
  useQuestionsStore().resetQuestionGroup('all');
  next()
})

export default router
