<template>
  <div class="hello">
    <h1>Hello Vue.js! This is intended to be the CarPark page.</h1>
    <h2>这是车主停车页面</h2>
    <a-row type="flex" justify="center">
      <a-col :xs="20" :sm="16" :md="12" :lg="8" :xl="6" >
        <div >
          <a-input ref="userNameInput" v-model="userName" placeholder="用户名">
            <a-icon slot="prefix" type="user" />
            <a-tooltip slot="suffix" title="输入用户名为演示用，在实现登陆之后，这个输入框应该变成文本框">
              <a-icon type="info-circle" style="color: rgba(0,0,0,.45)" />
            </a-tooltip>
          </a-input>
        </div>
    </a-col>
    <a-col :xs="4" :sm="4" :md="4" :lg="3" :xl="2" >
      <a-button type="primary" @click="request_for_parking" > 我要停车 </a-button>
    </a-col>
    </a-row>

  </div>
</template>

<script>
import axios from 'axios'
let URL_PREFIX = "http://202.120.40.8:30611/Entity/U994562eaecc68/parking/"

export default {
  name: 'ParkCar',
  data() {
    return {
      userName: '',
    };
  },
  methods: {
    emitEmpty() {
      this.$refs.userNameInput.focus();
      this.userName = '';
    },
    request_for_parking(username){
      axios.request({
        method:"POST",
        baseURL:URL_PREFIX,
        data:{
          username:username
        },
      }).then(resp => {
        console.log(resp)
      }).catch(err => {
        console.log(err)
      })
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
