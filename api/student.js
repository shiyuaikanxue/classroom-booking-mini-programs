import request from '@/utils/request'
export function getStudentById(id) {
	return request.get(`/student/${id}`)
}