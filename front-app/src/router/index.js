import { createRouter, createWebHistory } from 'vue-router/auto'
import Home from '../pages/Home.vue'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'
import CarRegister from '../pages/CarRegister.vue'
import CarRental from '../pages/CarRental.vue'
import CarReturns from '../pages/CarReturns.vue'
import MyCars from '../pages/MyCars.vue'
import AvailableCars from '../pages/AvailableCars.vue'
import Profile from '../pages/Profile.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
})

router.addRoute({ path: '/', component: Home })
router.addRoute({ path: '/login', component: Login })
router.addRoute({ path: '/register', component: Register })
router.addRoute({ path: '/cars/available', component: AvailableCars })
router.addRoute({ path: '/cars/register', component: CarRegister })
router.addRoute({ path: '/cars/rent/:plate', component: CarRental, name: 'CarRental', props: true })
router.addRoute({ path: '/cars/returns', component: CarReturns })
router.addRoute({ path: '/cars/mycars', component: MyCars })
router.addRoute({ path: '/profile', component: Profile })

export default router
