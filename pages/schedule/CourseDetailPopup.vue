<template>
	<uv-popup ref="popupRef" mode="center" :round="10" :closeOnClickOverlay="false" @close="handleClose">
		<view class="course-detail-popup">
			<view class="popup-header">
				<text class="course-name">{{ course.course_name }}</text>
				<text class="course-time">{{ formatCourseTime(course) }}</text>
			</view>

			<view class="popup-content">
				<view class="detail-row">
					<uv-icon name="account" size="18" color="#666"></uv-icon>
					<text class="detail-text">教师: {{ course.teacher_name }}</text>
				</view>

				<view class="detail-row">
					<uv-icon name="map" size="18" color="#666"></uv-icon>
					<text class="detail-text">教室: {{ course.classroom_code }}</text>
				</view>

				<view class="detail-row" v-if="course.classroom_location">
					<uv-icon name="location" size="18" color="#666"></uv-icon>
					<text class="detail-text">位置: {{ course.classroom_location }}</text>
				</view>

				<view class="detail-row" v-if="course.description">
					<uv-icon name="edit-pen" size="18" color="#666"></uv-icon>
					<text class="detail-text">备注: {{ course.description }}</text>
				</view>
			</view>

			<view class="popup-footer">
				<uv-button type="primary" size="small" @click="handleClose" customStyle="width: 100%">
					关闭
				</uv-button>
			</view>
		</view>
	</uv-popup>
</template>

<script setup>
	import {
		ref,
		watch
	} from 'vue'

	const props = defineProps({
		visible: {
			type: Boolean,
			default: false
		},
		course: {
			type: Object,
			default: () => ({})
		}
	})

	const emit = defineEmits(['update:visible', 'close'])
	const popupRef = ref(null)

	// 监听父组件传入的visible变化
	watch(() => props.visible, (newVal) => {
		popupRef.value.open()
	})

	const handleClose = () => {
		if (popupRef.value) {
			popupRef.value.close()
		}
		emit('update:visible', false)
		emit('close')
	}
	const formatCourseTime = (course) => {
		if (!course.start_time || !course.end_time) return ''

		const start = new Date(course.start_time)
		const end = new Date(course.end_time)

		return `${start.getHours()}:${start.getMinutes().toString().padStart(2, '0')} - ${end.getHours()}:${end.getMinutes().toString().padStart(2, '0')}`
	}
</script>

<style lang="scss">
	.course-detail-popup {
		width: 600rpx;
		padding: 30rpx;
		box-sizing: border-box;

		.popup-header {
			margin-bottom: 30rpx;
			text-align: center;

			.course-name {
				font-size: 32rpx;
				font-weight: bold;
				color: #333;
				display: block;
				margin-bottom: 10rpx;
			}

			.course-time {
				font-size: 24rpx;
				color: #666;
			}
		}

		.popup-content {
			.detail-row {
				display: flex;
				align-items: center;
				margin-bottom: 20rpx;

				.uv-icon {
					margin-right: 10rpx;
				}

				.detail-text {
					font-size: 28rpx;
					color: #333;
					flex: 1;
				}
			}
		}

		.popup-footer {
			margin-top: 40rpx;
		}
	}
</style>