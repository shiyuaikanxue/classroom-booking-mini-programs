<template>
	<view class="timetable-container">
		<!-- 周选择器 -->
		<uv-tabs :list="weekList" v-model="currentWeek" lineColor="#FFBF6B"
			:activeStyle="{color: '#FFBF6B', fontWeight: 'bold'}" :scrollable="true" @change="fetchScheduleData">
		</uv-tabs>

		<!-- 新增：日期轴 -->
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

			<!-- 右侧课程格子 -->
			<scroll-view scroll-y class="course-grid">
				<view class="week-row" v-for="(week, weekIndex) in weekList" :key="weekIndex"
					v-show="currentWeek === weekIndex">
					<view class="day-column" v-for="(day, dayIndex) in days" :key="dayIndex">
						<view class="course-item" v-for="course in getCourses(weekIndex, dayIndex)"
							:key="course.schedule_id"
							:style="{backgroundColor: getCourseColor(course.course_name), height: calculateHeightRpx(course)}"
							@click="handleCourseClick(course)">
							<text class="course-name">{{ course.course_name }}</text>
							<text class="course-location">{{ course.classroom_location }}</text>
							<text class="course-teacher">{{ course.teacher_name }}</text>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>
<script setup>
	import {
		ref,
		computed,
		onMounted,
		reactive
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

	// 获取rpx转换比例
	const systemInfo = uni.getSystemInfoSync()
	const rpxRatio = systemInfo.windowWidth / 750

	// 当前周数 (0-19表示20周)
	const currentWeek = ref(0)
	const schedules = reactive({
		Friday: [],
		Monday: [],
		Saturday: [],
		Sunday: [],
		Thursday: [],
		Tuesday: [],
		Wednesday: [],
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
			schedules.value = res.data.schedule
		} catch (e) {
			console.error('获取课表失败', e)
			uni.showToast({
				title: '获取课表失败',
				icon: 'none'
			})
		}
	}

	// 获取指定周和天的课程
	const getCourses = (week, day) => {
		return schedules.value.filter(schedule => {
			const scheduleDate = new Date(schedule.start_time)
			const scheduleWeek = Math.floor((scheduleDate - new Date(startData)) / (7 * 24 * 60 * 60 *
				1000))
			const scheduleDay = scheduleDate.getDay() - 1 // 转换为0-6的索引

			return scheduleWeek === week && scheduleDay === day
		}).map(schedule => {
			// 添加时间槽索引
			const timeSlotIndex = timeSlotMap[schedule.time_slot] || 0
			return {
				...schedule,
				start: timeSlotIndex,
				end: timeSlotIndex + (schedule.time_slot.includes('、') ? 1 : 0)
			}
		})
	}

	// 计算课程高度(rpx)
	const calculateHeightRpx = (course) => {
		const duration = course.end - course.start + 1
		return `${duration * 100}rpx` // 每节课高度100rpx
	}

	// 课程点击事件
	const handleCourseClick = (course) => {
		uni.showModal({
			title: course.course_name,
			content: `教师: ${course.teacher_name}\n教室: ${course.classroom_location}\n时间: ${course.time_slot}`,
			showCancel: false
		})
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
			flex: 1;
			display: flex;
			overflow: scroll;

			.time-axis {
				width: 80rpx;
				background-color: transparent;

				.time-item {
					height: 100rpx;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					font-size: 16rpx;
					color: #666;

					.order {
						font-size: 20rpx;
						margin-bottom: 4rpx;
					}
				}
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
							box-sizing: border-box;
							color: #333;
							font-size: 24rpx;
							overflow: hidden;

							.course-name {
								font-weight: bold;
								margin-bottom: 4rpx;
							}

							.course-location,
							.course-teacher {
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