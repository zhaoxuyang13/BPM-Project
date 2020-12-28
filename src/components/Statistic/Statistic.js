let columns = [
    {
        title:"ID",
        dataIndex:"id",
        key:"id",
    },
    {
        title:"Enter Time",
        dataIndex:"entertime",
        key: "entertime",
    },
    {
        title:"Leave Time",
        dataIndex:"leavetime",
        key:"leavetime",
    },
    {
        title:"Fee",
        dataIndex:"fee",
        key:"fee",
    }

]

let parkingRequests = [{
    "id": "ID123",
    "entertime": "1998.4.32",
    "leavetime": "2929,4,21",
    "fee": "100$",

}]

export default{
    data(){
        return {
            parkingRequests,
            columns,
            show_table:true,
            totalTimeUnit:"分钟",
        }
    },
    created: function() {
        // var response = await this.$axios.get('/Parkingrequest?Parkingrequest.status=PAID')
        this.$axios.get('/Parkingrequest?Parkingrequest.status=PAID').then(response =>{
            this.parkingRequests = response.data.Parkingrequest
            for(let i = 0; i < this.parkingRequests.length; i++)
                this.parkingRequests[i].key = i

            console.log(this.parkingRequests)
        })
        
    },
    methods: {
        ShowTable(){
            this.show_table = !this.show_table
        },
        Flush(){
            this.$axios.get('/Parkingrequest?Parkingrequest.status=PAID').then(response =>{
                this.parkingRequests = response.data.Parkingrequest
                for(let i = 0; i < this.parkingRequests.length; i++)
                    this.parkingRequests[i].key = i
    
                console.log(this.parkingRequests)
            })
        }
    },
    computed:{
        totalFee(){
            var fee = 0
            for(var i = 0; i < this.parkingRequests.length; i++){
                fee += parseInt(this.parkingRequests[i].fee)
            }
            return fee
        },
        averageFee(){
            var fee = 0
            for(var i = 0; i < this.parkingRequests.length; i++){
                fee += parseInt(this.parkingRequests[i].fee)
            }
            var averageFee = fee / this.parkingRequests.length
            averageFee = averageFee.toFixed(2)
            return averageFee
        },
        requestNum(){
            return this.parkingRequests.length
        },
        totalTime(){
            var totalParkTime = 0
            for(var i = 0; i < this.parkingRequests.length; i++){
                var entertimeDate = new Date(this.parkingRequests[i].entertime.substring(0,24))
                var leavetimeDate = new Date(this.parkingRequests[i].leavetime.substring(0,24))
                totalParkTime += Date.parse(leavetimeDate) - Date.parse(entertimeDate)
            }
            totalParkTime /= 1000
            totalParkTime /= 60
            if (totalParkTime > 100){
                this.totalTimeUnit = "小时"
                totalParkTime /= 60
            }
            totalParkTime = totalParkTime.toFixed(2)
            return totalParkTime
        }
    }
}