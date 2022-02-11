/*
 * @Author: :luck
 * @Date: 2021-12-30 12:07:13
 * @LastEditors: :your name
 * @LastEditTime: 2021-12-30 12:09:25
 * @Description: :file content
 */
import request from '@/utils/request';
/* 智能分析 */
// 告警消息
export function getWarningList(params) {
  return request({
    url: '/device/alarm/message/list',
    method: 'get',
    params
  })
}

// 智能分析删除接口
export function delWarningList(data) {
  return request({
    url: '/device/alarm/message/delete',
    method: 'post',
    data
  })
}

// 告警处理
export function handleWarning(data) {
  return request({
    url: '/device/alarm/message/handle',
    method: 'post',
    data
  })
}

// 告警详情 /alarm/message/handle/{id}
export function getWarningDet(id) {
  return request({
    url: `/device/alarm/message/handle/${id}`,
    method: 'get',
  })
}
