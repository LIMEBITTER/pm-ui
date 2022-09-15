import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/owner/ownerRole/getAllOwnerRoles',
    method: 'post',
    data:params
  })
}



export function updateOwnerRole(params) {
  return request({
    url: '/owner/ownerRole/update',
    method: 'put',
    data:params
  })
}

export function addOwnerRole(params) {
  return request({
    url: '/owner/ownerRole/add',
    method: 'post',
    data:params
  })
}

export function deleteOwnerRole(params) {
  return request({
    url: '/owner/ownerRole/delete',
    method: 'delete',
    data:params
  })
}
