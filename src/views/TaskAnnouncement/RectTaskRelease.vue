<!-- 11-整改任务发布-首页-- -->
<template>
  <div class="recttask">
    <div class="titlediv">
          <span class="blockspan" style="margin-right: 10px"></span>
          <span class="titlespan">整改任务发布</span>
    </div>
    <div class="body" style="margin-left:20px;">
      <el-form inline ref="QueryForm" :rules="this.QueryRules" :model="TaskKey" style="margin-left:20px;" class="demo-form-inline">
        <el-form-item label="任务名称：" prop="draftName">
          <el-input v-model="TaskKey.draftName" clearable ></el-input>
        </el-form-item>
        <el-form-item label="机构：" prop="orgId">
          <el-select v-model="TaskKey.orgId" clearable >
            <el-option v-for="(v, k) in orgdata" :key="k" :label="v.orgName" :value="v.orgId"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="牵头部门：" prop="leadDepartId">
          <el-select v-model="TaskKey.departId" clearable  >
            <el-option v-for="(v, k) in departdata" :key="k" :label="v.departName" :value="v.departId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" icon="el-icon-search" @click="queryfn">
             查询
          </el-button>
          <el-button type="success" size="small" icon="el-icon-plus" @click="addRecttask">
            添加
          </el-button>
          <el-button type="warning" size="small" icon="el-icon-share" @click="releasefn">
            发布
          </el-button>
          <el-button type="danger" size="small" icon="el-icon-delete" plain @click="deletefn">
            删除
          </el-button>
        </el-form-item>
      </el-form>
      <div style="height: 700px">
        <el-table
          border
          ref="multipleTable"
          :data="TaskData"
          @selection-change="selectionChange"
          stripe
          :header-cell-style="{ background: '#6E96E9', textAlign: 'center' }">
          <el-table-column align="center" type="selection" width="42" >
          </el-table-column>
          <el-table-column label="年度" align="center" prop="year">
            <template slot-scope="scope"> {{ scope.row.year }}年度 </template>
          </el-table-column>
          <el-table-column label="发起机构" align="center" prop="orgName">
          </el-table-column>
          <el-table-column label="任务名称" align="center" prop="draftName">
          </el-table-column>
          <el-table-column label="牵头部门" align="center" prop="departName">
          </el-table-column>
          <el-table-column label="操作" align="center" width="320">
            <template slot-scope="scope">
              <el-button @click="EditTaskInfo(scope.row)" icon="el-icon-edit-outline" type="text" style="color: #22c82d">
                修改
              </el-button>
              <el-button @click="LookTaskInfo(scope.row)" icon="el-icon-search" type="text" style="color: #6e96e9">
                查看
              </el-button>
              <el-button type="text" icon="el-icon-delete" @click="DelteTaskInfo(scope.row)" style="color: #e74c5e">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <footer style="float: right">
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
    <!-- 编辑弹出层 -->
    <el-dialog :visible.sync="EditDialog">
      <h5
        style="font-size: 18px;color: #333333;text-align: center;font-weight: none;margin-bottom: 30px;">
        修改
      </h5>
      <el-form ref="EditForm" :model="EditTask">
        <el-form-item label="发起机构：" prop="orgId">
          <el-select ref ="myselect" v-model="EditTask_orgName" >
            <el-option v-for="(v, k) in orgdata" :key="k" :label="v.orgName" :value="v.orgName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="牵头部门：" prop="departId">
          <el-select ref ="mysele" v-model="EditTask_departName">
            <el-option v-for="(v, k) in departdata" :key="k" :label="v.departName" :value="v.departName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务名称：" prop="draftName">
          <el-input placeholder="请输入任务名称" suffix-icon="el-icon-edit-outline" v-model="EditTask_draftName">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="EditTaskFn" clearable>确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 添加弹出层 -->
    <el-dialog :visible.sync="AddDialog">
      <h5
        style="font-size: 18px;color: #333333;text-align: center;font-weight: none;margin-bottom: 30px;">
        添加
      </h5>
      <el-form ref="EditForm" :model="AddTask">
        <el-form-item label="发起机构：" prop="orgId">
          <el-select v-model="AddTask.orgId" placeholder="请选择机构" @change="change_Value">
            <el-option v-for="(v, k) in orgdata" :key="k" :label="v.orgName" :value="v.orgId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="牵头部门：" prop="departId">
          <el-select v-model="AddTask.leadDepartId" placeholder="请选择牵头部门" @change="changeValue">
            <el-option v-for="(v, k) in departdata" :key="k" :label="v.departName" :value="v.departId" >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务名称：" prop="draftName">
          <el-input placeholder="请输入任务名称" suffix-icon="el-icon-edit-outline" v-model="AddTask.draftName">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="AddTaskFn">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "RectTaskRelease",
  data() {
    return {
      EditTask_departName:'',//v-modle中的部门数据
      EditTask_orgName:'',//v-modle中的机构数据
      EditTask_draftName:'',//底稿名称
      leadDepartId:'',//查看中添加需要的值
        // departId牵头机构id
      // 搜索的条件(任务名称)
      TaskKey: {
        orgId: "",  
        departId: "",
        draftName: "",
      },
      // 表格数据
      TaskData: [],
      // 每页条数
      pageSize: 10,
      // 总条数
      total: 0,
      // 当前页数
      currentPage: 1,
      // 是否显示添加弹出层,默认为flase
      EditDialog: false,
      // 编辑的数据
      EditTask: {},
      Edit_Task:{},
      // 添加的数据
      AddDialog: false,
      AddTask: {},
      // 选中的数据  table中的选框
      SelectData: [],
      SelectData_draftNo: [],//选中的数据  table中的选框 draftNo的集合 发布
      SelectData_del:[],//选中的数据  table中的选框 draftNo和id的集合 多个删除

      // 机构
      orgdata: [],
      // 部门
      departdata: [],
      QueryRules: {
        orgId: [
        ],
        leadDepartId: [
        ],
        deadLine: [
        ],
      },
    };
  },
  methods: {
    //获取数据
    getData() {
      let url = `http://101.201.29.183:3500/task/draftPageInfo?pageNum=${this.currentPage}&pageSize=${this.pageSize}`;
      axios
        .post(url, {
          orgId: this.TaskKey.orgId,
          leadDepartId: this.TaskKey.departId,
          draftName: this.TaskKey.draftName,
        })
        .then((res) => {
          if (res.data.success == true) {
            this.TaskData = res.data.data;
            this.total = res.data.total;
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },
    // 查询
    queryfn() {
      this.getData();
    },
    // 添加按钮
    addRecttask() {
      this.AddDialog = true;
    },
    // 获取添加发起机构的label的值
    change_Value(value) {
      var obj = {};
      obj = this.orgdata.find((v) => {
        return v.orgId === value;
      });
      this.AddTask.orgName = obj.orgName;
    },
    // 获取添加牵头部门的label的值
    changeValue(value) {
      var obj = {};
      obj = this.departdata.find((v) => {
        return v.departId === value;
      });
      this.AddTask.departName = obj.departName;
    },
    // 添加中的提交按钮
    AddTaskFn() {
      axios
        .post("http://101.201.29.183:3500/task/draftSave", {
          id: '',
          draftNo: '',
          draftType: 2,
          userCode: "opt998",
          businessNo: '',
          orgId: this.AddTask.orgId,
          orgName: this.AddTask.orgName,
          leadDepartId: this.AddTask.leadDepartId,
          departName: this.AddTask.departName,
          draftName: this.AddTask.draftName,
        })
        .then((res) => {
        //   console.log(res);
          if (res.data.success == true) {
            console.log("添加成功");
            this.AddDialog = false;
            this.getData();
          } else {
            this.$message.error("添加信息不能为空");
          }
        });
    },
       fn(w){  //部门
            for(let i=0;i<this.departdata.length;i++){
                if(this.departdata[i].departName===w){
                    console.log(this.departdata[i].departId);
                    return this.departdata[i].departId
                }
            }
      },
      fn1(w){  //机构
        console.log(this.orgdata);
             for(let i=0;i<this.orgdata.length;i++){
                if(this.orgdata[i].orgName===w){
                    console.log(this.orgdata[i].orgId);
                    return this.orgdata[i].orgId
                }
            }
       },
    // 修改按钮
    EditTaskInfo(item) {
      this.EditDialog = true;
      this.EditTask = item;
      // console.log(item);
      axios.post('http://101.201.29.183:3500/task/draftDetailInfo',{
        id:this.EditTask.id,draftNo:this.EditTask.draftNo
      }).then(res=>{
        console.log("修改",res.data.data);  
        this.Edit_Task.id=res.data.data.id;  // "id": "自增id，新增时为空",  EditTask_orgName
        this.EditTask_orgName=res.data.data.orgName;  // "orgName": "机构名称",
        this.Edit_Task.orgId=res.data.data.orgId;     //   "orgId": "机构编码",
        this.EditTask_departName=res.data.data.departName; // "departName": "牵头部门名称",EditTask_departName
        this.Edit_Task.leadDepartId=res.data.data.leadDepartId//"leadDepartId": 牵头部门编码,
        this.EditTask_draftName=res.data.data.draftName; // "draftName": "底稿名称",
        this.Edit_Task.draftNo=res.data.data.draftNo; // "draftNo": "底稿编码",
        // console.log(this.Edit_Task);
      })
    },
    // 修改确认提交按钮
    EditTaskFn() {
       let v= this.fn(this.EditTask_departName);
       let w=this. fn1(this.EditTask_orgName);
      axios
        .post("http://101.201.29.183:3500/task/draftSave", {
          id: this.Edit_Task.id,
          draftType: 2,
          userCode: "opt998",
          businessNo: '',
          draftNo: this.Edit_Task.draftNo,
          orgId: w,  
          orgName: this.EditTask_orgName,  
          leadDepartId:v,  
          departName: this.EditTask_departName,  
          draftName: this.EditTask_draftName,  
        })
        .then((res) => {
          console.log(res);
          if (res.data.success == true) {
            console.log("修改成功",res);
            this.AddDialog = false;
            this.getData();
            this.EditDialog = false;
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },
    // 查看
    LookTaskInfo(item) {
        this.$router.push({ path:"/lookTask",query:{draftNo: item.draftNo}});
    },
    // 发布
    releasefn() {
      console.log("发布");
      axios.post("http://101.201.29.183:3500/task/draftPublish",
        {
         draftNos:this.SelectData_draftNo,
         userCode:"opt998"
       }).then(res=>{
      })
    },
    // 删除
    deletefn() {
        axios.post('http://101.201.29.183:3500/task/draftDelete',{
          draftDTOList:this.SelectData_del,userCode:"opt998"
        }).then(res=>{
            this.getData();
        })
    },
    // 删除单个提交
    DelteTaskInfo(data) {
        let obj={};
        obj.id=data.id;
        obj.draftNo=data.draftNo;
       axios.post('http://101.201.29.183:3500/task/draftDelete',{
          draftDTOList:[obj],userCode:"opt998"
        }).then(res=>{
            this.getData();
        })
    },
    // 表格多选框 
    selectionChange(val) {
      this.SelectData = val;
      let str=[];
      let str_del={};
       for(var i = 0; i< this.SelectData.length; i++){
         str.push(this.SelectData[i].draftNo);
         str_del.draftNo=this.SelectData[i].draftNo;
         str_del.id=this.SelectData[i].id;
         this.SelectData_del.push(str_del);
       }
       this.SelectData_draftNo=str;
    },
    // 分页
    sizechangefn() {
      this.currentPage = 1;
      this.getData();
    },
    // 牵头部门 接口连接
    depar() {
      axios.post("http://101.201.29.183:3500/Depart/query").then((res) => {
        this.departdata = res.data.data; //成功的回调
        // console.log(this.departdata);
      });
    },
       //机构 接口连接
      organ() { 
        axios.post("http://101.201.29.183:3500/Org/query").then((res) => {
           this.orgdata = res.data.data; //成功的回调
          //  console.log(res);
        });
      },
  },
  mounted() {
    this.depar(); // 牵头部门
    this.getData();
    this.organ();//机构
    // console.log("第一页中的draftNo",this.$store.state.draftNo);
  },
};
</script>

<style scoped lang="less">
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
    .demo-form-inline {
    // 替换输入框label字体
    /deep/.el-form-item__label {
        color: #333333;
        font-size: 16px;
    }
     // 替换查询按钮颜色
    .el-button--primary {
        width: 80px;
        height: 36px;
        background: #6e96e9;
        border-radius: 4px;
    }
    .el-button--success {
       width: 80px;
       height: 36px;
       background: #84BA6E;
       border-radius: 4px;
    }    
    .el-button--warning{
        width: 80px;
        height: 36px;
        // background: #6e96e9;
        border-radius: 4px;
    }    
    .el-button--danger{
        width: 80px;
        height: 36px;
        // background: #6e96e9;
        border-radius: 4px;
    }

}
.recttask {
  text-align: left !important;
}
.recttask header span {
  display: inline-block;
  width: 4px;
  height: 16px;
  margin-right: 5px;
  background: rgb(110, 150, 233);
}

.recttask header {
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
}

::v-deep
  .el-table--striped
  .el-table__body
  tr.el-table__row--striped
  td.el-table__cell {
  background: #f0f4fd;
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

::v-deep .el-dialog .el-form {
  padding: 0 50px;
}

::v-deep .el-dialog__header {
  height: 60px;
  background: #6e96e9;
  box-sizing: border-box;
}

::v-deep .el-dialog {
  width: 544px;
}

::v-deep .el-dialog .el-button {
  width: 400px;
  height: 50px;
  display: block;
  background: #6e96e9;
  margin: 10px auto 0;
}

::v-deep .el-dialog__headerbtn .el-dialog__close {
  font-size: 20px;
  color: #fff;
}

::v-deep .el-dialog .el-input--suffix {
  width: 300px;
  margin-right: 5px;
}
</style>