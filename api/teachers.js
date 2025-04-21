import request from '@/utils/request'
export function getAllTeachers() {
	return request.get('/teachers')
}