import request from '@/utils/request'
// 获取即时告警 数据列表
export function getImmediateAlarmList(params) {
  return request({
    url: '/device/alarm/strategy/list',
    method: 'get',
    params
  })
}

// 添加、 更新
export function saveAlarm(data) {
  return request({
    url: '/device/alarm/strategy/save',
    method: 'post',
    data
  })
}

// 告警类型
export function getAlarmType(params) {
  return request({
    url: '/device/category/list',
    method: 'get',
    params
  })
}
// 删除
export function delStrategy(data) {
  return request({
    url: '/device/alarm/strategy/delete',
    method: 'post',
    data
  })
}
// 更新
export function updateCustumer(data) {
  return request({
    url: '/device/level/custumer/saves',
    method: 'post',
    data
  })
}

// 查询有效的警情等级
export function getAlarmLevel(params) {
  return request({
    url: '/device/level/custumer/selectAll',
    method: 'get',
    params
  })
}

// 查询拥有的告警等级
export function getAlarmLevelInfo(params) {
  return request({
    url: '/device/level/custumer/info',
    method: 'get',
    params
  })
}



// 警情等级
export function getAlarmLevelList(params) {
  return request({
    url: '/device/alarm/level/list',
    method: 'get',
    params
  })
}

// 智能抓拍 车辆抓拍数据
export function getCarList(params) {
  return request({
    url: '/device/car/capture/selects',
    method: 'get',
    params
  })
}

// 智能抓拍 人脸抓拍数据
export function getFace(params) {
  return request({
    url: '/device/person/capture/selectFace',
    method: 'get',
    params
  })
}


// 智能抓拍 人脸抓拍数据 删除
export function personDelete(data) {
  return request({
    url: '/device/person/capture/delete',
    method: 'post',
    data
  })
}

// 智能抓拍 车辆抓拍数据 删除
export function captureDelete(data) {
  return request({
    url: '/device/car/capture/delete',
    method: 'post',
    data
  })
}

// 名单布控 人脸抓拍信息和布控信息
export function getSelectByFace(params) {
  return request({
    url: '/device/face/warning/selectByFace',
    method: 'get',
    params
  })
}

// 名单布控 人脸抓拍信息和布控信息 删除
export function getSelectByFaceDelete(data) {
  return request({
    url: '/device/face/warning/delete',
    method: 'post',
    data
  })
}

// 名单布控 车辆抓拍信息和布控信息
export function getSelectCar(params) {
  return request({
    url: '/device/car/warning/selectCar',
    method: 'get',
    params
  })
}

export function getSelectCarDelete(data) {
  return request({
    url: '/device/car/warning/delete',
    method: 'post',
    data
  })
}

// 获取人车轨迹信息
export function getPersontrackSelect(params) {
  return request({
    url: '/device/person/track/select',
    method: 'get',
    params
  })
}

// 获取人车轨迹信息 删除
// export function getPersontrackDelete(data) {
//   return request({
//     url: '/device/person/track/delete' ,
//     method: 'post',
//     data
//   })
// }


// 数据告警查询
export function getAlarmData(params) {
  return request({
    url: '/device/alarm/data/selectAll',
    method: 'get',
    params
  })
}

// 数据告警添加修改
export function getAlarmSaves(params) {
  return request({
    url: '/device/alarm/data/saves',
    method: 'post',
    data: params
  })
}

// 数据告警删除
export function getAlarmDeletes(params) {
  return request({
    url: '/device/alarm/data/deletes',
    method: 'post',
    data: params
  })
}

// 研判告警 查询
export function getJudgedSelect(params) {
  return request({
    url: '/device/judged/alarm/select',
    method: 'get',
    params
  })
}

// 研判告警 保存
export function getJudgedSave(data) {
  return request({
    url: '/device/judged​/alarm​/save',
    method: 'post',
    data
  })
}

// 研判告警 删除
export function getJudgedDelete(data) {
  return request({
    url: '/device/judged/alarm/delete',
    method: 'post',
    data
  })
}

// 事件算法列表
export function getAlgorithmList(params) {
  return request({
    url: '/device/algorithm/list',
    method: 'get',
    params
  })
}
