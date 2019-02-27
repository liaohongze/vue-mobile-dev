import Vue from 'vue'
import Router from 'vue-router'
import Navbar from './components/Navbar.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'navbar',
      redirect: '/home',
      component: Navbar,
      children: [
        {
          path: 'home',
          component: () => import('./views/Home.vue')
        },
        {
          path: 'user',
          component: () => import('./views/user/User.vue')
        }
      ]
    }
  ]
})
