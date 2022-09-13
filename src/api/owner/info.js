import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/owner/info/getAllOwners',
    method: 'post',
    data:params
  })
}

export function updateOwnerInfo(params) {
  return request({
    url: '/owner/info/update',
    method: 'put',
    data:params
  })
}

export function addOwner(params) {
  return request({
    url: '/owner/info/add',
    method: 'post',
    data:params
  })
}

export function deleteOwner(params) {
  return request({
    url: '/owner/info/delete',
    method: 'delete',
    data:params
  })
}

//获取社区 请求为community的controller
export function getCommunityList() {
  return request({
    url: '/community/info/getCommunityList',
    method: 'get',

  })
}
