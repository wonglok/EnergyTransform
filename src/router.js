import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: require('./views/Landing.vue').default
    },
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
