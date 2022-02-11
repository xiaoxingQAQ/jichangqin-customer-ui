/*
 * @Author: :your name
 * @Date: 2021-12-01 15:22:54
 * @LastEditors: :your name
 * @LastEditTime: 2021-12-30 11:00:02
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
// 绑定服务器
export function listBindServer(query){
  return request({
    url: '/device/algorithm/server/list/bind',
    method: 'get',
    params: query
  })
}

// 保存算法服务器
export function saveServer(data){
  return request({
    url: '/device/algorithm/server/save',
    method: 'post',
    data
  })
}

// 保存算法服务器
export function delServer(ids){
  return request({
    url: `/device/algorithm/server/${ids}`,
    method: 'post',
  })
}
