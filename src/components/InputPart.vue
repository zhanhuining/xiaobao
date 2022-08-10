// 封装可选择和搜索输入框的表单
<template>
    <el-form :inline="true" :model="formInline" class="demo-form-inline" style="padding-left: 50px;margin-left: -590px;">
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
    </el-form>
</template>

<script>
// 引入mock数据
// import "@/mock/mockServe"
import axios from "axios"
export default {
    name: "InputPart",
    data() {
        return {
            // 发起机构选项数据
            selectOneOptions: [
                {
                    orgId: "1",
                    orgName: "黄金糕",
                },  
            ],
            // 牵头部队选项数据
            selectTwoOptions: [
                {
                    departId: "2",
                    departName: "黄金糕",
                },
            ],
            // 表单信息
            formInline: {
                institution: "",
                taskName: "",
                part: "",
            },
        };
    },
    methods: {
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
               axios.post(`http://101.201.29.183:3500/RectificationTrack/query?pageNum=1&pageSize=10`,{
                orgId: this.formInline.institution,draftName:this.formInline.taskName,leadDepartId:this.formInline.part,departId:"opr861201",missionId:""
               //   orgId: " 发起机构",draftName: "任务名称",leadDepartId:"牵头部门原为departId",departId: " 登录人员所在部门新增",missionId":"工作流ID：当前可为空"
               }).then(res=>{
                console.log("查询",res)
                  if (res.data.success == true) {
                    this.$emit('queryData', res.data)
                } else {
                    this.$message.error(res.data.messge)
                }
               })
        },
    },
    created() {
        this.initInput()
    }
};
</script>

<style lang="less" scoped>
.demo-form-inline {
    // font-weight: 400;
    // 替换输入框label字体
    /deep/.el-form-item__label {
        // font-weight: 400;
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
    .el-button {
        font-weight: 400;
        padding: 0;
    }

    /deep/.el-dialog {
        margin: 323px 0 0 278px !important;
    }


}
</style>