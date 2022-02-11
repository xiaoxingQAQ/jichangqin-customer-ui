import request from '@/utils/request'

// 查询
export function getOperationLog(params) {
  return request({
    url: '/device/operation/log/list',
    method: 'get',
    params
  })
}

// 模糊查询
export function getSelectLike(params) {
  return request({
    url: '/device/operation/log/selectLike',
    method: 'get',
    params
  })
}

// 删除
export function getOperationDelete(params) {
  return request({
    url: '/device/operation/log/delete',
    method: 'post',
    data: params
  })
}