import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'

/* 引入vant ui(全部引入)*/ 
import Vant from 'vant';
import 'vant/lib/index.css';
Vue.use(Vant);
Vue.config.productionTip = false
/* 引入vant ui(全部引入)*/ 

/* 修改 element ui 自带的文字内容 */
import Element from 'element-ui'
// import './'
import zhLang from 'element-ui/lib/locale/lang/zh-CN'  //引入官方的中文国际化
import locale from './assets/locale/cn'  //引入自己的
Vue.use(Element,{
  locale:{...zhLang, ...locale}  //使用本地的locale去覆盖官方的 zhLong
})
/* 修改 element ui 自带的文字内容 */

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
