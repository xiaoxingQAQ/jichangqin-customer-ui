import request from '@/utils/request'
// 查询员工档案列表
export function listArchives(query) {
  return request({
    url: '/device/archives/list',
    method: 'get',
    params: query
  })
}

// 添加档案
export function addRecord(data) {
  return request({
    url: '/device/archives/save',
    method: 'post',
    data
  })
}

// 删除档案
export function delRecord(data) {
  return request({
    url: '/device/archives/delete',
    method: 'post',
    data
  })
}
