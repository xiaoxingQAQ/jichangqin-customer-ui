/*
 * @Author: :luck
 * @Date: 2021-11-05 14:34:45
 * @LastEditors: :your name
 * @LastEditTime: 2021-12-30 09:50:39
 * @Description: :file content
 */
import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import tagsView from './modules/tagsView'
import permission from './modules/permission'
import settings from './modules/settings'
import operation from './modules/operation'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    tagsView,
    permission,
    settings,
    operation
  },
  getters
})

export default store
