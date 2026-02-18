import request from '@/utils/request'

// 管理员登录
export const login = (data) => {
  return request({
    url: '/admin/admin/login',
    method: 'post',
    data
  })
}

// 管理员登出
export const logout = () => {
  return request({
    url: '/admin/admin/logout',
    method: 'post'
  })
}

// 修改密码
export const updatePassword = (data) => {
  return request({
    url: '/admin/admin/password',
    method: 'put',
    data
  })
}

// 获取仪表盘统计数据
export const getDashboardStats = () => {
  return request({
    url: '/admin/admin/stats',
    method: 'get'
  })
}

