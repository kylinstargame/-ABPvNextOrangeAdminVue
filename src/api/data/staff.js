import request from '@/utils/request'

// 查询代员工信息列表
export function listStaff(query) {
  return request({
    url: '/data/staff/list',
    method: 'get',
    params: query
  })
}

// 查询代员工信息详细
export function getStaff(id) {
  return request({
    url: '/data/staff/get?staffId='+id,
    method: 'post'
  })
}

// 新增代员工信息
export function addStaff(data) {
  return request({
    url: '/data/staff/add',
    method: 'post',
    data: data
  })
}

// 修改代员工信息
export function updateStaff(data) {
  return request({
    url: '/data/staff/update' +
      '',
    method: 'post',
    data: data
  })
}

// 删除代员工信息
export function delStaff(id) {
  return request({
    url: '/data/staff/delete?staffId=' + id,
    method: "post"
  })
}
