export function formatTime(dateString) {
	const date = new Date(dateString)
	const now = new Date()

	// 如果是今天
	if (date.toDateString() === now.toDateString()) {
		return date.toLocaleTimeString([], {
			hour: '2-digit',
			minute: '2-digit'
		})
	}

	// 如果是昨天
	const yesterday = new Date(now)
	yesterday.setDate(yesterday.getDate() - 1)
	if (date.toDateString() === yesterday.toDateString()) {
		return '昨天 ' + date.toLocaleTimeString([], {
			hour: '2-digit',
			minute: '2-digit'
		})
	}

	// 其他情况
	return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {
		hour: '2-digit',
		minute: '2-digit'
	})
}