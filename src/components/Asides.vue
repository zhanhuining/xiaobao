<!-- 侧边栏---组件 -->
<template>
  <div>
    <el-col >
    <el-menu class="el-menu-vertical-demo" router unique-opened>
      <el-menu-item index="1">
        <i class="el-icon-menu"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>消保自评</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/rectTaskRelease">11-整改任务发布</el-menu-item>
          <el-menu-item index="/taskOne">12-整改任务</el-menu-item>
          <el-menu-item index="/disposelist">13-整改处理</el-menu-item>
          <el-menu-item index="/tasklist">14-整改审核</el-menu-item>
          <el-menu-item index="/duditlist">15-整改报备</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </el-col>
  </div>
</template>

<script>
  export default {
    methods: {


    }
  }
</script>

<style>

</style>