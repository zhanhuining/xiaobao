<!-- 11-整改任务发布查看表单 -->
<template>
    <div class="lookTask">
        <header>
            <div class="titlediv">
                <span class="blockspan" style="margin-right: 10px"></span>
                <span class="titlespan">整改任务发布</span>
            </div>
            <router-link style="float:right;color:#333333;font-size:18px;text-decoration:none; margin-top: 60px;margin-right: 63px;"
                :to="{ name:'rectTaskRelease' }">
                <i class="el-icon-arrow-left"></i>
                返回
            </router-link>
        </header>
        <div class="body" >
            <el-form inline ref="QueryForm" :rules="this.QueryRules" :model="TaskKey" style="margin-left:20px;">
                <el-form-item label="一级指标：" prop="orgId">
                    <el-select v-model="TaskKey.orgId" clearable placeholder="请选择一级指标" @change="changeValue(TaskKey.orgId)">
                        <el-option v-for="(v, k) in orgdata" :key="k"  :value="v" ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="二级指标：" prop="leadDepartId">
                    <el-select v-model="TaskKey.leadDepartId" clearable placeholder="请选择二级指标">
                        <el-option v-for="(v, k) in departdata" :key="k" :value="v">
                        </el-option>
                    </el-select>
                </el-form-item>
                
                <el-form-item label="三级指标："  clearable prop="deadLine">
                    <el-input
                      v-model="TaskKey.deadLine"
                      clearable
                      placeholder="请选择三级指标"
                    >
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="small" icon="el-icon-search" @click="queryfn">查询</el-button>
                    <el-button type="success" size="small" icon="el-icon-plus" @click="addRecttask">添加</el-button>
                    <el-button type="danger" size="small" icon="el-icon-delete" plain @click="deletefn">删除</el-button>
                </el-form-item>
            </el-form>
            <div style="height:700px">
                <el-table border ref="multipleTable" :data="TaskData" @selection-change="selectionChange" stripe
                    :header-cell-style="{ background: '#6E96E9', textAlign: 'center' }">
                    <el-table-column align="center" type="selection" width="42">
                    </el-table-column>
                    <el-table-column label="一级指标" align="center" width="200" prop='firstIndex'>
                    </el-table-column>
                    <el-table-column label="二级指标" align="center" width="200" prop='secondIndex'>
                    </el-table-column>
                    <el-table-column label="三级指标" align="center" width="200" prop='thirdIndex'>
                    </el-table-column>
                     <el-table-column label="机构" align="center" prop='orgName'>
                    </el-table-column>
                    <el-table-column label="部门" align="center" width="180" prop='departName'>
                    </el-table-column>
                    <el-table-column label="得分" align="center" width="95" prop='score'>
                    </el-table-column>
                   
                    <el-table-column label="操作" align="center" width="180">
                        <template slot-scope="scope">
                            <el-button @click="EditTaskInfo(scope.row)" icon="el-icon-edit-outline" type="text"
                                style="color:#22C82D">修改</el-button>
                            <el-button type="text" icon="el-icon-delete" @click="DelteTaskInfo(scope.row)"
                                style="color:#E74C5E">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <footer style="float:right">
            <!-- page-size 每页显示条数  current-page当前页数  total总条数-->
            <el-pagination @size-change="sizechangefn" @current-change="getData" :current-page.sync="currentPage"
                :page-size.sync="pageSize" layout="total, prev, pager, next, jumper" :total="total" background>
            </el-pagination>
        </footer>
        <!-- 编辑弹出层 -->
        <el-dialog :visible.sync="EditDialog" :model="EditTask" >
            <h5 style="font-size:18px;color:#333333;text-align:center;font-weight:none;margin-bottom:30px">修改</h5>
             <el-form ref="EditForm" :model="EditTask">
                <el-form-item label="机构：" prop="orgId" @change="Edit_orgName()">
                    <el-select v-model="Edit_orgName" clearable  >
                        <el-option v-for="(v, k) in org_data" :key="k" :label="v.orgName" :value="v.orgName" @change="Edit_orgName">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="部门："  prop="departName">
                    <el-select v-model="Edit_departName" clearable >
                        <el-option v-for="(v, k) in depart_data" :key="k" :label="v.departName" :value="v.departName">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="止期："  prop="deadLine">
                    <el-date-picker v-model="TaskKey_deadLine" clearable type="date"  >
                    </el-date-picker>
                </el-form-item>
               
                    <el-button type="primary" @click="EditTaskFn">确定</el-button>
               
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import {formatDate} from '../../styles/filters.js'
import axios from "axios"
// import { getTaskInfo } from '../api/getTaskInfo'
export default {
    name: 'RectTaskRelease',
    data() {
        return {
            TaskKey_deadLine:"",//弹出层 编辑(修改) 日期
            Edit_orgName:'',//弹出层 机构
            Edit_departName:"",//部门
            org_data: [], // 机构
            depart_data: [], // 部门
            AddTask: {},
            TaskKey: {  // 搜索的条件
                orgId: '',
                leadDepartId: '',
                deadLine: ''
            },
            TaskData: [], // 表格数据
            pageSize: 10, // 每页条数
            total: 0, // 总条数
            currentPage: 1,   // 当前页数
            EditDialog: false,  // 是否显示添加弹出层,默认为flase
            EditTask: {},   // 编辑的表单
            Edit_Task:[],  // 点击编辑获得整行数据的数据
            SelectData: [], // 选中的数据
            SelectData_id:[],
            orgdata: [],   // 一级指标  firstIndex
            departdata: [],  // 二级指标
            QueryRules: {
                orgId: [
                ],
                leadDepartId: [
                ],
                deadLine: [
                ]
            },
               SelectData: [], // 选中的数据  table中的选框
               SelectData_draftNo: [],//选中的数据  table中的选框 draftNo的集合 发布
               SelectData_del:[],//选中的数据  table中的选框 draftNo和id的集合 多个删除
        }
    },
    methods: {
        // 将时间秒变成yyyy-MM-dd
        formatDate(time){
            var data = new Date(time);
            return formatDate(data,'yyyy-MM-dd');
        },
        // 修改
         EditTaskInfo(item) {
            this.Edit_Task = item
            console.log(item);
            this.Edit_orgName=item.orgName,
            this.Edit_departName=item.departName,
            this.TaskKey_deadLine=item.deadLine,
            this.EditDialog = true;
        },
        fn(w){ //获取对应部门名字的部门id
            for(let i=0;i<this.depart_data.length;i++){
                if(this.depart_data[i].departName===w){
                    console.log(this.depart_data[i].departId);
                    return this.depart_data[i].departId
                }
            }
        },
        fn1(w){  //获取对应机构名字的机构id
             for(let i=0;i<this.org_data.length;i++){
                if(this.org_data[i].orgName===w){
                    console.log(this.org_data[i].orgId);
                    return this.org_data[i].orgId
                }
            }
        },
        // 修改提交数据EditTaskFn() 
        EditTaskFn() { 
             let v= this.fn(this.Edit_departName);
             let w=this. fn1(this.Edit_orgName);
             let data= this.formatDate(this.TaskKey_deadLine);
             let str=this.Edit_Task.indexId
             let str1=this.Edit_Task.departId
              console.log();
            //  if(){}
             axios.post("http://101.201.29.183:3500/task/defineIndexSave",{
                  userCode:"opt998",
                  deadLine:data,
                  draftNo:this.$route.query.draftNo,
                  oldOrgId:this.Edit_Task.orgId,
                  oldDepartIds:[str1],
                  indexIds:[str],
                  orgId:w,
                  departIds:[v]
             }).then(res=>{
                 console.log(res);
                 this.getData()
                 this.EditDialog = false;
             })         
        },
        changeValue(v){
             axios.post('http://101.201.29.183:3500/task/indexSelect',
               { indexName: v,indexLevel: "2"}
             ).then(res=>{
                this.departdata=res.data.data;
        })
        },
        // 获取一级标题
        headline(){
            axios.post('http://101.201.29.183:3500/task/indexSelect',
               { indexName: "",indexLevel: "1"}
            ).then(res=>{
                this.orgdata=res.data.data;
            })
        },
        //获取数据
        getData() {
            axios.post(`http://101.201.29.183:3500/task/draftIndexPage?pageNum=${this.currentPage}&pageSize=${this.pageSize}`,{
                 draftNo:this.$route.query.draftNo,
                 firstIndex:this.TaskKey.orgId,
                 secondIndex:this.TaskKey.leadDepartId,
                 thirdIndex:this.TaskKey.deadLine
            }).then(res=>{
                console.log(res.data.data);
                this.TaskData=res.data.data
                this.total = res.data.total;
            })
        },
        // 查询
        queryfn() {
           this.getData()
        },
        // 添加
         addRecttask() {
            // console.log("打印接收的路由数据", this.$route.query.draftNo);
            this.$router.push({ path:"/addRectTask",query: {draftNo:this.$route.query.draftNo}});
         },
        // 删除 
        deletefn() {
            axios.post('http://101.201.29.183:3500/task/defineIndexDelete',{
              indexIds:this.SelectData_id,userCode:"opt998"
            }).then(res=>{
                console.log(res);
                this.getData();
            })
        },
       // 删除单个提交
       DelteTaskInfo(data) {
          axios.post('http://101.201.29.183:3500/task/defineIndexDelete',{
            indexIds:[data.id],userCode:"opt998"
          }).then(res=>{
               this.getData();
          })
        },
        // 表格多选框
        selectionChange(val) {
            this.SelectData = val;
            console.log(this.SelectData);
            let str=[];
            for(var i = 0; i< this.SelectData.length; i++){
               str.push(this.SelectData[i].id);
            }
             this.SelectData_id=str;
             console.log(this.SelectData_id);
       },
        // 分页
        sizechangefn() {
            this.currentPage = 1;
            this.getData();
        },
                // 牵头部门 接口连接
     depar() {
       axios.post("http://101.201.29.183:3500/Depart/query").then((res) => {
         this.depart_data = res.data.data; //成功的回调
      });
    },
       //机构 接口连接
      organ() { 
        axios.post("http://101.201.29.183:3500/Org/query").then((res) => {
           this.org_data = res.data.data; //成功的回调
        });
      },
    },
    mounted() {
        console.log("第二页查看中的draftNo",this.$route.query.draftNo);
        this.getData();
        this.headline();
        this. depar();
        this.organ();
       
      },
    watch:{
       EditTaskorgName(val){
             this.EditTask.orgName=val
       }
    }
}
</script>

