<template>
    <div>
        <div style="padding-left: 25px">
            <InputPart @queryData="queryData"></InputPart>
        </div>
        <div style="width: 1580px">
            <!-- 表格 -->
            <el-table border ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 1580px"
                @selection-change="handleSelectionChange" :header-cell-style="{
                    backgroundColor: '#6E96E9',
                    fontSize: '16px',
                    fontFamily: 'Source Han Sans CN',
                    fontWeight: 400,
                    color: '#FFFFFF',
                    'text-align': 'center',
                }" 
                :row-class-name="tableRowClassName" :row-style="{height:'57px'}"
                :header-row-style="{height:'51px'}">
                <el-table-column type="selection" width="40" align="center">
                </el-table-column>
                <el-table-column prop="orgName" label="发起机构" width="440" align="center">
                </el-table-column>
                <el-table-column prop="draftName" label="任务名称" width="440" align="center">
                </el-table-column>
                <el-table-column prop="departName" label="牵头部门" width="440" align="center">
                </el-table-column>
                <el-table-column prop="detail" label="明细" width="219" align="center">
                    <template slot-scope="scope">
                        <div style="color: #84BA6E;" @click="getDetail(scope)">
                            <i class="el-icon-document"></i>
                            <span>明细</span>
                        </div>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <div class="pagination-block">
                <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize"
                    layout="total, prev, pager, next, jumper" :total="total" background>
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
// 引入查询栏
import InputPart from "../components/InputPart.vue";
import axios from "axios"
export default {
    name: "TablePart",
    components: {
        InputPart,
    },
    data() {
        return {
            // 表格默认数据
            tableData: [],
            // 复选框默认数据
            multipleSelection: [],
            // 分页数据
            // 当前页
            currentPage: 1,
            // 每页条目数
            pageSize: 10,
            // 总条目数
            total: 200,
        };
    },
    methods: {
        // 样式相关调整
        // 第一列复选框方法
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 表格隔行换色方法
        tableRowClassName({ row, rowIndex }) {
            if (rowIndex % 2 !== 0) {
                return 'interval-row';
            } else 
            return '';
        },
        // 修改分页文字
        changePaginationText() {
           this.$nextTick(() => {
               document.getElementsByClassName('el-pagination__jump')[0].childNodes[0].nodeValue = '跳转至 '
           })
        },
        // 请求后台数据相关方法
        // 初始化表格数据
          initTable() {
            // 新数据
               axios.post("http://101.201.29.183:3500/RectificationTrack/query?pageNum=1&pageSize=10",{
                orgId:'',draftName:'',leadDepartId:'',departId:"opr861201",missionId:""
               }).then(res=>{
                 this.tableData = res.data.data
                 this.total = res.data.total
               })
        },
        // 分页方法-当前页变化时重新请求数据
            handleCurrentChange(val) {
            // 第一版
            console.log('触发分页', val);
             //修改的
               axios.post(`http://101.201.29.183:3500/RectificationTrack/query?pageNum=${val}&pageSize=10`,{
                     orgId: "",draftName: "",leadDepartId:"",departId: "opr861201",missionId:""
               }).then(res=>{
                // console.log("12的新数据",res)
                 if (res.data.success == true) {
                    // console.log('打印分页表格数据', res.data);
                    this.tableData = res.data.data
                    this.total = res.data.total
                } else {
                    this.$message.error(res.data.messge)
                }
               })
        },
        // 查询条件回传方法  (从InputPart中得到的)
        queryData(val) {
            // console.log('打印回传条件数据', val);
            this.currentPage = 1
            this.pageSize = val.pageNum
            this.total = val.total
            this.tableData = val.data
        },
        // 获取详细页方法
        getDetail(scope) {
            // console.log('获取draftNo', scope.row.draftNo);
            this.$router.push({path:'/taskDetail', query: {draftNo: scope.row.draftNo}
            })
        }
    },
    created() {
        this.changePaginationText();
        this.initTable()
    }
};
</script>

<style lang="less" scoped>


// 复选框形状样式修改
/deep/.el-checkbox__inner {
    width: 18px;
    height: 18px;
    border: 1px solid #d7d7d7;
    border-radius: 4px;
}
/deep/.el-checkbox__inner::after {
    top: 3px;
    left: 6px;
}

/deep/.el-table .interval-row {
    background: #F0F4FD;
}

/deep/.el-dialog {
    margin: 323px 0 0 278px !important;
}

.pagination-block {
    margin-top: 20px;
    // 对分页默认样式进行修改
    .el-pagination {
        // 居左
        text-align: right;
        /deep/.el-pager li {
            line-height: 25px;
        }
    }

    // 使数字有边库框
    /deep/.el-pagination.is-background .btn-next,
    /deep/.el-pagination.is-background .btn-prev,
    /deep/.el-pagination.is-background .el-pager li {
        border: 1px solid #D7D7D7;
        background-color: rgba(0,0,0,0);
    }

    // 选中分页时的颜色
    /deep/.el-pagination.is-background .el-pager li:not(.disabled).active {
        color: #409EFF;
    }


}

</style>