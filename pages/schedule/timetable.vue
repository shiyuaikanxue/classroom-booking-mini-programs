<template>
	<view class="timetable-container">
		<!-- 周选择器 -->
		<uv-tabs :list="weekList" v-model="currentWeek" lineColor="#FFBF6B"
			:activeStyle="{color: '#FFBF6B', fontWeight: 'bold'}" :scrollable="true" @change="fetchScheduleData">
		</uv-tabs>

		<!-- 日期轴 -->
		<view class="date-axis">
			<view class="logo">
				<uv-icon name="calendar" color="#FFBF6B" size="28"></uv-icon>
			</view>
			<view class="date-item" v-for="(date, index) in currentWeekDates" :key="index" :class="{ 
          'today': isToday(date, index),
          'weekend': index >= 5 
        }">
				<text class="day">{{ daysDist[index] }}</text>
				<text class="date">{{ date }}</text>
				<view class="today-marker" v-if="isToday(date, index)"></view>
			</view>
		</view>

		<!-- 课表主体 -->
		<view class="timetable-body">
			<!-- 左侧时间轴 -->
			<view class="time-axis">
				<view class="time-item" v-for="(item, index) in timeSlots" :key="index">
					<text class="order">{{item.order}}</text>
					<text>{{item.start}}</text>
					<text>{{item.end}}</text>
				</view>
			</view>
			<view class="no-course-tip" v-if="isEmpty">
				<uv-icon name="list" size="40" color="#ccc"></uv-icon>
				<text class="tip-text">暂无课程</text>
			</view>
			<!-- 右侧课程格子 -->
			<view scroll-y class="course-grid">
				<view class="week-row">
					<view class="day-column" v-for="(day, dayIndex) in days" :key="dayIndex">
						<view class="course-item" v-for="(course, courseIndex) in getCourses(currentWeek, dayIndex)"
							:key="courseIndex"
							:style="{backgroundColor: getCourseColor(course.course_name), height: calculateHeightRpx(course),top:calculateTop(course)}"
							@click="handleCourseClick(course)">
							<text class="course-name">{{ course.course_name }}</text>
							<text class="course-classroomCode">{{ course.classroom_code }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<CourseDetailPopup :visible="showCourseDetail" @update:visible="showCourseDetail = $event"
			:course="currentCourse" @close="handlePopupClose" />
	</view>
</template>
<script setup>
	import {
		ref,
		computed,
		onMounted,
		reactive,
	} from 'vue'
	import {
		timeSlots,
		timeSlotMap,
		daysDist,
		startData
	} from './constants.js'
	import {
		getSchedules
	} from '@/api/schedules.js'
	import {
		rpxRatio
	} from '@/utils/ratio.js'
	import CourseDetailPopup from './CourseDetailPopup.vue' // 根据实际路径调整
	// 颜色生成器
	const colors = [
		'#f8d486', '#a0d8ef', '#b5ead7', '#ffb7b2',
		'#d8b5ff', '#84dcc6', '#ffd6ff', '#c8e7ff'
	]
	const courseColorMap = {}

	const getCourseColor = (courseName) => {
		if (!courseColorMap[courseName]) {
			const index = Object.keys(courseColorMap).length % colors.length
			courseColorMap[courseName] = colors[index]
		}
		return courseColorMap[courseName]
	}


	// 当前周数 (0-19表示20周)
	const currentWeek = ref(0)
	const schedules = reactive({
		Monday: [],
		Tuesday: [],
		Wednesday: [],
		Thursday: [],
		Friday: [],
		Saturday: [],
		Sunday: []
	})
	const isEmpty = computed(() => {
		return Object.keys(schedules).every(day => {
			return schedules[day].length === 0
		})
	})
	// 周列表数据
	const weekList = computed(() => {
		return Array.from({
			length: 20
		}, (_, i) => ({
			name: `第${i+1}周`,
			value: i,
			disabled: false
		}))
	})

	// 星期映射
	const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

	// 计算当前周的日期
	const currentWeekDates = computed(() => {
		const startDate = new Date(startData)
		startDate.setDate(startDate.getDate() + currentWeek.value * 7)

		return Array.from({
			length: 7
		}, (_, i) => {
			const date = new Date(startDate)
			date.setDate(date.getDate() + i)
			return `${date.getMonth()+1}月${date.getDate()}日`
		})
	})

	// 判断是否是今天
	const isToday = (dateStr, dayIndex) => {
		const today = new Date()
		const todayStr = `${today.getMonth()+1}月${today.getDate()}日`

		// 获取当前周的起始日期
		const startDate = new Date(startData)
		startDate.setDate(startDate.getDate() + currentWeek.value * 7)

		// 判断是否是当前周且是今天
		return dateStr === todayStr &&
			startDate <= today &&
			today <= new Date(startDate.setDate(startDate.getDate() + 6))
	}

	// 获取课表数据
	const fetchScheduleData = async (week) => {
		currentWeek.value = week.value
		try {
			const res = await getSchedules({
				week: currentWeek.value + 1, // API可能需要从1开始计数
			})

			// 更新课表数据
			Object.keys(schedules).forEach(day => {
				schedules[day] = res.data.schedule[day] || []
			})

		} catch (e) {
			console.error('获取课表失败', e)
			uni.showToast({
				title: '获取课表失败',
				icon: 'none'
			})
		}
	}

	// 获取指定周和天的课程
	const getCourses = (week, dayIndex) => {
		const dayName = days[dayIndex]
		return schedules[dayName] || []
	}


	// 转换为px
	const calculateHeightRpx = (course) => {

		const rpxValue = timeSlotMap[course.time_slot].height * 100 +
			(timeSlotMap[course.time_slot].height - 1) * 10;
		return `${rpxValue * rpxRatio}px`;
	}

	const calculateTop = (course) => {
		const rpxValue = timeSlotMap[course.time_slot].top * 100 + (timeSlotMap[course.time_slot].top - 1) * 10;
		return `${rpxValue * rpxRatio}px`;
	}

	const showCourseDetail = ref(false)
	const currentCourse = ref({})
	// 课程点击事件
	// 课程点击事件
	const handleCourseClick = (course) => {
		currentCourse.value = course
		showCourseDetail.value = true
	}

	// 添加弹窗关闭处理
	const handlePopupClose = () => {
		showCourseDetail.value = false
	}
	// 初始化加载数据
	onMounted(() => {
		fetchScheduleData({
			value: 0
		})
	})
</script>

<style lang="scss">
	.timetable-container {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;

		.date-axis {
			width: 100%;
			height: 100rpx;
			display: flex;
			background-color: transparent;
			border-bottom: 1rpx solid #eee;

			.logo {
				width: 80rpx;
				height: 100%;
				padding: 0 20rpx;
				box-sizing: border-box;
				display: flex;
				align-items: center;
				justify-content: center;
			}

			.date-item {
				flex: 1;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				position: relative;

				.day {
					font-size: 28rpx;
					color: #333;
					margin-bottom: 6rpx;
				}

				.date {
					font-size: 16rpx;
					color: #999;
				}

				&.weekend {

					.day,
					.date {
						color: #FF6B6B;
					}
				}

				&.today {

					.day,
					.date {
						color: #FF6B6B;
						font-weight: bold;
					}

					.today-marker {
						position: absolute;
						bottom: 10rpx;
						width: 12rpx;
						height: 12rpx;
						border-radius: 50%;
						background-color: #FF6B6B;
					}
				}
			}
		}

		.timetable-body {
			// flex: 1;
			display: flex;
			overflow: scroll;

			.time-axis {
				width: 80rpx;
				display: flex;
				flex-direction: column;
				row-gap: 10rpx;
				background-color: transparent;

				.time-item {
					height: 100rpx;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					font-size: 16rpx;
					color: #666;
					flex-shrink: 0;

					.order {
						font-size: 20rpx;
						margin-bottom: 4rpx;
					}
				}
			}

			.no-course-tip {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				width: 100%;
				color: #ccc;

				.tip-text {
					font-size: 24rpx;
					margin-top: 10rpx;
				}
			}

			.day-column {
				/* 修改原有样式，添加最小高度 */
				min-height: 600rpx;
				position: relative;
			}

			.course-grid {
				flex: 1;

				.week-row {
					width: 100%;
					display: flex;

					.day-column {
						flex: 1;
						border-left: 1rpx solid #eee;
						position: relative;

						.course-item {
							position: absolute;
							width: calc(100% - 8rpx);
							margin: 4rpx;
							border-radius: 8rpx;
							padding: 8rpx;
							display: flex;
							flex-direction: column;
							justify-content: space-between;
							box-sizing: border-box;
							color: #333;
							font-size: 24rpx;
							overflow: hidden;

							.course-name {
								font-size: 22rpx;
								font-weight: bold;
								margin-bottom: 4rpx;
							}

							.course-classroomCode {
								font-size: 20rpx;
								line-height: 1.4;
							}
						}
					}
				}
			}
		}
	}
</style>