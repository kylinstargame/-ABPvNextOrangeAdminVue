import request from '@/utils/request'

// 登录方法
export function login(userNameOrEmailAddress, password, code, uuid) {
  const data = {
    userNameOrEmailAddress,
    password,
    code,
    uuid
  }
  return request({
    url: '/sys/account/login',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 注册方法
export function register(data) {
  return request({
    url: '/sys/account/register',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 获取用户详细信息
export function getUserInfo() {
  return request({
    url: '/sys/account/getUserInfo',
    method: 'post'
  })
}

// 退出方法
export function logout() {
  return request({
    url: '/sys/account/logout',
    method: 'post'
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/sys/account/captchaImage',
    headers: {
      isToken: false
    },
    method: 'get',
    timeout: 20000
  })
}
