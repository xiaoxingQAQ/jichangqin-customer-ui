/* 绩效管理的接口 */
import request from '@/utils/request'

// 查询绩效标准
export function getStandard(params) {
  return request({
    url: '/device/performance/list',
    method: 'get',
    params
  })
}

// 添加
export function addStandard(data) {
  return request({
    url: '/device/performance/saves',
    method: 'post',
    data
  })
}

// 删除
export function delStandard(data) {
  return request({
    url: '/device/performance/deletes',
    method: 'post',
    data
  })
}
