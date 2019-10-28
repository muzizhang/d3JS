import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/About')
  },
  {
    path: '/operation',
    name: 'operation',
    component: () => import('../views/Operation')
  },
  {
    path: '/drag',
    name: 'drag',
    component: () => import('../views/drag')
  },
  {
    path: '/line',
    name: 'line',
    component: () => import('../views/line')
  },
  {
    path: '/dragDemo',
    name: 'dragDemo',
    component: () => import('../views/dragDemo')
  },
  {
    path: '/doubleLine',
    name: 'doubleLine',
    component: () => import('../views/doubleLine')
  }
]

const router = new VueRouter({
  routes
})

export default router
