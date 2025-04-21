import request from '@/utils/request'
import {
	getUserInfo
} from '@/utils/auth.js'
export function getReservationList() {
	const userInfo = getUserInfo()
	return request.get('/reservation', {
		student_id: userInfo.student_id
	})
}

export function deleteReservation(id) {
	return request.delete(`/reservation/${id}`)
}
export function cancelReservation(id) {
	return request.put(`/reservation/${id}`, {
		status: 'cancelled'
	})
}
export function createReservation(data) {
	const userInfo = getUserInfo()
	const params = {
		student_id: userInfo.student_id,
		...data
	}
	return request.post('/reservation',
		params
	)
}
export function  updateReservation(id, data) {
	const userInfo = getUserInfo()
	const params = {
		student_id: userInfo.student_id,
		...data
	}
	return request.put(`/reservation/${id}`,
		params
	)
}
export function getReservationById(id) {
	return request.get(`/reservation/${id}`)
}
export function getAvailableClassrooms(params) {
	return request.get('/classrooms', params)
}
export function getTeachers(params) {
	return request.get('/teachers', params)
}
export function getCanUseClassrooms(params) {
	return request.get('/classrooms', params)
}