import request from '@/utils/request'
// 加油站任务
export function getTaskList(params) {
  return request({
    url: '/device/task/list',
    method: 'get',
    params
  })
}

// 加油站任务删除
export function delTaskList(data) {
  return request({
    url: '/device/task/delete',
    method: 'post',
    data
  })
}
