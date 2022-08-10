<!-- 任务发布页面   发布:Distribution-->
<template>
<div class="taskOne-container">
        <div class="titlediv">
            <span class="blockspan" style="margin-right: 10px"></span>
            <span class="titlespan">整改任务-列表</span>
        </div>
        <div style="padding-left: 25px;margin-left: 100px;">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item label="发起机构: ">
                    <el-select clearable v-model="formInline.institution" filterable placeholder="">
                        <el-option v-for="item in selectOneOptions" :key="item.orgId" :label="item.orgName" :value="item.orgId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="任务名称: " style="margin-right: 23px">
                    <el-input v-model="formInline.taskName"></el-input>
                </el-form-item>
                <el-form-item label="牵头部队: " style="margin-right: 23px">
                    <el-select clearable v-model="formInline.part" filterable placeholder="">
                        <el-option v-for="item in selectTwoOptions" :key="item.departId" :label="item.departName"
                            :value="item.departId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit" icon="el-icon-search">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="warning" style="width:110px;height:38px;position: relative;top: -5px;left: 0;" @click="Taskflow"> 
                      <img src="../../imgs/组 64.png" style="position:absolute;left: 15px;top: 10px;">
                      <span style="position:absolute;top:11px;left: 40px;">任务流转</span>
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
        <div style="width: 1580px">
            <!-- 表格 -->
            <el-table border ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 1580px"
                @selection-change="handleSelectionChange" 
                :header-cell-style="{
                    backgroundColor: '#6E96E9',
                    fontSize: '16px',
                    fontFamily: 'Source Han Sans CN',
                    fontWeight: 400,
                    color: '#FFFFFF',
                    'text-align': 'center',
                }" 
                :row-class-name="tableRowClassName" :row-style="{height:'57px'}"
                :header-row-style="{height:'51px'}">
                    <el-table-column type="selection" width="40" align="center" >
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
import axios from "axios"
export default {
    data(){
        return {
            flow_draftName:'', //table---底稿名称
            flow_draftNo:'',  //table---底稿编码
             // 发起机构选项数据
             selectOneOptions: [{orgId: "1",orgName: "黄金糕",},],
             // 牵头部队选项数据
             selectTwoOptions: [{departId: "2",departName: "黄金糕",},],
             // 表单信息
             formInline: {institution: "",taskName: "",part: "",},
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
             total: 0,
        }
    },
    computed:{},
    watch:{},
    created(){
         this.initInput()
         this.changePaginationText();
         this.initTable()
    },
    mounted(){},
    methods:{
        // 任务流转
        Taskflow(){
            console.log("任务流转");
            axios.post("http://101.201.29.183:3500/activiti/publish",{
                 draftNo:this.flow_draftNo,
                 draftName:this.flow_draftName,
                 orgId:"8612",
                 departId: "opr861201",
                 missionId:"cpse_deal"
            }).then(res=>{
                console.log(res);
                if(res.data.success===true){
                    console.log(this.flow_draftName);
                    console.log(this.flow_draftNo);
                }else{
                    alert(res.data.message)
                }
            })
        },
        // 样式相关调整
        // 第一列复选框方法
        handleSelectionChange(val) {
            console.log(val);
            this.flow_draftName=val[0].draftName  //底稿名称
            this.flow_draftNo=val[0].draftNo  //底稿编码
            this.multipleSelection = val;
        },
        //选取变颜色的行
        tableRowClassName({ row, rowIndex }) { 
            if (rowIndex % 2 === 1) {
               return "warning-row";
            }
            return "";
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
            axios.post("http://101.201.29.183:3500/deal/getDraftLists?pageNum=1&pageSize=10",{
                orgId: "8612",draftName: "",leadDepartId:"",departId: "opr861205",missionId:"cpse_deal"
            }).then(res=>{
              console.log("13的新值",res);
              this.tableData = res.data.data
              this.total = res.data.total
            })
        },
        // 分页方法-当前页变化时重新请求数据
        handleCurrentChange(val) {
            // 第一版
            console.log('触发分页', val);
            axios.post(`http://101.201.29.183:3500/deal/getDraftLists?pageNum=${val}&pageSize=10`,{
                orgId: "",draftName: "",leadDepartId:"",departId: "opr861201",missionId:"cpse_deal"
            }).then(res=>{
              console.log("13的新值",res);
              this.tableData = res.data.data
              this.total = res.data.total
            })
        },
        // 查询条件回传方法
        queryData(val) {
            console.log('打印回传条件数据', val);
            this.currentPage = 1
            this.pageSize = val.pageNum
            this.total = val.total
            this.tableData = val.data
        },
        // 获取详细页方法
        getDetail(scope) {
            console.log('获取draftNo', scope.row.draftNo);
            this.$router.push({name:'dispose',query: {
                   draftNo: scope.row.draftNo
            }})
        },
       // 获取初始发起机构和牵头部队
        initInput() {            
            axios({
                url: "http://101.201.29.183:3500/Org/query",
                method: "post",
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((res)=> {
                // console.log(3333333, res);
                if(res.data.success == true) {
                    this.selectOneOptions = res.data.data
                }
            });
            axios({
                url: "http://101.201.29.183:3500/Depart/query",
                method: "post",
                headers: {
                    'Content-Type': 'application/json'
                },
               
            }).then((res)=> {
                // console.log(44444, res);
                if(res.data.success == true) {
                    this.selectTwoOptions = res.data.data
                }
            })
        },
        // 三条件查询方法
        onSubmit() { 
            axios.post("http://101.201.29.183:3500/deal/getDraftLists?pageNum=1&pageSize=10",{
                orgId: this.formInline.institution,draftName:this.formInline.taskName,leadDepartId:this.formInline.part,departId:'opr861205',missionId:"cpse_deal"
            }).then(res=>{
             console.log("13的新值",res);
              this.tableData = res.data.data
              this.total = res.data.total
            })
        },
    }
  }
</script>
<style lang="less">
.taskOne-container {
    width: 1620px;
    height: 904px;
    background: #ffffff;
    border-radius: 8px;
    box-sizing: border-box;
    padding: 60px 0 0 19px;
    // 整个上标题块 
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
}
.demo-form-inline {
    font-weight: 400;
    margin-left: -560px;
    // 替换输入框label字体
    /deep/.el-form-item__label {
        // font-weight: 400;
        color: #333333;
        font-size: 13px;
    }
    // 替换查询按钮颜色
    .el-button--primary {
        width: 80px;
        height: 36px;
        background: #6e96e9;
        border-radius: 4px;
    }
    .el-button {
        font-weight: 400;
        padding: 0;
    }

    /deep/.el-dialog {
        margin: 323px 0 0 -200px !important;
    }


}
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
::v-deep .el-pagination .btn-prev,
::v-deep .el-pagination .btn-next {
  background: #fff;
  border: 1px solid #d7d7d7;
}

::v-deep .el-pagination.is-background .el-pager li {
  background: #fff;
  border: 1px solid #d7d7d7;
}
</style>