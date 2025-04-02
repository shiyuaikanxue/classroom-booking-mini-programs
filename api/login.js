// api/login.js
import request from '@/utils/request'
// 用户登录
export function login(data) {
  return request.post('/auth/login', data, {
    isAuth: false,
    loadingText: '登录中...'
  }).then(res => {
    if (res.code === 200) {
      return res.data // 返回data中的数据
    }
    return Promise.reject(res) // 抛出错误
  })
}

// 获取用户信息
export function getUserInfo() {
  return request.get('/user/info')
}

// 更新用户信息
export function updateUserInfo(data) {
  return request.put('/user/info', data)
}

// 修改密码
export function changePassword(data) {
  return request.post('/user/change-password', data)
}