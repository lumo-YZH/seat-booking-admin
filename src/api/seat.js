import request from '@/utils/request'

// 查询会议室座位布局
export const getSeatLayout = (meetingRoomId) => {
  return request({
    url: `/admin/seat/layout/${meetingRoomId}`,
    method: 'get'
  })
}

// 更新座位状态
export const updateSeatStatus = (data) => {
  return request({
    url: '/admin/seat/status',
    method: 'put',
    data
  })
}

