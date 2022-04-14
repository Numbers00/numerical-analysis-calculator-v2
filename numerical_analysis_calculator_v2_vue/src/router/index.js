import { createRouter, createWebHistory } from 'vue-router'
import NonlinearEquationsView from '../views/NonlinearEquationsView.vue'

const routes = [
  {
    path: '/',
    name: 'nonlinear_equations',
    component: NonlinearEquationsView,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
