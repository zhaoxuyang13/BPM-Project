<template>
  <div class="hello">
    <h1>Hello Vue.js! This is intended to be the CarPark page.</h1>
    <h2>这是车主停车页面</h2>
    <a-row type="flex" justify="center" v-if="!pendingRequestEnd">
      <a-col :xs="20" :sm="16" :md="12" :lg="8" :xl="6" >
        <div >
          <a-input ref="userNameInput" v-model="userName" placeholder="用户名" style="margin-bottom: 10px">
            <a-icon slot="prefix" type="user" />
            <a-tooltip slot="suffix" title="输入用户名为演示用，在实现登陆之后，这个输入框应该变成静态文本框">
              <a-icon type="info-circle" style="color: rgba(0,0,0,.45)" />
            </a-tooltip>
          </a-input>
          <a-input ref="carPaiInput" v-model="carPai" placeholder="车牌号" style="margin-bottom: 10px"/>
          <a-button type="primary" @click="request_for_parking" :loading="pendingRequestSend" > 我要停车 </a-button>
          <a-button type="primary" @click="fakeSuccess" > 假装成功 </a-button>
        </div>
      </a-col>
<!--      <a-col :xs="4" :sm="4" :md="4" :lg="3" :xl="2" >-->
<!--      </a-col>-->
    </a-row>
    <a-col :xs="20" :sm="16" :md="12" :lg="8" :xl="6" >
      <div >
        <a-textarea  style="margin-bottom: 10px">
          <a-icon slot="prefix" type="user" />
          车主：{{this.userName}} ，车牌:{{this.carPai}}<br>
          分配车位: {{this.parkinglotid}}
        </a-textarea>
        <a-button type="primary" @click="request_for_entering"  > 进场 </a-button>

      </div>
    </a-col>
    <a-row type="flex" justify="center" v-if="!pendingRequestEnd">

    </a-row>
  </div>
</template>

<script>


const SHORT_INTERVAL = 5000
// const LONG_INTERVAL = 10000

let waitParkingRequestAccepted = (that,reqId) =>{
  /* for debug */
  if(that.parkinglotid != null){
    that.pendingRequestSend = false
    that.$message.info("已经被分配了" + that.parkinglotid  + "车位")
    that.pendingRequestEnd = true
    return;
  }
  that.$axios.get("/Parkingrequest/" +reqId)
    .then(resp=>{
      console.log("wait resp:",resp)
      if(resp.data.status == "ACCEPTED"){
        that.pendingRequestSend = false
        that.pendingRequestEnd = true
        that.parkinglotid = resp.data.parkinglotid
        that.$message.info("已经被分配了" + resp.data.parkinglotid  + "车位")
      }else{
        setTimeout(()=>{
          waitParkingRequestAccepted(that,reqId)
        }, SHORT_INTERVAL)
      }
    })
}
let sendPendingParkingRequests = (that,username,carId) =>{

  that.$axios.post("/Parkingrequest/",
      {
        "status": "PENDING",
        // "username" : username,
        "carid": carId,
      }
  ).then(resp=>{
    that.pendingRequestSend = true;
    console.log(resp)
    that.$message.info("正在分配车位，请稍候...")
    that.reqId = resp.data.id;
    waitParkingRequestAccepted(that,that.reqId)
  })

}
let sendEnteringRequests = (that) => {
  that.$axios.put("/Parkingrequest/" + that.reqId,
      {
        "status": "ENTERED",
        "parkinglotid": that.parkinglotid,
        "carid": that.carPai,
        "entertime": that.enterTime,
      }).then(resp=>{
        console.log(resp)
  })
}

export default {
  name: 'ParkCar',
  data() {
    return {
      userName: '',
      carPai:'',
      reqId: null,
      pendingRequestSend: false,
      pendingRequestEnd:false,
      parkinglotid:null,
      entered:false,
      enterTime: null,
    };
  },
  methods: {
    emitEmpty() {
      this.$refs.userNameInput.focus();
      this.userName = '';
      this.carPai = '';
    },
    request_for_parking(){
      sendPendingParkingRequests(this,this.userName,this.carPai)
    },
    fakeSuccess(){
      this.parkinglotid = 1
    },
    request_for_entering(){
      this.entered = true
      this.enterTime = new Date().toString();
      sendEnteringRequests(this)

    }
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
