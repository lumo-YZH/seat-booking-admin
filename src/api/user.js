import request from '@/utils/request'

// 分页查询用户列表
export const getUserPage = (data) => {
  return request({
    url: '/admin/user/page',
    method: 'post',
    data
  })
}

// 查询用户详情
export const getUserById = (id) => {
  return request({
    url: `/admin/user/${id}`,
    method: 'get'
  })
}

// 启用/禁用用户
export const updateUserStatus = (id, status) => {
  return request({
    url: `/admin/user/${id}/status/${status}`,
    method: 'put'
  })
}

// 删除用户
export const deleteUser = (id) => {
  return request({
    url: `/admin/user/${id}`,
    method: 'delete'
  })
}

