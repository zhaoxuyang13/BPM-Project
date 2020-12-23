import Vue from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import VueRouter from 'vue-router'

import ParkingManagement from './components/parkingManagement/ParkingManagement.vue'
import HelloWorld from './components/HelloWorld.vue'

Vue.config.productionTip = false

Vue.use(Antd)
Vue.use(VueRouter)

const routes = [
  { path: '/parkingManagement', component: ParkingManagement },
  { path: '/helloWorld', component: HelloWorld}
]

const router = new VueRouter({
  routes
})

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
