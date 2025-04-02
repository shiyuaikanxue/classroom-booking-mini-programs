// utils/request/index.js
import {
	getToken,
	removeToken
} from './auth'

// 请求基础URL
const BASE_URL = 'http://localhost:5000'

// 请求配置
const DEFAULT_CONFIG = {
	url: '',
	method: 'GET',
	data: {},
	header: {},
	loading: true, // 默认显示加载中
	loadingText: '加载中...',
	isAuth: true, // 默认需要认证
	contentType: 'application/json' // 默认content-type
}

/**
 * 请求拦截器
 */
const requestInterceptor = (config) => {
	// 显示加载中
	if (config.loading) {
		uni.showLoading({
			title: config.loadingText,
			mask: true
		})
	}

	// 添加认证token
	if (config.isAuth) {
		const token = getToken()
		if (token) {
			config.header['Authorization'] = `Bearer ${token}`
		}
	}

	// 设置content-type
	config.header['Content-Type'] = config.contentType

	return config
}

/**
 * 响应拦截器
 */
const responseInterceptor = (response, config) => {
	// 关闭加载中
	if (config.loading) {
		uni.hideLoading()
	}

	const {
		statusCode,
		data
	} = response

	// 请求成功
	if (statusCode === 200) {
		// 这里根据你的后端返回结构进行调整
		if (data.code === 200 || data.code === 0) {
			return Promise.resolve(data)
		} else {
			// 业务错误处理
			handleBusinessError(data)
			return Promise.reject(data)
		}
	} else {
		// HTTP错误处理
		handleHttpError(statusCode, data)
		return Promise.reject(response)
	}
}

/**
 * 错误处理 - 业务错误
 */
const handleBusinessError = (data) => {
	const errorMap = {
		401: '登录已过期，请重新登录',
		403: '没有权限访问该资源',
		404: '请求资源不存在',
		500: '服务器内部错误'
	}

	const message = data.message || errorMap[data.code] || '未知错误'

	uni.showToast({
		title: message,
		icon: 'none',
		duration: 2000
	})

	// token过期处理
	if (data.code === 401) {
		removeToken()
		// 跳转到登录页
		setTimeout(() => {
			uni.reLaunch({
				url: '/pages/login/login'
			})
		}, 1500)
	}
}

/**
 * 错误处理 - HTTP错误
 */
const handleHttpError = (statusCode, data) => {
	const errorMap = {
		400: '请求参数错误',
		401: '未授权，请登录',
		403: '拒绝访问',
		404: '请求地址出错',
		405: '请求方法不允许',
		408: '请求超时',
		500: '服务器内部错误',
		501: '服务未实现',
		502: '网关错误',
		503: '服务不可用',
		504: '网关超时'
	}

	const message = data.message || errorMap[statusCode] || `连接出错(${statusCode})`

	uni.showToast({
		title: message,
		icon: 'none',
		duration: 2000
	})
}

/**
 * 请求方法
 */
const request = (config) => {
	// 合并配置
	const mergedConfig = {
		...DEFAULT_CONFIG,
		...config
	}

	// 请求拦截
	const requestConfig = requestInterceptor(mergedConfig)

	return new Promise((resolve, reject) => {
		uni.request({
			url: BASE_URL + requestConfig.url,
			method: requestConfig.method,
			data: requestConfig.data,
			header: requestConfig.header,
			success: (res) => {
				responseInterceptor(res, requestConfig)
					.then(resolve)
					.catch(reject)
			},
			fail: (err) => {
				if (requestConfig.loading) {
					uni.hideLoading()
				}
				uni.showToast({
					title: '网络连接失败',
					icon: 'none'
				})
				reject(err)
			}
		})
	})
}

// 快捷方法
const get = (url, data = {}, config = {}) => {
	return request({
		url,
		data,
		method: 'GET',
		...config
	})
}

const post = (url, data = {}, config = {}) => {
	return request({
		url,
		data,
		method: 'POST',
		...config
	})
}

const put = (url, data = {}, config = {}) => {
	return request({
		url,
		data,
		method: 'PUT',
		...config
	})
}

const del = (url, data = {}, config = {}) => {
	return request({
		url,
		data,
		method: 'DELETE',
		...config
	})
}

export default {
	request,
	get,
	post,
	put,
	delete: del
}