<style scoped lang="less">

.lookTask {
    text-align: left !important;
}
    // 整个上标题块 
    .titlediv {
        height: 18px;
        display: flex;
        align-items: center;
        margin: 60px 0 12px 30px;
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


.lookTask header {
    display: flex;
    justify-content: space-between;
    color: #333333;
    font-size: 18px;
    font-weight: bold;

}

::v-deep .el-form-item__label {
    width: auto !important;
    padding: 0 !important;
}

::v-deep .el-table thead {
    color: #fff;
}

.body {
    padding: 20px 0;
    margin: 0 20px;
}

::v-deep .el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell {
    background: #F0F4FD;
}

::v-deep .el-pagination .btn-prev,
::v-deep .el-pagination .btn-next {
    background: #fff;
    border: 1px solid #D7D7D7;
}

::v-deep .el-pagination.is-background .el-pager li {
    background: #fff;
    border: 1px solid #D7D7D7;
}

::v-deep .el-dialog .el-form {
    padding: 0 100px
}

::v-deep .el-dialog__header {
    height: 60px;
    background: #6E96E9;
    box-sizing: border-box;
}

::v-deep .el-dialog {
    width: 544px;
}

::v-deep .el-dialog .el-button {
    width: 400px;
    height: 50px;
    display: block;
    background: #6E96E9;
     margin: 10px 30px 15px -45px;

}

::v-deep .el-dialog__headerbtn .el-dialog__close {
    font-size: 20px;
    color: #fff
}

::v-deep .el-dialog .el-input--suffix {
    width: 224px;
    margin-right: 5px;
}
</style>