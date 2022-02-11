import Vue from 'vue'

import Cookies from 'js-cookie'

import '@/assets/css/common.css'
import Element from 'element-ui'
import './assets/styles/element-variables.scss'

// 引入iconfont
import './assets/css/iconfont.css'
// 引入高德地图
import '@/plugins/amap'
// 引入 ECharts
import echarts from '@/plugins/echarts'
Vue.prototype.$echarts = echarts
// 引入ant-design
import '@/plugins/ant-design.js'
import 'ant-design-vue/dist/antd.css'

import '@/assets/styles/index.scss' // global css
import '@/assets/styles/ruoyi.scss' // ruoyi css
import App from './App'
import store from './store'
import router from './router'
import directive from './directive' //directive
import plugins from './plugins' // plugins
import { download } from '@/utils/request'

import './assets/icons' // icon
import './permission' // permission control
import { getDicts } from "@/api/system/dict/data";
import { getConfigKey } from "@/api/system/config";
import { parseTime, resetForm, addDateRange, addDateRange2, selectDictLabel, selectDictLabels, handleTree } from "@/utils/ruoyi";
// 分页组件
import Pagination from "@/components/Pagination";
// 自定义表格工具组件
import RightToolbar from "@/components/RightToolbar"
// 富文本组件
import Editor from "@/components/Editor"
// 文件上传组件
import FileUpload from "@/components/FileUpload"
// 图片上传组件
import ImageUpload from "@/components/ImageUpload"
// 字典标签组件
import DictTag from '@/components/DictTag'
// 头部标签组件
import VueMeta from 'vue-meta'
// 字典数据组件
import DictData from '@/components/DictData'
import _ from 'lodash';
// dayjs插件
import dayjs from 'dayjs';
// 引入外部字体
import '@/fonts/css/index.css'

// 全局方法挂载
Vue.prototype.getDicts = getDicts
Vue.prototype.getConfigKey = getConfigKey
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.addDateRange2 = addDateRange2
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.selectDictLabels = selectDictLabels
Vue.prototype.download = download
Vue.prototype.handleTree = handleTree
Vue.prototype.$bus = new Vue()
Vue.prototype.$notify = Element.Notification
Vue.prototype._ = _
Vue.prototype.setEmptyStatus = function () {
  this.$nextTick(() => {
    let emptyArr = document.querySelectorAll('.el-select-dropdown__empty')
    console.log('emptyArr: ', emptyArr);
    emptyArr.forEach(item => {
      item.innerHTML = '无'
    })
  })
}
// 将cancel,挂载到vue原型上
Vue.prototype.cancel = function () {
  // 获取缓存的 请求取消标识 数组，取消所有关联的请求
  let cancelArr = window.axiosCancel;
  cancelArr = cancelArr || [];
  cancelArr.forEach((ele, index) => {
    ele.cancel("cancel")  // 在失败函数中返回这里自定义的错误信息
    delete window.axiosCancel[index]
  })
}
Vue.prototype.dayjs = dayjs;



// 全局组件挂载
Vue.component('DictTag', DictTag)
Vue.component('Pagination', Pagination)
Vue.component('RightToolbar', RightToolbar)
Vue.component('Editor', Editor)
Vue.component('FileUpload', FileUpload)
Vue.component('ImageUpload', ImageUpload)

Vue.use(directive)
Vue.use(plugins)
Vue.use(VueMeta)
DictData.install()

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
