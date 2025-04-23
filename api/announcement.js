import request from '@/utils/request'
export function getAllAnnouncements() {
	return request.get('/announcement')
}