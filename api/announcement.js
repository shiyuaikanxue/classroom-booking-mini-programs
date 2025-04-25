import request from '@/utils/request'
export function getAllAnnouncements() {
	return request.get('/announcement')
}
export function getAnnouncementById(id) {
	return request.get(`/announcement/${id}`)
}