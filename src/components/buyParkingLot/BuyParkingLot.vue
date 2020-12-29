<template>
  <div>
    <a-row >
        <a-col :span="2"></a-col>
        <a-col :span="20" align=center>        
            <h1 style="font-weight:700; font-size:50px;">车位购买</h1>
        </a-col>
    </a-row>       
    <a-row>
        <a-col :span="6"></a-col>
        <a-col :span="12">
          <a-row>
            <a-col :span="3">
            </a-col>
            <a-col :span="12" align=right>
<!--              <a-input ref="carPaiInput" v-model="carPai" placeholder="车牌号" style="margin-bottom: 2%"></a-input>-->
              <CarPlateKeyboard
                  car-number="车牌"
                  active-color="#ff0000"
                  ok-btn-text="关闭"
                  v-on:tap-key="tapedKey"
                  v-on:tap-box="tapedBox"
                  v-on:tap-del="tapedDel"
                  v-on:tap-ok="tapedOk"
              ></CarPlateKeyboard>

            </a-col>
            <a-col :span="1">
            </a-col>

            <a-col :span="6" align=left>
              <a-button type="primary" @click="getFullData()" size="large"> 输入车牌号 </a-button>
            </a-col>
          </a-row>
          <a-table v-if="showTable" :columns="columns" :data-source="data" :rowKey="data => data.id" :pagination="false" bordered>
            <span slot="action" slot-scope="text, record">
              <a-button type="primary" @click="buyParkingLot(record)" :disabled="!buyable(record)"> 购买 </a-button>
            </span>
          </a-table>
        </a-col>
        <a-col :span="6"></a-col>
      </a-row>
  </div>
</template>

<script>

import CarPlateKeyboard from '../parkCar/carPlatePanel.vue'


let columns = [
  {
    title: '车位编号',
    dataIndex: 'parkinglotid',
    key: 'parkinglotid'
  },
  {
    title: '车库所有者',
    dataIndex: 'ownerid',
    key: 'ownerid'
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: {customRender: 'action'}
  }
]

let data = []
let carPai = ''
let showTable = false
export default {
  name: 'BuyParkingLot',
  components:{
    CarPlateKeyboard
  },
  data () {
    return {
      data,
      columns,
      carPai,
      showTable
    }
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
    async buyParkingLot(parkingLot) {
      if (this.carPai === '') {
        this.$message.error('车牌号没填')
        return
      }
      let deepCopy = JSON.parse(JSON.stringify(parkingLot))
      try {
        deepCopy.ownerid = this.carPai
        await this.$axios.put('/Parkinglot/' + deepCopy.id, deepCopy)
        parkingLot.ownerid = this.carPai
        this.$message.info('购买成功')
      } catch (err) {
        console.error(err)
        this.$message.info('出了一点问题')
      }
    },
    buyable(record) {
      if (this.carPai === '')
        return false
      if (record.ownerid === this.carPai)
        return false
      return true
    },
    async getFullData() {
      try {
        if (this.carPai === '') {
          this.$message.info('请输入车牌号')
          return
        }
        let buyableParklingLotsResponse = await this.$axios.get('/Parkinglot')
        let buyableParklingLots = buyableParklingLotsResponse.data.Parkinglot
        if (buyableParklingLots === undefined) {
          this.$message.info('现在没有可以购买的车位')
        }
        this.data = buyableParklingLots
        this.showTable = true
      } catch (err) {
        console.error(err)
      }
    }
  },
  computed: {
  },
  mounted: async function () {
    /*try {
      let buyableParklingLotsResponse = await this.$axios.get('/Parkinglot')
      let buyableParklingLots = buyableParklingLotsResponse.data.Parkinglot
      if (buyableParklingLots === undefined) {
        this.$message.info('现在没有可以购买的车位')
      }
      this.data = buyableParklingLots
    } catch (err) {
      console.error(err)
      this.$message.error('出了一点问题')
    }*/
  }
}
</script>

<style>

</style>