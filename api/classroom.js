import request from '@/utils/request'
export function getClassroomById(id) {
	return request.get(`/classrooms/${id}`)
}