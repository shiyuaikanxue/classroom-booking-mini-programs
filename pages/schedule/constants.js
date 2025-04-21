// 时间节次
export const timeSlots = [{
	order: 1,
	start: "08:00",
	end: "08:45",
}, {
	order: 2,
	start: "08:55",
	end: "09:40",
}, {
	order: 3,
	start: "10:15",
	end: "11:00",
}, {
	order: 4,
	start: "11:10",
	end: "11:55",
}, {
	order: 5,
	start: "14:00",
	end: "14:45",
}, {
	order: 6,
	start: "14:55",
	end: "15:40",
}, {
	order: 7,
	start: "16:15",
	end: "17:00",
}, {
	order: 8,
	start: "17:10",
	end: "17:55",
}, {
	order: 9,
	start: "19:00",
	end: "19:45",
}, {
	order: 10,
	start: "19:55",
	end: "20:40",
}, {
	order: 11,
	start: "20:50",
	end: "21:35",
}, {
	order: 12,
	start: "21:45",
	end: "22:30",
}]
// 时间槽映射表
export const timeSlotMap = {
	'一': {
		top: 0,
		height: 1
	},
	'二': {
		top: 1,
		height: 1,
	},
	'三': {
		top: 2,
		height: 1,
	},
	'四': {
		top: 3,
		height: 1,
	},
	'五': {
		top: 4,
		height: 1,
	},
	'六': {
		top: 5,
		height: 1,
	},
	'七': {
		top: 6,
		height: 1,
	},
	'八': {
		top: 7,
		height: 1,
	},
	'九': {
		top: 8,
		height: 1,
	},
	'十': {
		top: 9,
		height: 1,
	},
	'十一': {
		top: 10,
		height: 1,
	},
	'十二': {
		top: 11,
		height: 1,
	},
	'一、二': {
		top: 0,
		height: 2
	},
	'三、四': {
		top: 2,
		height: 2,
	},
	'五、六': {
		top: 4,
		height: 2,
	},
	'七、八': {
		top: 6,
		height: 2,
	},
	'九、十': {
		top: 8,
		height: 2,
	},
	'十一、十二': {
		top: 10,
		height: 2,
	},
	'一、二、三': {
		top: 0,
		height: 3,
	},
	'二、三、四': {
		top: 1,
		height: 3,
	},
	'三、四、五': {
		top: 2,
		height: 3,
	},
	'四、五、六': {
		top: 4,
		height: 3,
	},
	'五、六、七': {
		top: 5,
		height: 3,
	},
	'六、七、八': {
		top: 6,
		height: 3,
	},
	'七、八、九': {
		top: 6,
		height: 3,
	},
	'八、九、十': {
		top: 7,
		height: 3,
	},
	'九、十、十一': {
		top: 8,
		height: 3,
	},
	'十、十一、十二': {
		top: 8,
		height: 3,
	},
}
// 星期几
export const daysDist = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
export const startData = '2025-2-24'