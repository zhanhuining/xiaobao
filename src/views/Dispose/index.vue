<!-- 13-2-1任务发布页面-任务展示页面 -->
<!-- 整改处理 -->
<template>
  <div class="app">
    <!-- 一级标题---整改处理 -->
    <div class="shu">
      <div></div>
      <p>整改处理</p>
    </div>
    <!-- 二级标题---处理 -->
    <div class="er">
      <p>任务列表：</p>
        <el-form ref="elForm" label-width="99px" style="display: flex;margin-top: 25px;margin-left: -30px;">
            <el-form-item label="机构" prop="field103">
              <el-select v-model="organiza" clearable class="el-col-c">
                <el-option v-for="(v, k) in organization"  :key="k" :label="v.orgName" :value="v.orgId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="牵头部门" prop="field104">
              <el-select v-model="depart" clearable class="el-col-c">
                <el-option v-for="(v, k) in department"  :key="k"  :label="v.departName"  :value="v.departId"  :disabled="v.disabled"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="底稿名称 :" prop="field101">
              <el-input  v-model="manuscript"  clearable  class="el-col-c"></el-input>
            </el-form-item>

        </el-form>
        <el-button type="primary" size="small" icon="el-icon-search" @click="manage()" style="margin-left: 20px;">查询</el-button>

    </div>
    <!-- 表单 -->
    <el-table
      border
      :header-cell-style="{ background: '#6e96e9', color: '#fff' }"
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      :row-class-name="tableRowClassName"
      :row-style="getrowstyle"
    >
      <el-table-column prop="originCom" label="发起机构"></el-table-column>
      <el-table-column prop="missionName" label="任务名称"> </el-table-column>
      <el-table-column prop="leadDepartment" label="牵头部门"></el-table-column>
      <el-table-column prop="firstIndex" label="一级指标"> </el-table-column>
      <el-table-column prop="secondIndex" label="二级指标"> </el-table-column>
      <el-table-column prop="thirdIndex" label="三级指标"> </el-table-column>
      <el-table-column  label="状态" show-overflow-tooltip >
    <template scope="scope">
        <span v-if="scope.row.missionStatus==='待审核'" style="color: #F0BB3A">待审核</span>
        <span v-else-if="scope.row.missionStatus==='驳回'" style="color: #E53E51">驳回</span>
        <span v-else-if="scope.row.missionStatus==='审核完成'"  style="color:#84BA6E">审核完成</span>
    </template>
      </el-table-column>
      <el-table-column prop="deadLine" label="止期" show-overflow-tooltip></el-table-column>
      <el-table-column prop="indexId" label="处理" show-overflow-tooltip width="100px">
        <template v-slot="scope">
          <!-- {{ scope.row.indexId }} -->
          <el-button type="text" icon="el-icon-edit-outline" @click="chuli(scope.row.indexId)" style="color:#53d059">
             处理
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页 -->
    <div class="pagination-block" >
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="page"
        :page-size="10"
        layout="total ,prev, pager, next, jumper"
        :total="total"
         background
      >
      </el-pagination>
    </div>
            <!-- 编辑弹出层 -->
        <el-dialog :visible.sync="EditDialog">
            <h5 style="font-size:18px;color:#333333;text-align:center;font-weight:none;margin-bottom:30px">整改处理列表</h5>
                <p style="margin-left: -700px;">已选指标列表</p>
              <el-form ref="EditForm" label-width="80px">
                <el-form-item label="一级指标 :">
                        <el-input readonly :value="firstIndex"></el-input>
                </el-form-item>
                <el-form-item label="二级指标 :">
                        <el-input :value="secondIndex" readonly ></el-input>
                </el-form-item>
                <el-form-item label="三级指标 :">
                        <el-input :value="thirdIndex" readonly></el-input>
                </el-form-item>
                 <el-form-item :label="'分' + '\xa0\xa0\xa0\xa0\xa0\xa0' + '数 :'" prop="score" >
                        <el-input v-model="score" clearable style="width: 224px;margin-left: -500px;" ></el-input>
                        <span>&nbsp;分</span>
                </el-form-item>
                <el-form-item size="large" :label="'资' + '\xa0\xa0\xa0\xa0\xa0\xa0' + '料 :'"
                      >
                    <!-- 上传按钮 -->
                      <div class="up">
                        <div class="one">
                          <el-upload
                            class="upload-demo"
                            action="http://101.201.29.183:3500/file/upload"
                            :on-success="handleSuccess"
                            :before-remove="beforeRemove"
                             multiple
                            :limit="3"
                            :file-list="fileList"
                            :data="multipartFile"
                            :show-file-list="false" >
                            <el-button
                                style="width: 136px;height: 42px;background: #6e96e9;border-radius: 3px;"
                                size="small"
                                type="primary">
                                上传
                            </el-button>
                          </el-upload>
                        </div>
                        <div class="one">
                          <el-button  type="primary" @click="download()"  style="width: 136px;height: 42px;background: #6e96e9;border-radius: 3px;">
                             下载
                          </el-button>
                        </div>
                        <div class="one">
                          <el-button  type="primary" @click="del()"  style="width: 136px;height: 42px;background: #6e96e9;border-radius: 3px;">
                              删除
                          </el-button>
                        </div>
                       </div>
                </el-form-item>
                <el-button type="primary" @click="submit()">提交</el-button> 
            </el-form>
        </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      draftNo:'',//存放从任务处理底稿中得到的draftNo值
      fileName:'',//点击下载,获得下载文件名
      total: 0, //内容总个数
      organization: [], //机构数组
      organiza: "", //机构数组中的值--id
      department: [], //牵头部门
      depart: "", //牵头部门的值--id
      manuscript: "", //存放底稿的值
      EditDialog: false, // 遮罩层
      tableData: [], //表格数据 数组
      multipleSelection: [],
      page: 1, //当前第几页
      pageSize: 10, //一页的数据
      val: "", //获取的处理按钮的id
      firstIndex: "", //一级指标
      secondIndex: "", //二级
      thirdIndex: "", //三级
      score: 0, //分数
      businessNo:'', //文件上传存储号
      // indexId号
      indexId: "",
      // 点击处理时获取到的止期
      deadLine: "",
      bool: false,// 遮罩层值
      rules: {
        score: [],
      },
      indexid: "", //页面查询里面的指标编码
      // downloadUrl:'',//下载时给的路径
      // 上传文件相关数据
      fileList: [],
      // multipartFile: {file: '上传测试', fileType: 2, modifyCode: '123456' },
      multipartFile: {
          file: "this.fileList.name",
          fileType: 2,
          modifyCode: "123456",
      },
    };
  },
  computed: {},
  watch: {},
  created() {
    // console.log("整改处理接收的draftNo", this.$route.query.draftNo);
     this.draftNo=this.$route.query.draftNo
    // console.log(this.draftNo);
    axios.post("http://101.201.29.183:3500/deal/pageInfo?pageNum=1&pageSize=10",
        //{参数}
        { orgId: "", leadDepartId: '', draftName: "" ,departId:'',draftNo:this.draftNo}
      )
      .then((res) => {
        //成功的回调
        this.tableData = res.data.data;
        this.total = res.data.total;
      });
    this.organ(); //调用机构 进入页面
    this.depar(); //调用牵头部门 进入页面
  },
  mounted() {},
  methods: {
      // 把超时的任务字体修改为红色
      getrowstyle({ row }) {
        if (row.missionStatus == "超时") {
          return { color: "#ED5B6C" };
        }
        },
      // 更新接口函数
      update (v){
        axios.post("http://101.201.29.183:3500/deal/updateScore", 
              { indexId:this.val, modifyCode:"123456",score:this.score,businessNo:v} 
         ).then((res) => {
            console.log("处理页面的更新接口",res);
          });
      },
     // 上传文件相关方法
      handleSuccess(file, fileList) {
        console.log(file);
        console.log(fileList);
        this.businessNo = file.data.businessNo;
        console.log("打印存储号", this.businessNo);
        console.log("上传成功的数据", file, fileList.name);
        if(file.success){
          alert("上传成功")
          this.update(this.businessNo);
        }
        else{
          alert("上传不成功,需要重新上传")
        }
        },
     //上传功能
      handleExceed(files, fileList) {
        // this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
            return this.$confirm(`确定移除 ${file.name}？`);
      },
     // 下载按钮
      download() { 
        console.log("下载");
      axios.post("http://101.201.29.183:3500/file/download",
           { businessNo: this.businessNo }, //{参数}
        ).then((res) => {
            // 不能得到文件名
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
                }
                else{
                  alert("没有文件可以下载")
                }
        });
      },
     // 删除按钮
      del() {
        console.log("删除按钮");
        axios.post("http://101.201.29.183:3500/file/delete",
            { indexId:this.val, modifyCode:"123456",businessNo:this.businessNo } //{参数}
          ).then((res) => {
            console.log(res);
            console.log(this.businessNo);
            console.log(res.data.success);
             if(res.data.success){
                this.businessNo=''
                this.update(this.businessNo);
                alert("删除成功")
             }
             else{
              alert("删除失败,没有可删除的文件")
             }
           
        });
      },
      // 提交按钮
      submit() { 
        console.log("提交按钮");
        axios.post("http://101.201.29.183:3500/deal/updateScore", 
                   { indexId:this.val, 
                   modifyCode:"123456",
                   score:this.score,
                   businessNo:this.businessNo} 
          ).then((res) => {
             console.log(res);
             this.EditDialog=false
        });
      },
      //点击处理
      chuli(v) { 
        this.val = v; //通过点击处理,获取行的indexId
        this.EditDialog = true;
         axios.post("http://101.201.29.183:3500/deal/detail",{ indexId: this.val } //{参数}
            ).then((res) => {
             //成功的回调
              this.firstIndex = res.data.data.firstIndex;
              this.secondIndex = res.data.data.secondIndex;
              this.thirdIndex = res.data.data.thirdIndex;
              this.score = res.data.data.score;
              this.businessNo = res.data.data.businessNo;
          });
      },
      //机构 接口连接
      organ() { 
        axios.post("http://101.201.29.183:3500/Org/query").then((res) => {
           this.organization = res.data.data; //成功的回调
        });
      },
      //牵头部门 接口连接
      depar() { 
         axios.post("http://101.201.29.183:3500/Depart/query").then((res) => {
           this.department = res.data.data; //成功的回调
         });
      },
      //封装的接口
      fn() { 
         axios.post("http://101.201.29.183:3500/deal/pageInfo?pageNum=" +this.page +"&pageSize=" +this.pageSize, 
           {orgId: this.organiza,leadDepartId: this.depart,draftName: this.manuscript,departId:'',draftNo:this.draftNo}
           ).then((res) => {
            this.tableData = res.data.data;
            this.total = res.data.total;
            this.indexid = res.data.data.indexId;
         });
      },
      //查询按钮
      manage() {
        console.log("查询按钮");
        axios.post("http://101.201.29.183:3500/deal/pageInfo?pageNum=1&pageSize=10",
                  {orgId: this.organiza,leadDepartId: this.depart,draftName: this.manuscript,draftNo:this.draftNo}
          ).then((res) => {
            //成功的回调
             this.tableData = res.data.data;
             this.total = res.data.total;
        });
      },
      // 分页
      handleCurrentChange(v) {
        this.page = v;
        this.fn();
      },
      //选取变颜色的行
      tableRowClassName({ row, rowIndex }) { 
        if (rowIndex % 2 === 1) {
           return "warning-row";
        }
        return "";
       },
   },
};
</script>
<style lang="less"  scoped>
.up{  //上传按钮
      display: flex;
      .one{
        margin-right: 20px;
      }
  } 
