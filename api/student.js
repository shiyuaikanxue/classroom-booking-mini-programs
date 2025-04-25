import request from '@/utils/request'
export function getStudentById(id) {
	return request.get(`/student/${id}`)
}
export function updateStudent(id, data) {
	return request.put(`/student/${id}`, data)
}