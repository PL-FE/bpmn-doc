import Vue from 'vue'
import VueRouter from 'vue-router'
import Bpmn from '@/views/bpmn'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Bpmn',
    component: Bpmn
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
