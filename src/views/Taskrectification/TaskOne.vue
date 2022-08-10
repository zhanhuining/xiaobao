//12-1-1 整改指标确认追踪-查询页面
<template>
    <div class="taskOne-container">
        <div class="titlediv">
            <span class="blockspan" style="margin-right: 10px"></span>
            <span class="titlespan">整改任务-任务列表</span>
        </div>
        <div>
            <TablePart ref="tableRef"></TablePart>
        </div>
    </div>
</template>

<script>

// 引入表格栏
import TablePart from "../../components/TablePart.vue";
export default {
    name: "TaskOne",
    components: {
        TablePart,
    },
    methods: {
        
    },
};
</script>

<style lang="less" scoped>
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
</style>