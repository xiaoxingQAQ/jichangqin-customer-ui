/*
 * @Author: :your name
 * @Date: 2021-11-09 16:20:23
 * @LastEditors: :your name
 * @LastEditTime: 2022-01-04 14:23:33
 * @Description: :file content
 */
import request from '@/utils/request'
// 查询摄像机列表
export function listCamera(query) {
  return request({
    url: '/device/camera/list',
    method: 'get',
    params: query
  })
}

// 同步摄像机
export function syncCamera(params) {
  return request({
    url: `/device/camera/synchro`,
    method: 'get',
    params
  })
}

// 保存/修改 摄像机 添加 平面图摄像机
export function saveCamera(data) {
  return request({
    url: '/device/camera/save',
    method: 'post',
    data
  })
}

// 删除摄像机
export function deleteCamera(params) {
  return request({
    url: `/device`,
    method: 'get',
    params
  })
}