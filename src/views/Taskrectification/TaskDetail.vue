//12-1-2 整改指标确认追踪-详情页面
<template>
    <div class="taskDetail-container">
        <div class="titlediv">
            <span class="blockspan" style="margin-right: 10px"></span>
            <span class="titlespan">整改任务-任务列表-明细</span>
        </div>
        <div style="margin-bottom: 30px; font-size: 18px;margin-left: -1500px;" @click="$router.back()">
            <i class="el-icon-arrow-left"></i>
            <span>返回</span>
        </div>
        <div style="width: 1580px">
            <!-- 表格 -->
            <el-table
                border
                :data="tableData"
                tooltip-effect="dark"
                style="width: 1580px"
                :header-cell-style="{backgroundColor:'#6E96E9',fontSize:'16px',fontWeight:400,color:'#FFFFFF','text-align': 'center',}"
                :row-style="{ height: '57px' }"
                :header-row-style="{ height: '51px' }" >
                <el-table-column prop="orgName" label="机构" width="175" align="center"></el-table-column>
                <el-table-column prop="departName" label="部门" width="170" align="center"></el-table-column>
                <el-table-column prop="firstIndex" label="一级指标" width="180" align="center"></el-table-column>
                <el-table-column prop="secondIndex" label="二级指标" width="180" align="center"></el-table-column>
                <el-table-column prop="thirdIndex" label="三级指标" width="180" align="center"></el-table-column>
                <el-table-column prop="score" label="分数" width="175" align="center"></el-table-column>
                <el-table-column prop="businessNo" label="证明材料" width="175" align="center">
                    <template slot-scope="scope">
                        <span @click="onDownload(scope)" style="color: #6e96e9; cursor: pointer">
                            下载
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="deadLine" label="止期" width="175" align="center"></el-table-column>
                <el-table-column prop="handleStatus" label="状态" width="169" align="center">
                    <template scope="scope">
                        <span v-if="scope.row.handleStatus === '0'" :style="{ color: '#F0BB3A' }">
                            待审核
                        </span>
                        <span v-else-if="scope.row.handleStatus === '1'" :style="{ color: '#E53E51' }">
                            驳回
                        </span>
                        <span v-else :style="{ color: '#84BA6E' }">
                           审核完成
                        </span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    data() {
        return {
            tableData: [
                {
                    orgName: "总分公司名称",
                    departName: "xxxx部门",
                    firstIndex: "公司治理",
                    secondIndex: "董事会职能设置",
                    thirdIndex: "是否将消费者权",
                    score: 5,
                    businessNo: "下载",
                    deadLine: "2022-07-05",
                    handleStatus: "审核完成",
                },
            ],
        };
    },
    methods: {
        initDetail() {
            console.log("打印接收的路由数据", this.$route.query.draftNo);
            let draftData = this.$route.query.draftNo;
            axios.post("http://101.201.29.183:3500/RectificationTrack/detail?pageNum=1&pageSize=10",{
                  draftNo:draftData,orgId:"",departId:"opr861201"
            }).then(res=>{
                console.log(res);
                if (res.data.success == true) {
                    console.log("12-2", res.data);
                    this.tableData = res.data.data;
                    // this.total = res.data.total
                } else {
                    this.$message.error(res.data.msg);
                }
            })
        },
        // 下载方法
        onDownload(scope) {
            console.log('打印businessNo', scope.row.businessNo);
            axios({
                url: "http://101.201.29.183:3500/file/download",
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                data: JSON.stringify({ businessNo: scope.row.businessNo }),
            }).then((res) => {
                console.log(44444, res);
                if (res.data.success == true) {
                    console.log("下载数据", res.data);
                    let downLoadUrl = res.data.data.downloadUrl;
                    if (downLoadUrl) {
                        // console.log('record.httpAddress: ', record.httpAddress)
                        const link = document.createElement("a");
                        //_blank表示在新窗口打开链接
                        link.target = "_blank";
                        link.href = downLoadUrl;
                        link.setAttribute(
                            "download",
                            "文件名字" + Date.now() + ".xls"
                        ); // 下载文件的名称及文件类型后缀
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link); // 下载完成移除元素
                    }
                } else {
                    throw '下载数据出错'
                }
            });
        },
    },
    created() {
        this.initDetail();
    },
};
</script>

<style lang="less" scoped>
.taskDetail-container {
    box-sizing: border-box;
    width: 1620px;
    height: 904px;
    background: #ffffff;
    border-radius: 8px;
    padding: 60px 0 0 19px;
}
.titlediv {
    margin-bottom: 30px;
    margin-left: 11px;
    height: 18px;
    display: flex;
    align-items: center;

    // 填充绿块
    .blockspan {
        display: inline-block;
        width: 4px;
        height: 16px;
        background: #6e96e9;
    }

    // 上标题修改
    .titlespan {
        font-size: 18px;
        font-weight: 400;
        color: #333333;
    }
}
</style>