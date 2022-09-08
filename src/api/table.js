import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/community/info/getAllCommunities',
    method: 'post',
    data:params
  })
}

export function updateCommunityInfo(params) {
  return request({
    url: '/community/info/update',
    method: 'put',
    data:params
  })
}

export function addCommunity(params) {
  return request({
    url: '/community/info/add',
    method: 'post',
    data:params
  })
}

export function deleteCommunity(params) {
  return request({
    url: '/community/info/delete',
    method: 'delete',
    data:params
  })
}
