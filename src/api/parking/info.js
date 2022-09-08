import request from '@/utils/request'

export function getPageList(params) {
  return request({
    url: '/parking/info/getAllParking',
    method: 'post',
    data:params
  })
}

export function updateParkingInfo(params) {
  return request({
    url: '/parking/info/update',
    method: 'put',
    data:params
  })
}

export function addParking(params) {
  return request({
    url: '/parking/info/add',
    method: 'post',
    data:params
  })
}

export function deleteParking(params) {
  return request({
    url: '/parking/info/delete',
    method: 'delete',
    data:params
  })
}
