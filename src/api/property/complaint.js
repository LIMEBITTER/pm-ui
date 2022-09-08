import request from '@/utils/request'

export function getPageList(params) {
  return request({
    url: '/property/complaint/getAllComplaints',
    method: 'post',
    data:params
  })
}

export function updateComplaint(params) {
  return request({
    url: '/property/complaint/update',
    method: 'put',
    data:params
  })
}

export function addComplaint(params) {
  return request({
    url: '/property/complaint/add',
    method: 'post',
    data:params
  })
}

export function deleteComplaint(params) {
  return request({
    url: '/property/complaint/delete',
    method: 'delete',
    data:params
  })
}
