import VueRouter from 'vue-router'
import Account from '@/views/Account'
import CopyrightApplication from '@/views/CopyrightApplication'
import CopyrightApplications from '@/views/CopyrightApplications'
import CreateCopyrightApplication from '@/views/CreateCopyrightApplication'

function routes (repository) {
  return [
    {
      path: '/',
      name: 'Home',
      component: CopyrightApplications,
      props: {
        repository
      }
    },
    {
      path: '/create',
      name: 'Create',
      component: CreateCopyrightApplication,
      props: {
        repository
      }
    },
    {
      path: '/view',
      name: 'View',
      component: CopyrightApplication,
      props: {
        repository
      }
    },
    {
      path: '/account',
      name: 'Account',
      component: Account,
      props: {
        repository
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
}

function router (repository) {
  return new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: routes(repository)
  })
}

export default router
