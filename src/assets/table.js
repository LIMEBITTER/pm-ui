import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/community/info/getAllCommunities',
    method: 'post',
    data:params
  })
}
