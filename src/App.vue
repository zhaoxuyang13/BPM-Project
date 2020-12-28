<template>
  <div id="app">
    <a-layout id="components-layout-demo-side" style="min-height: 100vh">
      <a-layout-sider v-model="collapsed" collapsible>
        <div class="logo" />
        <a-menu theme="dark" :default-selected-keys="['1']" mode="inline">
          <a-menu-item @click="navigateToHome" key="2">
            <a-icon type="home" />
            <span >主页</span>
          </a-menu-item>
          <a-sub-menu key="sub1">
            <span slot="title"><a-icon type="user" /><span>车主端</span></span>
            <a-menu-item @click="navigateToParkCar" key="2">
              <a-icon type="pie-chart" />
              <span >停车</span>
            </a-menu-item>
            <a-menu-item @click="navigateToBuyParkingLot"  key="3">
              <a-icon type="desktop" />
              <span>买车位</span>
            </a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="sub2">
            <span slot="title"><a-icon type="user" /><span>车库端</span></span>
            <a-menu-item @click="navigateToParkingManagement" key="4">
              <a-icon type="pie-chart" />
              <span >停车位管理</span>
            </a-menu-item>
          </a-sub-menu>
        </a-menu>
      </a-layout-sider>
      <a-layout>
        <a-layout-header style="margin-left: 16px; padding: 0" />
        <a-layout-content :style="{ margin: '24px 16px 0', overflow: 'initial' }">
          <div :style="{ padding: '24px', background: '#fff', textAlign: 'center' }">
            <router-view/>
          </div>
        </a-layout-content>
        <a-layout-footer style="text-align: center">
          Parking system ©2020-BPM-Project
        </a-layout-footer>
      </a-layout>
    </a-layout>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {},
  data(){
    return {
      collapsed:false,
    }
  },
  methods:{
    navigateToHome(){
      this.$router.push("/")
    },
    navigateToParkCar(){
      this.$router.push("parkCar")
    },
    navigateToBuyParkingLot(){
      this.$router.push("buyParkingLot")
    },
    navigateToParkingManagement(){
      this.$router.push("ParkingManagement")
    }

  }
}
</script>

<style>
#components-layout-demo-side .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
  background: url("assets/cargo.png") no-repeat center center ;
  background-size: contain;

}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}
</style>
