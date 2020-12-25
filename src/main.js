import Vue from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import VueRouter from 'vue-router'
import axios from 'axios'

import ParkingManagement from './components/parkingManagement/ParkingManagement.vue'
import HelloWorld from './components/HelloWorld.vue'
import ParkCar from "./components/parkCar/ParkCar.vue";

Vue.config.productionTip = false

Vue.use(Antd)
Vue.use(VueRouter)

Vue.prototype.$axios = axios
Vue.prototype.$ajax = axios
axios.defaults.baseURL = 'http://202.120.40.8:30611/Entity/U994562eaecc68/parking'

const routes = [
  { path: '/parkingManagement', component: ParkingManagement },
  { path: '/parkCar', component: ParkCar},
  { path: '/helloWorld', component: HelloWorld}
]

const router = new VueRouter({
  routes
})

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
