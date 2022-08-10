import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue'),
    children:[
      {  //整改处理  明细首页
        path: '/dispose',  
        name: 'dispose',
        component: () => import(/* webpackChunkName: "dispose" */ '../views/Dispose/index.vue')
      },
      { //整改处理  明细
        path: '/disposelist',
        name: 'disposelist',
        component: () => import(/* webpackChunkName: "dispose" */ '../views/Dispose/Dispose.vue')
      },
      {
        path: '/rectTaskRelease',
        name: 'rectTaskRelease',
        component: () => import(/* webpackChunkName: "rectTaskRelease" */ '../views/TaskAnnouncement/RectTaskRelease.vue')
      },
      {
        path: '/lookTask',
        name: 'lookTask',
        component: () => import(/* webpackChunkName: "lookTask" */ '../views/TaskAnnouncement/lookTask.vue')
      },{
        path: '/addRectTask',
        name: 'addRectTask',
        component: () => import(/* webpackChunkName: "addRectTask" */ '../views/TaskAnnouncement/addRectTask.vue')
      },
      {
        path: '/tasklist',
        name: 'tasklist',
        component: () => import(/* webpackChunkName: "tasklist" */ '../views/Audit/Tasklist.vue')
      },
      {
        path: '/duditlist',
        name: 'duditlist',
        component: () => import(/* webpackChunkName: "duditlist" */ '../views/Dudit/Duditlist.vue') 
      },
      {
        path: '/duditTwo',
        name: 'duditTwo',
        component: () => import(/* webpackChunkName: "duditTwo" */ '../views/Dudit/DuditTwo.vue') 
      },
      {
         path: "/taskOne", 
         name: 'taskOne', 
         component: () => import(/* webpackChunkName: "taskOne" */ '../views/Taskrectification/TaskOne.vue')
      },
      { 
        path: "/taskTwo", 
        name: 'taskTwo',
        component: () => import(/* webpackChunkName: "taskTwo" */ '../views/Audit/TaskTwo.vue') 
      },
      { 
        path: "/taskDetail",
        name: 'taskDetail',
        component: () => import(/* webpackChunkName: "taskDetail" */ '../views/Taskrectification/TaskDetail.vue') 
      },
    ]
  },
  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
