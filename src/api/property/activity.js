import request from '@/utils/request'

export function getPageList(params) {
  return request({
    url: '/property/activity/getAllActivities',
    method: 'post',
    data:params
  })
}

export function updateActivity(params) {
  return request({
    url: '/property/activity/update',
    method: 'put',
    data:params
  })
}

export function addActivity(params) {
  return request({
    url: '/property/activity/add',
    method: 'post',
    data:params
  })
}

export function deleteActivity(params) {
  return request({
    url: '/property/activity/delete',
    method: 'delete',
    data:params
  })
}
