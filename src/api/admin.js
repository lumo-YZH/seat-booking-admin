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

// 获取预订趋势统计
export const getBookingTrend = (params) => {
  return request({
    url: '/admin/report/trend',
    method: 'get',
    params
  })
}

// 获取会议室使用率统计
export const getRoomUsage = (params) => {
  return request({
    url: '/admin/report/room-usage',
    method: 'get',
    params
  })
}

// 导出预订记录
export const exportBookings = (params) => {
  return `/api/admin/report/export/bookings?startDate=${params.startDate || ''}&endDate=${params.endDate || ''}&roomId=${params.roomId || ''}`
}

// 导出统计报表
export const exportStatistics = (params) => {
  return `/api/admin/report/export/statistics?startDate=${params.startDate || ''}&endDate=${params.endDate || ''}&roomId=${params.roomId || ''}`
}

