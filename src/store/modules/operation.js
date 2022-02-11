/*
 * @Author: :luck
 * @Date: 2021-12-30 09:40:13
 * @LastEditors: :your name
 * @LastEditTime: 2021-12-30 09:54:02
 * @Description: :file content
 */
const operation = {
  namespaced: true,
  state: {
    deptId: null,
  },
  mutations: {
    SET_ORGID(state, id) {
      state.deptId = id;
    },
  },
  actions: {},
  getters: {},
}

export default operation