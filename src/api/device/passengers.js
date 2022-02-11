/*
 * @Author: :luck
 * @Date: 2022-01-07 19:30:19
 * @LastEditors: :your name
 * @LastEditTime: 2022-01-08 09:57:27
 * @Description: :file content
 */
/* 客流统计 */
import request from '@/utils/request'

// 查询客流数据 type:1 日报表，2 周报表，3 月报表 4 年报表
export function getPassengerList(params) {
  return request({
    url: '/device/car/cust/list',
    method: 'get',
    params
  })
}