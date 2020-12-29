<template>
  <div>
      <h1>我要购买车位</h1>
      <a-row>
        <a-col :span="6"></a-col>
        <a-col :span="12">
          <a-row>
            <a-col :span="18">
              <a-input ref="carPaiInput" v-model="carPai" placeholder="车牌号" style="margin-bottom: 2%"></a-input>
            </a-col>
            <a-col :span="6">
              <a-button type="primary" @click="getFullData()"> 输入车牌号 </a-button>
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
  data () {
    return {
      data,
      columns,
      carPai,
      showTable
    }
  },
  methods: {
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