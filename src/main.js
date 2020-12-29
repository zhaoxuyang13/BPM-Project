import Vue from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import VueRouter from 'vue-router'
import axios from 'axios'

import ParkingManagement from './components/parkingManagement/ParkingManagement.vue'
import HelloWorld from './components/HelloWorld.vue'
import ParkCar from './components/parkCar/ParkCar.vue'
import Statistic from './components/Statistic/Statistic.vue'
import BuyParkingLot from './components/buyParkingLot/BuyParkingLot.vue'
import Index from './components/index/Index.vue'
Vue.config.productionTip = false

Vue.use(Antd)
Vue.use(VueRouter)

Vue.prototype.$axios = axios
Vue.prototype.$ajax = axios
Vue.prototype.$validCarPlateNo = (str) => /^[\u4eac\u6caa\u6d25\u6e1d\u5180\u664b\u8499\u8fbd\u5409\u9ed1\u82cf\u6d59\u7696\u95fd\u8d63\u9c81\u8c6b\u9102\u6e58\u7ca4\u6842\u743c\u5ddd\u8d35\u4e91\u85cf\u9655\u7518\u9752\u5b81\u65b0][a-zA-Z](([\da-zA-Z]{5,6}$)|([\da-zA-Z]{4,5}[\u6e2f\u6fb3\u5b66\u8b66]$))/.test(str)
axios.defaults.baseURL = 'http://202.120.40.8:30611/Entity/U994562eaecc68/parking'

const routes = [
  { path: '/', component: Index},
  { path: '/parkingManagement', component: ParkingManagement },
  { path: '/parkCar', component: ParkCar},
  { path: '/helloWorld', component: HelloWorld},
  { path: '/statistic', component: Statistic},
  { path: '/buyParkingLot', component: BuyParkingLot}
]

const router = new VueRouter({
  routes
})

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
