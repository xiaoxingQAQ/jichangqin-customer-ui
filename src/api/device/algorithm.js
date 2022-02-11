/*
 * @Author: :your name
 * @Date: 2021-11-25 14:30:26
 * @LastEditors: :your name
 * @LastEditTime: 2022-01-04 10:11:01
 * @Description: :file content
 */
import request from '@/utils/request'

// 查询服务器设备列表
export function listAlgorithm(query) {
  return request({
    url: '/device/algorithm/server/list',
    method: 'get',
    params: query
  })
}

// 事件算法列表
export function getAlgorithmList(params) {
  return request({
    url: '/device/algorithm/list',
    method: 'get',
    params
  })
}
