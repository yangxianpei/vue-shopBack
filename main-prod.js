import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import {dateformate}from './utils/date'
//全局样式
import './assets/css/global.css'

//引入element
// import './public/element'
Vue.config.productionTip = false

//导入样式
import './assets/fonts/iconfont.css'

//引入网格table
import ZkTable from 'vue-table-with-tree-grid'

 

//注册富文本
Vue.use(VueQuillEditor)
//注册表格
Vue.component('tree-tabel', ZkTable)
//全局过滤器
Vue.filter('dateformate',dateformate)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
