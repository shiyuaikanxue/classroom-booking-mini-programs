<template>
	<layout>
		<headerVue>
			<view class="title">
				<view class="back" @click="goBack">
					<uv-icon name="arrow-left" color="#2979ff" size="24"></uv-icon>
				</view>
				<text class="text">预约申请</text>
			</view>
		</headerVue>

		<view class="reservation-container">
			<!-- 教室信息展示 -->
			<view class="info-card">
				<view class="info-item">
					<text class="label">教室：</text>
					<text class="value">{{ classroomInfo.code }} - {{ classroomInfo.location }}</text>
				</view>
				<view class="info-item">
					<text class="label">日期：</text>
					<text class="value">{{ formatDate(queryParams.date) }}</text>
				</view>
				<view class="info-item">
					<text class="label">时间：</text>
					<text class="value">{{ getTimeSlotLabel(queryParams.timeSlot) }}</text>
				</view>
				<view class="info-item">
					<text class="label">容纳人数：</text>
					<text class="value">{{ classroomInfo.capacity }}人</text>
				</view>
			</view>

			<!-- 申请表单 -->
			<view class="form-container">
				<uv-form :model="formData" ref="formRef" labelPosition='top' labelWidth='200rpx'>
					<!-- 活动名称 -->
					<uv-form-item label="活动名称" prop="activity_name" required>
						<uv-input v-model="formData.activity_name" placeholder="请输入活动名称" border="none"></uv-input>
					</uv-form-item>

					<!-- 活动描述 -->
					<uv-form-item label="活动描述" prop="description">
						<uv-textarea v-model="formData.description" placeholder="请详细描述活动内容" height="150" count
							maxlength="200" border="none"></uv-textarea>
					</uv-form-item>

					<!-- 负责老师选择 -->
					<uv-form-item label="负责老师" prop="teacherId" required>
						<uv-cell :title="selectedTeacher || '请选择指导老师'" isLink @click="showTeacherPicker"></uv-cell>
						<uv-picker ref="teacherPicker" :columns="[teacherOptions]" keyName="label"
							@confirm="selectTeacher"></uv-picker>
					</uv-form-item>

					<!-- 参与人数 -->
					<uv-form-item label="参与人数" prop="participants" required>
						<uv-number-box v-model="formData.participants" :min="1" :max="classroomInfo.capacity" :step="1"
							integer></uv-number-box>
					</uv-form-item>
				</uv-form>

				<!-- 提交按钮 -->
				<view class="submit-btn">
					<uv-button type="primary" text="提交申请" shape="circle" :loading="submitting"
						@click="handleSubmit"></uv-button>
				</view>
			</view>
		</view>
	</layout>
</template>

