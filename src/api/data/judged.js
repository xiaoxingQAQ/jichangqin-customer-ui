/*
 * @Author: :luck
 * @Date: 2022-01-08 09:50:36
 * @LastEditors: :your name
 * @LastEditTime: 2022-01-08 09:59:35
 * @Description: :file content
 */
/* 研判告警 */
import request from '@/utils/request'
// 研判告警列表
export function getJudgeList(params) {
  return request({
    url: '/device/judged/alarm/select',
    method: 'get',
    params
  })
}
// 研判告警保存/修改
export function saveJudgeList(data) {
  return request({
    url: '/device/judged/alarm/save',
    method: 'post',
    data
  })
}