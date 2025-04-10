import request from '@/utils/request'
import {
	getUserInfo
} from '@/utils/auth.js'
export function getSchedules({
	week
}) {
	const userInfo = getUserInfo()
	return request.get('/schedules', {
		student_id: userInfo.student_id,
		week
	})
}