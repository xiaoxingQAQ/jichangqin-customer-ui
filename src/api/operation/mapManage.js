import request from '@/utils/request';

// 加油站站点图标 
export function getStationIcon(params) {
  return request({
    url: '/device/petrol/station/site',
    method: 'get',
    params
  })
}

// 添加加油站
export function addStation(data) {
  return request({
    url: '/device/petrol/station/marker',
    method: 'post',
    data
  })
}

// 删除加油站
export function unMarkerStation(params) {
  return request({
    url: '/device/petrol/station/unmarker',
    method: 'get',
    params
  })
}

// 查询地图中心点和缩放级别 传userId
export function getCenterLevel(params) {
  return request({
    url: '/device/configuration/select',
    method: 'get',
    params
  })
}

// 地图中心点和缩放级别 添加/修改 
/* 传 userId 
centreLongitude中心点经度  
centreLatitude中心点纬度  mapRank级别 */
export function addCenterLevel(data) {
  return request({
    url: '/device//configuration/saves',
    method: 'post',
    data
  })
}

// 查询地图列表
export function getPetrolStation(query) {
  return request({
    url: '/device/petrol/station/info',
    method: 'get',
    params: query
  })
}

// 保存加油站信息
export function saveStationInfo(data) {
  return request({
    url: '/device/petrol/station/save',
    method: 'post',
    data
  })
}


// 按ID获取摄像机列表信息
export function getCameraList(params) {
  return request({
    url: `/device/camera/list/server`,
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
    url: `/device/camera/remove/mark`,
    method: 'get',
    params
  })
}

// 按区域ID获取摄像机 图标列表
export function getCameraMarker(params) {
  return request({
    url: '/device/camera/selectByOrgId',
    method: 'get',
    params
  })
}


// 删除平面图摄像机
export function deletePlanCamera(data) {
  return request({
    url: `/device/camera/deleteMap`,
    method: 'post',
    data
  })
}

/* 防区接口-------------------------- */
// 获取防区数据
export function getPolygonList(params) {
  return request({
    url: `/device/defence/area/select`,
    method: 'get',
    params
  })
}

// 添加 / 编辑 防区
export function savePolygon(data) {
  return request({
    url: '/device/defence/area/save',
    method: 'post',
    data
  })
}

// 删除区域
export function delPolygon(params) {
  return request({
    url: `/device/defence/area/delete`,
    method: 'delete',
    params
  })
}
// 获取轨迹
export function getCarPlace(params) {
  return request({
    url: `/device/car/trajectory/selectByOrgId`,
    method: 'get',
    params
  })
}