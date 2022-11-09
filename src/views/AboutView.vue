<!-- 主页面   11  -->
<template>
  <div class="about">
      <el-container>
        <el-header style="height:119px;width:1920">Header</el-header>
        <el-container id="el-container">
          <!-- 侧边栏   添加组件 -->
          <el-aside width="260px">
             <Aside></Aside>
          </el-aside>
          <!-- <div class="el-main" >
             
          </div> -->
          <el-main  width="1620px">
             <!-- 引入路由 -->
              <router-view></router-view>
          </el-main> 
        </el-container>
      </el-container> 
  </div>
</template>

<script>
  import Aside from  "@/components/Asides.vue"
  export default {
    components:{
           Aside
    },
    methods: {
      
    }
  }
</script>
<style>

 body{
    background-color: #fafafb;
 }
  .el-header {
    color: #333;
    text-align: center;
    line-height: 119px;
    /* width: 1920px; */
    height: 119px;
    background: #6E96E9;
  }
  #el-container{
    /* width: 1920px; */
  }

  .el-aside {
    background-color: #Fff;
    color: #333;
    text-align: center;
    line-height: 200px;
     width: 260px; 
     /* height: 961px;  */
  }
  
  .el-main {
    /* height: 904px; */
    padding: 0;
    background-color: #Fff;
    color: #333;
    margin-left:18px ;
    margin-top:20px;
    margin-right: 20px;
    border-radius: 8px;
  }
  
  body > .el-container {
    margin-bottom: 40px;
  }
  
  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }
  
  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
</style>