tr .el-table__cell div {
  text-align: center;
}
/* 表格的位置 */
.el-table {
    border-radius: 4px 4px 0px 0px;
    // margin: 0 0 20px 38px;
    margin: 0 20px;
   .wen{
    color: #22c82d;
   }
}
.el-table .warning-row {
   background: #f0f4fd;
}
/* 第一行  整改处理样式 */
.shu {
  line-height: 17px;
  width: 89px;
  font-weight: 700;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 30px;
  margin-top: 60px;
  margin-bottom: 29px;
  p {
    width: 73px;
    height: 17px;
    line-height: 17px;
    font-family: Source Han Sans CN;
    margin: 0;
  }
  div {
    width: 4px;
    height: 16px;
    background: #6e96e9;
  }
}
p {
  color: #333333;
  font-weight: 400;
  font-size: 18px;
}
//  二级 处理按钮
.er {
  width: 1300px;
  height: 36px;
  display: flex;
  align-items: center;
  margin-left: 45px;
  margin-bottom: 31px;
  p {
    width: 90px;
    height: 18px;
    font-family: Source Han Sans CN;
  }
}
.el-col-c {
  //多选框和输入框的css样式
  width: 243px;
  border-radius: 4px;
}
// 分页
.block {
  margin-left: 880px;
  .el-pagination {
     .el-pagination__total {
        margin-top: 6px;
      }
     .el-pagination__jump {
        margin-top: 6px;
      }
     .btn-prev {
       width: 40px;
       height: 40px;
       border: 1px solid #d7d7d7;
       border-radius: 4px;
     }
     .btn-next {
       width: 40px;
       height: 40px;
       border: 1px solid #d7d7d7;
       border-radius: 4px;
     }
    .el-pager {
      .number {
        width: 40px;
        height: 40px;
        border: 1px solid #d7d7d7;
        border-radius: 4px;
        margin-left: 10px;
        line-height: 40px;
      }
      :last-child {
        margin-right: 10px;
      }
    }
  }
}

.el-table__cell {
  margin: 0px;
  padding: 0px;
  height: 57px;
}
.el-table__row {
  height: 57px;
}

.el-upload{
  width: 136px;
  height: 42px;
  background: #6E96E9;
  border-radius: 3px;
}
// 遮罩层
::v-deep .el-dialog {
    width: 1104px;
    margin: 200px auto;
}
::v-deep .el-dialog .el-input--suffix {
    width: 224px;
    margin-right: 5px;
}
// ::v-deep .el-dialog .el-input--suffix {
//     width: 100px;
//     margin-right: 5px;
// }
::v-deep .el-dialog .el-form {
    padding: 0 115px
}

::v-deep .el-dialog__header {
    height: 60px;
    background: #6E96E9;
    box-sizing: border-box;
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