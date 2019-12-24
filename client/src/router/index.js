import Vue from 'vue'
import VueRouter from 'vue-router'
import Repository from '../repositories/Repository'
import CopyrightApplications from '../views/CopyrightApplications'
import CreateCopyrightApplication from '../views/CreateCopyrightApplication'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: CopyrightApplications,
    props: {
      repository: new Repository()
    }
  },
  {
    path: '/create',
    name: 'Create',
    component: CreateCopyrightApplication,
    props: {
      repository: new Repository()
    }
  }
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
