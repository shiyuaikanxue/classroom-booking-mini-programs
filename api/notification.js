import request from '@/utils/request'
export function getAllNotifications() {
	return request.get('/notifications')
}