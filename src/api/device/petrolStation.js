import request from '@/utils/request'

// 查询地图列表
export function getPetrolStation(query) {
  return request({
    url: '/device/petrol/station/info',
    method: 'get',
    params: query
  })
}
