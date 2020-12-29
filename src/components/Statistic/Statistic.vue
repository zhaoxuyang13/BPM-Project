<template>
<div>
    <a-row >
        <a-col :span="2"></a-col>
        <a-col :span="20" align=left>        
            <h1 style="font-weight:700; font-size:50px;">停车情况统计页面</h1>
        </a-col>
    </a-row>
    <br/>
    <a-row>
        <a-col :span="2"></a-col>
        <a-col :span="1" align=left>
            <a-button icon="reload" @click="Flush"></a-button>
        </a-col>
        <a-col :span="3" align=left>
            <a-button type="primary" @click="ShowTable">显示所有请求</a-button>
        </a-col>
        
        <a-col :span="2"></a-col>
    </a-row>
    <br/>
    <a-row>
        <a-col :span="2"></a-col>
        <a-col :span="9">
            <a-card>
                <a-row>
                    <a-col :span="24" align=center style="font-size:25px;font-weight:500;">
                        停车请求情况
                    </a-col>
                </a-row>
                <a-divider/>
            <a-row>
                <a-col :span="2"></a-col>
                <a-col :span="20" align=left style="font-size:20px">
                    请求总数：
                </a-col>
            </a-row>
            <a-row>
                <a-col :span="2"></a-col>
                <a-col :span="2" align=left style="font-size:20px; margin-top:9px;">
                    {{requestNum}}
                </a-col>
                <a-col :span="20" align=left style="font-size:25px;font-weight:700; margin-top:5px;">
                    个
                </a-col>
            </a-row>
            <br/>
            <a-row>
                <a-col :span="2"></a-col>
                <a-col :span="20" align=left style="font-size:20px;">
                    停车总时长：
                </a-col>
            </a-row>
            <a-row>
                <a-col :span="2"></a-col>
                <a-col :span="3" align=left style="font-size:20px; margin-top:9px;">
                    {{totalTime}}
                </a-col>
                <a-col :span="18" align=left style="font-size:25px;font-weight:700;margin-top:5px;">
                    {{totalTimeUnit}}
                </a-col>
            </a-row>
            </a-card>
        </a-col>

        <a-col :span="2"></a-col>
        <a-col :span="9">
            <a-card>
                <a-row>
                    <a-col :span="24" align=center style="font-size:25px;font-weight:500;">
                        车库收入情况
                    </a-col>
                </a-row>
                <a-divider/>
            <a-row>
                <a-col :span="2"></a-col>
                <a-col :span="20" align=left style="font-size:20px">
                    车库总收入:
                </a-col>
            </a-row>
            <a-row>
                <a-col :span="2"></a-col>
                <a-col :span="3" align=left style="font-size:20px; margin-top:9px;">
                    {{totalFee}}
                </a-col>
                <a-col :span="18" align=left style="font-size:30px;font-weight:700;">
                    ￥
                </a-col>
            </a-row>
            <br/>
            <a-row>
                <a-col :span="2"></a-col>
                <a-col :span="20" align=left style="font-size:20px">
                    平均停车收入：
                </a-col>
            </a-row>
            <a-row>
                <a-col :span="2"></a-col>
                <a-col :span="3" align=left style="font-size:20px; margin-top:9px;">
                    {{averageFee}}
                </a-col>
                <a-col :span="18" align=left style="font-size:30px;font-weight:700;">
                    ￥
                </a-col>
            </a-row>
            </a-card>
        </a-col>
    </a-row>
    <br/>
    
    
    <a-row>
        <a-col :span="2">
        </a-col>
        <a-col :span="20">
            <div v-if="show_table">
            <a-table :columns="columns" :data-source="parkingRequests" :rowKey="parkingRequests => parkingRequests.id" :pagination="false" bordered>
            </a-table>
            </div>
        </a-col>
        <a-col :span="2">
        </a-col>
    </a-row>
</div>
</template>
<script src="./Statistic.js">

</script>
<style>
th.column-money,
td.column-money {
  text-align: right !important;
}
</style>