import request from '@/utils/request'

// 分页查询预订
export const getBookingPage = (data) => {
  return request({
    url: '/admin/booking/page',
    method: 'post',
    data
  })
}

// 完成预订
export const completeBooking = (id) => {
  return request({
    url: `/admin/booking/${id}/complete`,
    method: 'put'
  })
}

// 取消预订
export const cancelBooking = (id) => {
  return request({
    url: `/admin/booking/${id}/cancel`,
    method: 'put'
  })
}

