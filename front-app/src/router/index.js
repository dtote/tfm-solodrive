import { createRouter, createWebHistory } from 'vue-router/auto'
import Home from '../pages/Home.vue'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'
import AvailableCars from '../pages/AvailableCars.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
})

router.addRoute({ path: '/', component: Home })
router.addRoute({ path: '/login', component: Login })
router.addRoute({ path: '/register', component: Register })
router.addRoute({ path: '/available-cars', component: AvailableCars })

export default router
