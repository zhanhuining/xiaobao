import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    draftNo:'' ,//数据11-整改任务发布的draftNo
    tableData: [],
  },
  getters: {

  },
  mutations: {//同步触发
    updateData(state,data){
      state.draftNo = data
    },
    changeTable(state, val) {
      state.tableData = val;
    },
  },
  actions: {
  },
  modules: {
  }
})
