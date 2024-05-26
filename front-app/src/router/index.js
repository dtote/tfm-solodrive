import { createRouter, createWebHistory } from 'vue-router/auto'
import Register from '../pages/Register.vue'
import Login from '../pages/Login.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
})

router.addRoute({ path: '/register', component: Register })
router.addRoute({ path: '/login', component: Login })

export default router
