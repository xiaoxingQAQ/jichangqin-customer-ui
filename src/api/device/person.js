import request from '@/utils/request'
/*  人员管理 */
export function listPersons(query) {
  return request({
    url: '/device/person/list',
    method: 'get',
    params: query
  })
}

// 添加人员
export function addPerson(data) {
  return request({
    url: '/device/person/save',
    method: 'post',
    data
  })
}

// 人员信息
export function getPerson(query) {
  return request({
    url: '/device/person/info',
    method: 'get',
    params: query
  })
}

// 人员信息
export function deletePerson(data) {
  return request({
    url: '/device/person/delete',
    method: 'post',
    data
  })
}
