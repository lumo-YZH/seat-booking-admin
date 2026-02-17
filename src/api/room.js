import request from '@/utils/request'

// 新增会议室
export const addRoom = (data) => {
  return request({
    url: '/admin/meetingroom',
    method: 'post',
    data
  })
}

// 查询会议室详情
export const getRoomById = (id) => {
  return request({
    url: `/admin/meetingroom/${id}`,
    method: 'get'
  })
}

// 删除会议室
export const deleteRoom = (id) => {
  return request({
    url: `/admin/meetingroom/${id}`,
    method: 'delete'
  })
}

// 修改会议室
export const updateRoom = (data) => {
  return request({
    url: '/admin/meetingroom',
    method: 'put',
    data
  })
}

// 分页查询会议室
export const getRoomPage = (data) => {
  return request({
    url: '/admin/meetingroom/page',
    method: 'post',
    data
  })
}

