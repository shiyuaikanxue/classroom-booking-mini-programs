import request from '@/utils/request'
export function getAllNotifications() {
	return request.get('/notifications')
}
export function getNotificationById(id) {
	return request.get(`/notifications/${id}`)
}