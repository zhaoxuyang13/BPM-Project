
<template>
  <div>
    <h1 style="height: 50px; font-weight:700; font-size:50px;"> <img src="../../assets/parkCar.png" style="height: 100%" alt="park"> 停车 </h1>


    <a-row type="flex" justify="center" v-if="!pendingRequestEnd">
      <a-col :xs="20" :sm="16" :md="12" :lg="8" :xl="6" >
        <div >
          <a-input ref="userNameInput" v-model="userName" placeholder="用户名" style="margin-bottom: 10px;" size="large">
            <a-icon slot="prefix" type="user" />
            <a-tooltip slot="suffix" title="输入用户名为演示用，在实现登陆之后，这个输入框应该变成静态文本框">
              <a-icon type="info-circle" style="color: rgba(0,0,0,.45)" />
            </a-tooltip>
          </a-input>
          <CarPlateKeyboard
              car-number="车牌"
              active-color="#ff0000"
              ok-btn-text="关闭"
              v-on:tap-key="tapedKey"
              v-on:tap-box="tapedBox"
              v-on:tap-del="tapedDel"
              v-on:tap-ok="tapedOk"
          ></CarPlateKeyboard>
<!--          <a-input ref="carPaiInput" v-model="carPai" placeholder="车牌号" style="margin-bottom: 10px" size="large"></a-input>-->
          <a-button type="primary" @click="request_for_parking" :loading="pendingRequestSend" > 我要停车 </a-button>
<!--          <a-button type="primary" @click="fakeSuccess" > 假装成功 </a-button>-->
        </div>
      </a-col>
<!--      <a-col :xs="4" :sm="4" :md="4" :lg="3" :xl="2" >-->
<!--      </a-col>-->
    </a-row>
    <a-row type="flex" justify="center" v-if="pendingRequestEnd">

      <a-col :xs="20" :sm="16" :md="12" :lg="8" :xl="6" >
        <a-card title="分配车位信息" style="width: 100%">
          <div >
            <template  style="margin-bottom: 10px; ">
              <div style="font-size: large; text-align: left; margin-left: 0%">
                <a-icon slot="prefix" type="user" /> 车主: {{this.userName}}<br>
                <a-icon type="car" /> 车牌: {{this.carPai}}<br>
                <a-icon type="appstore" /> 分配车位: {{this.parkinglotid}} <br>
              </div>
            </template>
            <template  style="margin-bottom: 10px;"  v-if="entered">
              <div style="font-size: large; text-align: left; margin-left: 0%">
                <a-icon type="clock-circle" /> 进场时间: {{dateFormat(this.enterTime)}}
              </div>
            </template><br>
            <a-button type="primary" @click="request_for_entering" v-if="!entered" > 点击进场 </a-button>
            <a-button type="primary" @click="exit_parking" v-if="entered & !exited"> 点击离场 </a-button>

            <a-modal v-model="exited" title="支付" on-ok="handleOk">
              <template slot="footer">
                <a-button type="primary" @click="fakepay" :loading="paying"> 支付 </a-button>
              </template>
              <div v-if="exited" >
                <a-icon type="car" /> 车牌:{{this.carPai}}<br>
                <a-icon type="clock-circle" /> 进场时间: {{dateFormat(this.enterTime)}} <br>
                <a-icon type="clock-circle" /> 离场时间: {{dateFormat(this.outTime)}} <br>
                <a-icon type="pay-circle" /> 车费共计： {{this.fee}} 元
              </div>
            </a-modal>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>


import CarPlateKeyboard from './carPlatePanel.vue'



// import KeyBoard from "./KeyBoard.vue";
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

let sendExitParkingRequest = (that) =>{
  that.$axios.put("/Parkingrequest/" + that.reqId,
      {
        "status": "PAID",
        "parkinglotid": that.parkinglotid,
        "carid": that.carPai,
        "entertime": that.enterTime,
        "leavetime" : that.outTime,
        "fee" : that.fee,
      }
  ).then(resp => {
    console.log(resp)
    that.refreshStates()
  })
}
let calcFee = (begin, end) => {
  let interv = (end - begin)/1000
  let min = Math.floor(interv / 60) % 60
  let hour = Math.floor(interv / 3600)
  if(min <= 15 && hour == 0)
    return 10
  return hour * 15 + Math.ceil(min/30)*10

}
// // 输入完成时此函数会被调用
// let  native_callback_completed = (number, isAutoCompleted) => {
//   alert("车牌号码已输入完成: " + number + "，自动完成吗？" + isAutoCompleted);
// }
//
// // 输入过程中，车牌号码增量变化时，此函数会被调用
// let  native_callback_changed = (number, isCompleted) => {
//   alert("输入中的车牌：" + number + "，是否完成：" + isCompleted);
// }
export default {
  name: 'ParkCar',
  components:{
    CarPlateKeyboard
  },
  data() {
    return {
      collapsed: false,
      userName: '',
      carPai:'',
      reqId: null,
      pendingRequestSend: false,
      pendingRequestEnd:false,
      parkinglotid:null,
      entered:false,
      enterTime: null,
      exited : false,
      outTime: null,
      fee: 0,
      feePaid: false,
      paying: false,
      // oncompleted: native_callback_completed,
      // onkeypressed: native_callback_changed,
    };
  },
  methods: {
    tapedKey (data) {
      console.log(data);
    },
    tapedBox (data) {
      console.log(data)
    },
    tapedDel (data) {
      console.log(data);
    },
    tapedOk (data) {
      console.log(data);
      this.carPai = data.value
      console.log(this.carPai)
    },
    refreshStates(){
      this.reqId = null
      this.reqId= null
      this.pendingRequestSend= false
      this.pendingRequestEnd=false
      this.parkinglotid=null
      this.entered=false
      this.enterTime= null
      this.exited =false
      this.outTime= null
      this.fee= 0
      this.feePaid= false
      this.paying= false
    },
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
    },
    exit_parking(){
      this.outTime = new Date().toString()
      this.fee = calcFee(new Date(this.enterTime),new Date(this.outTime))
      console.log(this.outTime,this.fee)
      this.exited= true
    },
    fakepay(){
      this.paying = true
      setTimeout(()=>{
        this.feePaid = true
        this.paying = false
        this.$message.info("车费支付成功，正在离场...")
        sendExitParkingRequest(this)
      },3000)
    },
    dateFormat(datestr) {
      let fmt = "YYYY-mm-dd HH:MM"
      let date = new Date(datestr)
      let ret
      const opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
      }
      for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
          fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        }
      }
      console.log(fmt)
      return fmt;
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
.page{
   /*background-color: antiquewhite;*/
   padding:20px;
}
</style>
