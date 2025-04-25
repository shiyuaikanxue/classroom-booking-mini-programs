import request from '@/utils/request'
export function getAdmins(id) {
	return request.get(`/admin/school/${id}/admins`)
}