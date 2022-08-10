<!-- 11-整改任务发布-添加 列表内容 -->
<template>
    <div class="recttask">
        <header style="overflow:hidden">
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
            <!-- <div style="margin-left:20px"> -->
               <el-form inline ref="QueryForm" :rules="this.EditRules" :model="TaskKey"  style="margin-left:20px" >
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
                    <el-input  v-model="TaskKey.dead_Line" clearable placeholder="请选择三级指标">
                    </el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" size="small" icon="el-icon-search" @click="queryfn">查询</el-button>
                  </el-form-item>
               </el-form>
            <!-- </div> -->

            <div style="height:730px">
                <el-table border ref="multipleTable" :data="AddTaskData" tooltip-effect="dark" style="width: 100%;"
                    @selection-change="selectionChange" stripe
                    :header-cell-style="{ background: '#6E96E9', textAlign: 'center' }">
                    <el-table-column align="center" type="selection" width="42">
                    </el-table-column>
                    <el-table-column label="一级指标" align="center" prop='firstIndex'>
                    </el-table-column>
                    <el-table-column label="二级指标" align="center" prop='secondIndex'>
                    </el-table-column>
                    <el-table-column label="三级指标" align="center" prop='thirdIndex'>
                    </el-table-column>
                    <el-table-column label="得分" align="center" width="125" prop='score'>
                    </el-table-column>
                </el-table>
                <el-button type="success" @click="addRecttaskk" style="margin-top: 30px;" size="small" icon="el-icon-plus">
                   添加
                </el-button>
            </div>
        </div>
        <footer style="float:right">
            <!-- page-size 每页显示条数  current-page当前页数  total总条数-->
            <el-pagination 
                @size-change="sizechangefn" 
                @current-change="getData" 
                :current-page.sync="currentPage"
                :page-size.sync="pageSize" 
                layout="total, prev, pager, next, jumper" 
                :total="total" 
                background>
            </el-pagination>
        </footer>

        <!-- 添加弹出层 -->
        <el-dialog :visible.sync="AddDialog">
            <h5 style="font-size:18px;color:#333333;text-align:center;font-weight:none;margin-bottom:30px">添加</h5>
            <el-form ref="EditForm" :model="AddTask">
                <el-form-item label="机构：" prop="orgId">
                    <el-select v-model="AddTask.orgId" clearable placeholder="请选择机构">
                        <el-option v-for="(v, k) in org_data" :key="k" :label="v.orgName" :value="v.orgId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="部门："  prop="departId">
                    <el-select v-model="AddTask.departId" clearable multiple  placeholder="请选择部门">
                        <el-option v-for="(v, k) in depart_data" :key="k" :label="v.departName" :value="v.departId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="止期：" clearable prop="deadLine">
                    <el-date-picker v-model="TaskKey.deadLine" type="date" placeholder="选择止期" value-format="timestamp">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="AddTaskFn">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import axios from "axios"
import {formatDate} from '../../styles/filters'
export default {
    name: 'addRectTask',
    data() {
        return {
            // 选中的数据  table中的选框
            SelectData: [],
            SelectData_id: [],//选中的数据  table中的选框 id的集合 发布
            // 搜索的条件
            TaskKey: {
                orgld: '',
                leadDepartld: '',
                dead_Line: ''
            },
            // 添加的数据
            AddDialog: false,
            AddTask: {},
            // 要删除的数据
            SelectData: [],
            // 表格数据
            AddTaskData: [],
            // 每页条数
            pageSize: 10,
            // 总条数
            total: 0,
            // 当前页数
            currentPage: 1,
            // 一级标题
            orgdata: [],
            // 二级标题
            departdata: [],
             // 机构
            org_data: [],
            // 部门
            depart_data: [],
            QueryRules:[],
            EditRules: {
                firstIndex: [
                ],
                secondIndex: [
                ],
                thirdIndex: [
                ],
                orgId: [
                ],
                departId: [
                ],
                score: [
                ]
            },
               SelectData: [],
               SelectData_draftNo: [],//选中的数据  table中的选框 draftNo的集合 发布
               SelectData_del:[],//选中的数据  table中的选框 draftNo和id的集合 多个删除
        }
    },
    methods: {
        changeValue(v){
            // console.log(v);
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
                // console.log(res);
                this.orgdata=res.data.data;
                // console.log("数组"+this.orgdata);
                
            })
        },
        //获取数据
        getData() {
           axios.post(`http://101.201.29.183:3500/task/defineIndexPage?pageNum=${this.currentPage}&pageSize=10`,{
                    firstIndex:this.TaskKey.orgId||'',secondIndex:this.TaskKey.leadDepartId||'',thirdIndex:this.TaskKey.dead_Line||''
           }) .then(res=>{
            this.AddTaskData=res.data.data
            this.total=res.data.total
            console.log("tatol",this.total);
           })
        },
        // 查询
        queryfn() {
            this.getData();
        },
        // 添加
        addRecttaskk() {
            this.AddDialog = true;
        },
        // 将时间秒变成yyyy-MM-dd
         formatDate(time){
            var data = new Date(time);
            return formatDate(data,'yyyy-MM-dd');
        },
        // 添加提交数据
        AddTaskFn() {
            let data= this.formatDate(this.TaskKey.deadLine);
            // console.log(data);
            axios.post("http://101.201.29.183:3500/task/defineIndexSave",{
                 userCode:"opt998",
                 deadLine:data,
                 draftNo:this.$route.query.draftNo,
                 oldOrgId:'',
                 oldDepartIds:[],
                 indexIds:this.SelectData_id,
                 orgId:this.AddTask.orgId,
                 departIds:this.AddTask.departId,
                
            }).then(res=>{
                console.log("添加数据",res);
                //  this.getData();
                if (res.data.success == true) {
                     console.log("添加成功");
                     this.$router.push({ path:'/lookTask',query: {draftNo:this.$route.query.draftNo}})

                } else {
                    this.$message.error("添加信息不能为空");
          }

            })
        },
        // 分页
        sizechangefn() {
            this.currentPage = 1;
            this.getData();
        },
        // 表格多选框
        selectionChange(val) {
            this.SelectData = val;
            console.log(val);
            let str=[];
            for(var i = 0; i< this.SelectData.length; i++){
               str.push(this.SelectData[i].id);
             }
            this.SelectData_id=str;
            // console.log(this.SelectData_id);
        },
        // 牵头部门 接口连接
     depar() {
       axios.post("http://101.201.29.183:3500/Depart/query").then((res) => {
         this.depart_data = res.data.data; //成功的回调
        //  console.log(this.departdata);
      });
    },
       //机构 接口连接
      organ() { 
        axios.post("http://101.201.29.183:3500/Org/query").then((res) => {
           this.org_data = res.data.data; //成功的回调
        //    console.log(res);
        });
      },
    },
    mounted() {
        this.getData();
        this.headline();
        this.total = this.AddTaskData.length
        this.depar(); // 牵头部门
        this.organ();//机构
        console.log("第三页的draftNo是",this.$route.query.draftNo);
    },
}
</script>

<style scoped lang="less">
.recttask {
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
.recttask header {
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
    padding: 15px 0;
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

::v-deep .el-dialog .el-input--suffix {
    width: 224px;
    margin-right: 5px;
}

::v-deep .el-dialog .el-form {
    padding: 0 50px
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
    margin: 10px auto 0;
}

::v-deep .el-dialog__headerbtn .el-dialog__close {
    font-size: 20px;
    color: #fff
}
::v-deep .el-dialog .el-input--suffix {
    width: 300px;
    margin-right: 5px;
}
</style>