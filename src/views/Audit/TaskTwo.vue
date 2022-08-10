// 整改情况报备
<template>
    <div class="recttask">
        <div class="titlediv">
          <span class="blockspan" style="margin-right: 10px"></span>
          <span class="titlespan">整改审核</span>
        </div>
        <div class="body">
            <el-form
                class="form_left"
                inline
                ref="FilingFrom"
                :rules="this.FilingRules"
                :model="FilingKey">
                <el-form-item>
                    <span style="font-size: 18px"> 任务列表：</span>
                </el-form-item>
                <el-form-item label="机构：" prop="orgId">
                    <el-select
                        v-model="FilingKey.orgId"
                        clearable
                        placeholder="请选择机构">
                        <el-option
                            v-for="(v, k) in orgdata"
                            :key="k"
                            :label="v.orgName"
                            :value="v.orgId"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="牵头部门：" prop="leadDepartId">
                    <el-select
                        v-model="FilingKey.departId"
                        clearable
                        placeholder="请选择活动部门">
                        <el-option
                            v-for="(v, k) in departdata"
                            :key="k"
                            :label="v.departName"
                            :value="v.departId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="底稿名称：" prop="draftName">
                    <el-input
                        v-model="FilingKey.draftName"
                        clearable
                        placeholder="请填写底稿名称">
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button
                        type="primary"
                        size="small"
                        icon="el-icon-search"
                        @click="queryfn"
                        >查询</el-button>
                </el-form-item>
            </el-form>
            <div style="height: 700px">
                <el-table
                    border
                    ref="multipleTable"
                    :data="TaskData"
                    @selection-change="selectionChange"
                    stripe
                    :header-cell-style="{
                        background: '#6E96E9',
                        textAlign: 'center',
                    }"
                    :row-style="getrowstyle">
                    <el-table-column align="center" type="selection" width="42">
                    </el-table-column>
                    <el-table-column
                        label="发起机构"
                        align="center"
                        width="200"
                        prop="originCom">
                    </el-table-column>
                    <el-table-column
                        label="任务名称"
                        align="center"
                        width="200"
                        prop="missionName">
                    </el-table-column>
                    <el-table-column
                        label="牵头部门"
                        align="center"
                        width="200"
                        prop="leadDepartment">
                    </el-table-column>
                    <el-table-column
                        label="一级指标"
                        align="center"
                        width="200"
                        prop="firstIndex">
                    </el-table-column>
                    <el-table-column
                        label="二级指标"
                        align="center"
                        width="200"
                        prop="secondIndex">
                    </el-table-column>
                    <el-table-column
                        label="三级指标"
                        align="center"
                        width="200"
                        prop="thirdIndex">
                    </el-table-column>
                    <el-table-column
                        label="状态"
                        sortable
                        align="center"
                        width="95"
                        prop="missionStatus">
                        <template slot-scope="scope">
                            <span
                                v-if="scope.row.missionStatus == '审核完成'"
                                style="color: #84ba6e"
                                >{{ scope.row.missionStatus }}</span>
                            <span
                                v-if="scope.row.missionStatus == '待审核'"
                                style="color: #f0bb3a"
                                >{{ scope.row.missionStatus }}</span>
                            <span
                                v-if="scope.row.missionStatus == '超时'"
                                style="color: #ed5b6c"
                                >{{ scope.row.missionStatus }}</span>
                            <span
                                v-if="scope.row.missionStatus == '驳回'"
                                style="color: #ed5b6c"
                                >{{ scope.row.missionStatus }}</span>
                            <span
                                v-if="scope.row.missionStatus == '即将到期'"
                                style="color: #ed5b6c"
                                >{{ scope.row.missionStatus }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="止期"
                        align="center"
                        prop="deadLine"
                    >
                    </el-table-column>

                    <el-table-column label="处理" align="center" width="180">
                        <template slot-scope="scope">
                            <el-button
                                @click="HandleTaskInfo(scope.row)"
                                icon="el-icon-edit-outline"
                                type="text"
                                style="color: #22c82d"
                                >处理</el-button>
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
                background >
            </el-pagination>
        </footer>
        <!-- 处理弹出层 -->
        <el-dialog :visible.sync="HandleDialog">
            <h5
                style="
                    font-size: 18px;
                    color: #333333;
                    text-align: center;
                    font-weight: none;
                    margin-bottom: 30px;">
                整改审核列表
            </h5>
            <el-form
                ref="EditForm"
                :model="HandleTask"
                label-width="80px"
                :rules="this.$store.state.EditRules">
                <input
                    type="hidden"
                    name="indexId"
                    v-model="HandleTask.indexId"/>
                <el-form-item label="一级指标：" prop="firstIndex">
                    <el-input v-model="HandleTask.firstIndex"></el-input>
                </el-form-item>
                <el-form-item label="二级指标：" prop="secondIndex">
                    <el-input v-model="HandleTask.secondIndex"></el-input>
                </el-form-item>
                <el-form-item label="三级指标：" prop="thirdIndex">
                    <el-input v-model="HandleTask.thirdIndex"></el-input>
                </el-form-item>
                <el-form-item label="分数：" prop="score">
                    <el-input
                        v-model="HandleTask.score"
                        style="width: 224px; margin-right: 5px">
                    </el-input>
                    <span>分</span>
                </el-form-item>
                <el-form-item label="资料：">
                    <!-- 上传按钮 -->
                    <el-upload
                        class="upload-demo inline-block"
                        action="http://101.201.29.183:3500/file/upload"
                        :on-success="handleSuccess"
                        :before-remove="beforeRemove"
                        multiple
                        :file-list="fileList"
                        :data="multipartFile"
                        :show-file-list="false">
                        <el-button
                            style="
                                width: 136px;
                                height: 42px;
                                background: #6e96e9;
                                border-radius: 3px;
                            "
                            size="small"
                            type="primary"
                            >点击上传</el-button>
                    </el-upload>
                    <el-button
                        type="primary"
                        style="
                            width: 136px;
                            height: 42px;
                            background: #6e96e9;
                            border-radius: 3px;
                            margin-left: 20px;
                        "
                        @click="onDownload"
                        >下载</el-button>
                    <el-button
                        type="primary"
                        style="
                            width: 136px;
                            height: 42px;
                            background: #6e96e9;
                            border-radius: 3px;
                            margin-left: 20px;
                        "
                        @click="onDelete"
                        >删除</el-button>
                </el-form-item>
                <el-form-item label="超时调整：">
                    <el-date-picker
                        v-model="HandleTask.endDate"
                        type="date"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期">
                    </el-date-picker>
                    <span style="color: #ed5b6c; margin-left: 5px"
                        >*该日期为最终截止日</span>
                </el-form-item>
                <el-form-item>
                    <el-button
                        style="
                            width: 308px;
                            height: 50px;
                            background: #ed5b6c;
                            margin: 10px 50px 0 10px;
                        "
                        type="danger"
                        @click="backtrack"
                        >返回</el-button>
                    <el-button
                        style="
                            width: 308px;
                            height: 50px;
                            background: #6e96e9;
                            margin: 10px 10px 0 50px;
                        "
                        type="primary"
                        @click="HandleTaskFn"
                        >确定修改</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import axios from "axios";
export default {
    name: "TaskTwo",
    data() {
        return {
            itme:{},
            // 搜索的条件
            FilingKey: {
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
            // 选中的数据
            SelectData: [],
            //控制处理
            HandleDialog: false,
            // 编辑得数据
            HandleTask: {},
            // 状态的style
            // 机构
            orgdata: [],
            // 部门
            departdata: [],
            FilingRules: {
                orgId: [
                ],
                leadDepartId: [
                ],
                draftName: [
                ],
            },
            // 上传文件相关数据
            fileList: [],
            multipartFile: {
                file: "this.fileList.name",
                fileType: 2,
                modifyCode: "111",
            },
            // 文件存储号
            businessNo: "",
            // indexId号
            indexId: "",
            // 点击处理时获取到的止期
            deadLine: "",
            departId:'',//机构id
              firstIndex:"",
        };
    },
     created(){
        this.initInput()
     },
    methods: {
        // 点击返回   
        backtrack(){
            // 驳回暂时只有第一条好使
            axios.post("http://101.201.29.183:3500/activiti/reject",{
                draftNo:this.itme.draftNo,  
                orgId:"", 
                departId:'opr861201',
                missionId:"_4",
                draftName:this.itme.missionName,
                indexId:this.itme.indexId
            }).then(res=>{
                console.log(res);
                if(res.data.success){
                    alert(res.data.message)
                }
            })
              this.HandleDialog = false
        },
       //表单数据的获取  
        getData(){
            axios.post(`http://101.201.29.183:3500/RectAudit/getRecords?pageNum=${this.currentPage}&pageSize=${this.pageSize}`,{
                draftNo:this.$route.query.draftNo, 
                draftName:'',
                orgId:'',
                orgName:'',
                departId:'',
                departName:''
            }).then(res=>{
                // console.log("整改审核明细数据",res);
                    if (res.data.success == true) {
                        for (let i = 0; i < res.data.data.length; i++) {
                            const value = res.data.data[i];
                            if (value.days === -1) {
                                if (value.missionStatus == "审核完成") {
                                    value.missionStatus = "审核完成";
                                } else {
                                    value.missionStatus = "超时";
                                }
                            }
                        }
                        this.TaskData = res.data.data;
                        this.total = res.data.total;
                        // console.log("整改审核明细数据", this.TaskData);

                    } else {
                        this.$message.error(res.data.msg);
                    }
            })
          
        },
        // 查询
       queryfn() {
           console.log("查询");
            console.log("明细页面接收数据",this.$route.query.draftNo)
             axios.post(`http://101.201.29.183:3500/RectAudit/getRecords?pageNum=${this.currentPage}&pageSize=${this.pageSize}`,{
                draftNo:this.$route.query.draftNo, 
                draftName:this.FilingKey.draftName,
                orgId:this.FilingKey.orgId,
                orgName:'',
                departId:this.FilingKey.departId,
                departName:''
            }).then(res=>{
                console.log("整改查询",res);
                    if (res.data.success == true) {
                        for (let i = 0; i < res.data.data.length; i++) {
                            const value = res.data.data[i];
                            if (value.days === -1) {
                                if (value.missionStatus == "审核完成") {
                                    value.missionStatus = "审核完成";
                                } else {
                                    value.missionStatus = "超时";
                                }
                            }
                        }
                        this.TaskData = res.data.data;
                        this.total = res.data.total;
                    } else {
                        this.$message.error(res.data.msg);
                    }
            })
        },
        // 处理
        HandleTaskInfo(item) {
            // console.log("得到的item",item);
            this.indexId = item.indexId;;
            this.itme=item;
            this.departId=item.departId;
            // console.log("打印indexId", item.indexId);
            // console.log("明细页面接收数据",this.$route.query.draftNo)
            // console.log("部门id",item.departId);
            axios.post(`http://101.201.29.183:3500/RectAudit/getAuditDetail`,{

                        indexId:  item.indexId,
                        // draftNo: this.$route.query.draftNo,
                        draftNo:"202272904",
                        // departId:item.departId,
                        departId:'opr861204',
                    }).then((res) => {
                    console.log("查询详情数据111111111111111", res);
                    if (res.data.success == true) {
                        // console.log();
                        if(res.data.data){
                           this.HandleTask.firstIndex=res.data.data.firstIndex
                           this.HandleTask.secondIndex=res.data.data.secondIndex
                           this.HandleTask.thirdIndex=res.data.data.thirdIndex
                           this.HandleTask.score=res.data.data.score
                           this.HandleTask = res.data.data;
                        }

                        // console.log(this.businessNo);
                    } else {
                        this.$message.error("请求失败");
                    }
                });
            this.HandleTask = item;
            this.HandleDialog = true;

        },
        // 编辑提交  确认修改
        HandleTaskFn() {
            // 发送post请求修改数据
            console.log("itme11111",this.itme);
            this.$refs.EditForm.validate((valid) => {
                if (valid) {
                    axios.post( `http://101.201.29.183:3500//RectAudit/updateAuditDetail`,
                            {
                                indexId: this.indexId,
                                businessNo: this.businessNo,
                                score:this.HandleTask.score,
                                modifyCode: "111",
                                modifyTime:"",
                                endDate:this.HandleTask.endDate,
                            }
                        )
                        .then((res) => {
                            console.log("修改列表",res);
                            if (res.data.success == true) {
                                this.HandleDialog = false;
                                this.getData();
                            } else {
                                this.$message.error(res.data.message);
                            }
                        });
                } else {
                    return false;
                }
            });
        },
        // 表格多选框
        selectionChange(val) {
            this.SelectData = val;
            console.log(val);
        },
        // 分页
        sizechangefn(val) {
            this.currentPage = val;
            this.getData();
        },
        // 把超时的任务字体修改为红色
        getrowstyle({ row }) {
            if (row.missionStatus == "超时") {
                return { color: "#ED5B6C" };
            }
        },
        //
        onSubmit() {},
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
        beforeRemove(file, fileList) {
            return this.$confirm(`确定移除 ${file.name}？`);
        },
        // 下载方法
        onDownload() {
            console.log("下载");
            axios({
                url: "http://101.201.29.183:3500/file/download",
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                data: JSON.stringify({ businessNo: this.businessNo }),
            }).then((res) => {
                console.log(44444, res);
                if (res.data.success == true) {
                    console.log("下载数据", res.data);
                    let downLoadUrl = res.data.data.downloadUrl;
                    if (downLoadUrl) {
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
                }else{
                    alert("没有可以下载的")
                }
            });
        },
        // 删除方法（暂时不生效）
        onDelete() {
            console.log("删除");
            console.log("删除方法参数", this.businessNo, this.indexId);
            axios.post(
                 "http://101.201.29.183:3500/file/delete",
                {
                    indexId: this.val,
                    businessNo: this.businessNo,
                    modifyCode: "111",
                },
            ).then((res) => {
                console.log("删除数据", res);
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
                    this.orgdata = res.data.data
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
                    this. departdata = res.data.data
                }
            })
        },
    },
    mounted() {
        this.getData();
    },
    // watch:{
    //     HandleTaskInfo(item) {
    //         console.log("得到的item",item);
    //         this.indexId = item.indexId;
    //         // this.deadLine = item.deadLine;
    //         this.departId=item.departId
    //         console.log("打印indexId", item.indexId);
    //         console.log("明细页面接收数据",this.$route.query.draftNo)
    //         // console.log("部门id",item.leadDepartment);
    //         console.log("部门id",item.departId);
    //         axios.post(`http://101.201.29.183:3500/RectAudit/getAuditDetail`,{
    //                     indexId:  item.indexId,
    //                     // draftNo: this.$route.query.draftNo,
    //                     draftNo:"202272904",
    //                     departId:item.departId,
    //                 }).then((res) => {
    //                 console.log("查询详情数据", res);
    //                 if (res.data.success == true) {
    //                     this.HandleTask.firstIndex=res.data.data.firstIndex
    //                     this.HandleTask.secondIndex=res.data.data.secondIndex
    //                     this.HandleTask.thirdIndex=res.data.data.thirdIndex
    //                     this.HandleTask.score=res.data.data.score
    //                     // this.HandleTask = res.data.data;
    //                     // this.businessNo = res.data.data.businessNo;
    //                 } else {
    //                     this.$message.error("请求失败");
    //                 }
    //             });
    //         this.HandleTask = item;
    //         this.HandleDialog = true;

    //     },
    // }
};
</script>

<style scoped lang="less">
    .form_left{
         margin-left: 40px;

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
.recttask {
    text-align: left !important;
}


::v-deep .el-form-item__label {
    width: auto !important;
    padding: 0 !important;
}

::v-deep .body .el-input {
    width: 197px;
    height: 36px;
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
    padding: 0 100px;
}

::v-deep .el-dialog__header {
    height: 60px;
    background: #6e96e9;
    box-sizing: border-box;
}

::v-deep .el-dialog {
    width: 1100px;
    /* height: 600px; */
}
 
::v-deep .el-table{
    margin: 0 20px;
}

::v-deep .el-dialog__headerbtn .el-dialog__close {
    font-size: 20px;
    color: #fff;
}

.tasklist {
    font-size: 18px;
}

.inline-block {
    display: inline-block;
    width: 136px;
    height: 42px;
    background: #6e96e9;
    border-radius: 3px;
}
</style>