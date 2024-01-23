import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  // need to re-build the docs
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/MainEditor.vue'),
      meta: {
        keepAlive: true,
      }
    },
    {
      path: '/translate',
      name: 'translate',
      component: () => import('../views/Translation.vue'),
      meta: {
        keepAlive: true,
      }
    },
    {
      path: '/compile',
      name: 'compile',
      component: () => import('../views/Compilation.vue'),
      meta: {
        keepAlive: true,
      }
    },

    // {
    //   path: '/compile',
    //   name: 'compile',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/Compilation.vue')
    // }
  ]
})

export default router
