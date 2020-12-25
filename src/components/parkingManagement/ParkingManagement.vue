<template>
  <div class="hello">
    <h1>这是车库端管理页面</h1>
    <a-row>
      <a-col :span="6"></a-col>
      <a-col :span="12">
        <a-table :columns="columns" :data-source="data" :rowKey="data => data.id" :pagination="false"></a-table>
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
    title: '状态',
    dataIndex: 'status',
    key: 'status'
  },
  {
    title: '车库所有者',
    dataIndex: 'ownerid',
    key: 'ownerid'
  },
  {
    title: '现在停放车辆的车牌号',
    dataIndex: 'carid',
    key: 'carid'
  }
]

let data = [
        /*{
            "id": 1608774808491,
            "parkinglotid": "1",
            "carid": "0",
            "status": "FREE",
            "ownerid": ""
        },
        {
            "id": 1608774818201,
            "parkinglotid": "2",
            "carid": "0",
            "status": "FREE",
            "ownerid": ""
        },
        {
            "id": 1608774830943,
            "parkinglotid": "3",
            "carid": "0",
            "status": "FREE",
            "ownerid": ""
        },
        {
            "id": 1608774836104,
            "parkinglotid": "4",
            "carid": "0",
            "status": "FREE",
            "ownerid": ""
        },
        {
            "id": 1608774841346,
            "parkinglotid": "5",
            "carid": "0",
            "status": "FREE",
            "ownerid": ""
        }*/
]

const SHORT_INTERVAL = 5000
const LONG_INTERVAL = 10000

function getParkingLotData(that) {
  console.log(that.$axios.get('/Parkinglot'))
  that.$axios
    .get('/Parkinglot')
    .then((response) => {
      console.log(response)
      if (response.data.Parkinglot) {
        that.data = response.data.Parkinglot
      } else {
        that.data = []
      }
      setTimeout(getParkingLotData, SHORT_INTERVAL, that)
    }).catch((error) => {
      console.error(error)
    })
}

async function allocateParkingLot(that, carID) {
  try {
    let freeParkingLotsResponse = await that.$axios.get('/Parkinglot?Parkinglot.status=FREE')
    console.log(freeParkingLotsResponse)
    let freeParkingLots = freeParkingLotsResponse.data.Parkinglot
    if (freeParkingLots === undefined) {
      throw new Error('No free parking lots')
    }
    let allocated = freeParkingLots[0]
    allocated.status = 'OCCUPIED'
    allocated.carid = carID
    await that.$axios.put('/Parkinglot/' + allocated.id, allocated)
    console.log('allocate ' + allocated.parkinglotid + ' for car ' + carID)
    return allocated.parkinglotid
  } catch (error) {
    console.error(error)
    return null
  }
}

async function modifyParkingRequest(that, parkingRequest) {
  try {
    await that.$axios.put('/Parkingrequest/' + parkingRequest.id, parkingRequest)
  } catch (error) {
    console.log(error)
  }
}

function handleEntered(that, parkingRequest) {
  console.assert(!(parkingRequest.entertime === undefined), 'entertime should not be undefined')
  that.$message.info('车主' + parkingRequest.carid + '已经进入了停车场，时间：' + parkingRequest.entertime)
}

function handleLeaving(that, parkingRequest) {
  console.assert(!(parkingRequest.leavetime === undefined), 'leavetime should not be undefined')
  console.assert(!(parkingRequest.fee === undefined), 'fee should not be undefined')
  that.$message.info('车主' + parkingRequest.carid + '准备离开停车场，时间：' + parkingRequest.leavetime + '费用：' + parkingRequest.fee)
}

async function handlePaid(that, parkingRequest) {
  if (parkingRequest.parkinglotid === undefined) {
    console.assert(false, 'parkinglotid should not be undefined')
    return false
  }
  try {
    let parkingLotResponse = await that.$axios.get('/Parkinglot/?Parkinglot.parkinglotid=' + parkingRequest.parkinglotid)
    let parkinglot = parkingLotResponse.data.Parkinglot
    if (parkinglot.length != 1) {
      throw new Error('maybe duplicate parkinglotid: ' + parkingRequest.parkinglotid)
    }
    parkinglot = parkinglot[0]
    parkinglot.carid = ''
    parkinglot.status = 'FREE'
    await that.$axios.put('/Parkinglot/' + parkinglot.id, parkinglot)
    that.$message.info('车主' + parkingRequest.carid + '完成缴费，允许驶离停车场')
    return true
  } catch (error) {
    console.error(error)
    return false
  }
  
}

function checkParkingRequest(that, parkingRequestID) {
  that.$axios
    .get('/Parkingrequest/' + parkingRequestID)
    .then(async (response) => {
      let parkingRequest = response.data
      let err
      let paidResult
      console.assert(!(parkingRequest.status === undefined), 'parkingRequest status undefined')
      switch (parkingRequest.status) {
        case 'PENDING':
          console.assert(false, 'should not be PENDING here')
          break
        case 'ACCEPTED':
          break // ACCEPTPED不要处理
        case 'ENTERED':
          handleEntered(that, parkingRequest)
          break
        case 'LEAVING':
          handleLeaving(that, parkingRequest)
          break
        case 'PAID':
          paidResult = await handlePaid(that, parkingRequest)
          console.assert(paidResult, 'handlePaid returns false')
          break
        default:
          err = 'unknown parking request status: ' + parkingRequest.status
          console.assert(false, err)
          throw new Error(err)
      }
      if (parkingRequest.status === 'PAID') {
        return
      } else {
        setTimeout(checkParkingRequest, SHORT_INTERVAL, that, parkingRequestID)
      }
    }).catch((error) => {
      console.error(error)
    })
}

async function searchPendingParkingRequests(that) {
  that.$axios
    .get('/Parkingrequest/?Parkingrequest.status=PENDING')
    .then(async (response) => {
      console.log(response)
      if (response.data.Parkingrequest) {
        let pendingParkingRequests = response.data.Parkingrequest
        let count = pendingParkingRequests.length
        for (let i = 0; i < count; i++) {
          // we find a pending request
          let pendingRequest = pendingParkingRequests[i]
          console.assert(!(pendingRequest.carid === undefined), 'carid should not be undefined')
          let parkinglotid = await allocateParkingLot(that, pendingRequest.carid)
          if (parkinglotid === null) {
            that.$message.info('没有空停车位了，拒绝了' + pendingRequest.carid + '的停车请求')
            pendingRequest.status = 'REJECTED'
            await modifyParkingRequest(that, pendingRequest)
            continue
          }
          pendingRequest.status = 'ACCEPTED'
          pendingRequest.parkinglotid = parkinglotid
          await modifyParkingRequest(that, pendingRequest)
          that.$message.info('为' + pendingRequest.carid + '分配了' + parkinglotid + '号车位')
          checkParkingRequest(that, pendingRequest.id) // 开启loop，扫描这个parking request
        }
      }
      setTimeout(searchPendingParkingRequests, LONG_INTERVAL, that)
    }).catch((error) => {
      console.error(error)
    })
}

export default {
  name: 'ParkingManagement',
  data () {
    return {
      data,
      columns
    }
  },
  mounted: function () {
    getParkingLotData(this)
    searchPendingParkingRequests(this)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
