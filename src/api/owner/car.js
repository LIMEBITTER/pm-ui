import request from '@/utils/request'

export function getPageList(params) {
  return request({
    url: '/owner/car/getAllCars',
    method: 'post',
    data:params
  })
}

export function updateCar(params) {
  return request({
    url: '/owner/car/update',
    method: 'put',
    data:params
  })
}

export function addCar(params) {
  return request({
    url: '/owner/car/add',
    method: 'post',
    data:params
  })
}

export function deleteCar(params) {
  return request({
    url: '/owner/car/delete',
    method: 'delete',
    data:params
  })
}

//获取业主信息 请求为owner的controller
export function getOwnerList() {
  return request({
    url: '/owner/info/getOwnerList',
    method: 'get',

  })
}
