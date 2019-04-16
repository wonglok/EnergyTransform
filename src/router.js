import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/routes',
      component: require('./views/Routes.vue').default
    },
    {
      path: '/',
      component: require('./views/Game/LandingGame.vue').default
    },
    {
      path: '/mobile/:uid/:gameID',
      meta: {
        hide: true
      },
      // route level code-splitting
      // this generates a separate chunk (user-client.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: require('./views/Game/MobileClient.vue').default
    },
    {
      path: '/projector/:uid/:gameID',
      meta: {
        hide: true
      },
      // route level code-splitting
      // this generates a separate chunk (user-client.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: require('./views/Game/ProjectorClient.vue').default
    },
    // {
    //   name: 'mobile-client',
    //   path: '/mobile-client/:gameID',
    //   meta: {
    //     hide: true
    //   },
    //   // route level code-splitting
    //   // this generates a separate chunk (user-client.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "user-client" */ './views/Game/MobileClient.vue')
    // },

    {
      path: '/proto-energy',
      // route level code-splitting
      // this generates a separate chunk (proto-energy.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "proto-energy" */ './ProtoEnergy/Pipeline/SimulationEngine.vue')
    },
    {
      path: '/game',
      // route level code-splitting
      // this generates a separate chunk (proto-energy.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "proto-energy" */ './ProtoEnergy/Pipeline/GamePipe.vue')
    },
    {
      path: '/audio',
      // route level code-splitting
      // this generates a separate chunk (proto-energy.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "proto-energy" */ './ProtoEnergy/Pipeline/AudioPipe.vue')
    },
    {
      path: '/gravity-animation',
      // route level code-splitting
      // this generates a separate chunk (proto-energy.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "proto-energy" */ './ProtoEnergy/Pipeline/LocalPhysicsEngine.vue')
    }
  ]
})