<script setup>
	import {
		ref,
		reactive,
		onMounted,
		computed
	} from 'vue'
	import {
		onLoad
	} from '@dcloudio/uni-app'
	import layout from '@/components/layout/index.vue'
	import headerVue from '@/components/header/index.vue'
	import {
		getAllTeachers
	} from '@/api/teachers'
	import {
		getClassroomById
	} from '@/api/classroom.js'
	import {
		createReservation,
		updateReservation,
		getReservationById
	} from '@/api/reservation'
	import {
		timeSlots
	} from './constants.js'

	// 获取页面参数
	const queryParams = ref({})
	const formRef = ref(null)
	const submitting = ref(false)
	const teacherPicker = ref(null)
	const isEdit = ref(false)
	// 表单数据
	const formData = reactive({
		activity_name: '',
		description: '',
		teacher_id: '',
		participants: 1
	})
	const showTeacherPicker = () => {
		teacherPicker.value.open()
	}
	const selectedTeacher = computed(() => {
		const teacher = teachers.value.find(item => item.teacher_id == formData.teacher_id)
		return teacher ? teacher.name : ''
	})
	const teacherOptions = computed(() => {
		return teachers.value.map(item => ({
			label: item.name,
			id: item.teacher_id
		}))
	})
	const selectTeacher = (teacher) => {
		formData.teacher_id = teacher.value[0].id
	}
	// 教师列表
	const teachers = ref([])

	// 教室信息
	const classroomInfo = reactive({
		code: '',
		location: '',
		capacity: 0
	})

	// 格式化日期
	const formatDate = (dateStr) => {
		if (!dateStr) return ''
		const date = new Date(dateStr)
		return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
	}

	// 获取时间节点标签
	const getTimeSlotLabel = (slotValue) => {
		const slot = timeSlots.find(item => item.order === slotValue)
		return slot ? `第${slot.order}节课 (${slot.start}-${slot.end})` : ''
	}


	// 提交申请
	const handleSubmit = async () => {
		try {
			submitting.value = true

			// 表单验证
			await formRef.value.validate()

			// 检查参与人数是否超过教室容量
			if (formData.participants > classroomInfo.capacity) {
				uni.showToast({
					title: `参与人数不能超过教室容量(${classroomInfo.capacity}人)`,
					icon: 'none'
				})
				return
			}

			// 构建提交数据
			const submitData = {
				...formData,
				classroom_id: queryParams.value.classroomId,
				date: queryParams.value.date,
				time_slot: queryParams.value.timeSlot
			}

			// 调用API提交申请
			if (isEdit.value) {
				await updateReservation(queryParams.value.reservation_id, submitData)
			} else {
				await createReservation(submitData)
			}

			uni.showToast({
				title: '预约申请已提交',
				icon: 'success'
			})

			// 返回上一页
			setTimeout(() => {
				uni.switchTab({
					url: '/pages/booking/index'
				})
			}, 1000)

		} catch (error) {
			console.error('提交失败:', error)
			if (error.message) {
				uni.showToast({
					title: error.message,
					icon: 'none'
				})
			}
		} finally {
			submitting.value = false
		}
	}

	// 返回上一页
	const goBack = () => {
		uni.navigateBack()
	}

	// 页面加载
	onLoad(async (options) => {
		// 获取路由参数
		if (options.reservation_id) {
			isEdit.value = true
			await loadReservation(options.reservation_id)
		} else {
			queryParams.value = {
				classroomId: options.classroomId,
				date: options.date,
				timeSlot: options.timeSlot
			}
		}
		loadClassroominfo(queryParams.value.classroomId)
		// 加载教师列表
		loadTeachers()
	})
	const loadReservation = async (id) => {
		try {
			const res = await getReservationById(id)
			if (res.data) {
				formData.activity_name = res.data.activity_name
				formData.description = res.data.description
				formData.participants = res.data.participants
				formData.teacher_id = res.data.teacher_id
				queryParams.value = {
					reservation_id: id,
					classroomId: res.data.classroom_id,
					date: res.data.date,
					timeSlot: res.data.time_slot
				}
			}
			console.log('预约信息:', formData, queryParams)
		} catch (error) {
			console.error('获取预约信息失败:', error)
			uni.showToast({
				title: '获取预约信息失败',
				icon: 'none'
			})
		}
	}
	const loadClassroominfo = async (id) => {
		try {
			const res = await getClassroomById(id)
			if (res.data) {
				classroomInfo.code = res.data.code
				classroomInfo.location = res.data.location
				classroomInfo.capacity = res.data.capacity
			}
		} catch (error) {
			console.error('获取教室信息失败:', error)
			uni.showToast({
				title: '获取教室信息失败',
				icon: 'none'
			})

		}
	}
	// 加载教师列表
	const loadTeachers = async () => {
		try {
			const res = await getAllTeachers()
			teachers.value = res.data.teachers || []
		} catch (error) {
			console.error('获取教师列表失败:', error)
			uni.showToast({
				title: '获取教师列表失败',
				icon: 'none'
			})
		}
	}
</script>

<style lang="scss" scoped>
	.reservation-container {
		padding: 20rpx;
		flex-grow: 1;
		overflow: scroll;
	}

	.title {
		width: 100%;
		height: 100%;
		position: relative;

		.back {
			position: absolute;
			width: fit-content;
			left: 20rpx;
			top: 50%;
			transform: translateY(-50%);
		}

		.text {
			font-size: 32rpx;
			color: #333;
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
		}
	}

	.info-card {
		background-color: #fff;
		border-radius: 16rpx;
		padding: 30rpx;
		margin-bottom: 30rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

		.info-item {
			display: flex;
			margin-bottom: 20rpx;
			font-size: 28rpx;

			&:last-child {
				margin-bottom: 0;
			}

			.label {
				color: #666;
				width: 150rpx;
			}

			.value {
				color: #333;
				font-weight: 500;
				flex: 1;
			}
		}
	}

	.form-container {
		background-color: #fff;
		border-radius: 16rpx;
		padding: 30rpx;

		:deep(.uv-form-item) {
			.uv-form-item__body {
				padding: 0 0 20rpx 0;
			}

			border-bottom: 1rpx solid #f5f5f5;

			&:last-child {
				border-bottom: none;
			}
		}

		:deep(.uv-input) {
			padding: 0 !important;
		}
	}

	.submit-btn {
		margin-top: 50rpx;
		padding: 0 50rpx;
	}
</style>