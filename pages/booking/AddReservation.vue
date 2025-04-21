<template>
	<layout>
		<headerVue>
			<view class="title">
				<view class="back" @click="goBack">
					<uv-icon name="arrow-left" color="#2979ff" size="24"></uv-icon>
				</view>
				<text class="text">教室预约</text>
			</view>
		</headerVue>

		<view class="reservation-container">
			<!-- 查询条件表单 -->
			<view class="filter-form">
				<!-- 日期选择 -->
				<view class="form-item row-order">
					<text class="label">预约日期</text>
					<uv-cell :customStyle="{flex:1,fontSize:'24rpx'}" :title="filter.date" isLink
						@click="showDatePicker"></uv-cell>
					<uv-datetime-picker mode="date" ref="datePicker" @confirm="handleDateConfirm"></uv-datetime-picker>
				</view>

				<!-- 时间节点选择 -->
				<view class="form-item row-order">
					<text class="label">课程节点</text>
					<uv-cell :customStyle="{flex:1}" :title="selectedTimeSlotLabel || '请选择上课时间'" isLink
						@click="showTimeSlotPicker"></uv-cell>
					<uv-picker :columns="[timeSlotOptions]" keyName="label" ref="timeSlotPicker"
						@confirm="handleTimeSlotConfirm"></uv-picker>
				</view>

				<!-- 容纳人数 -->
				<view class="form-item row-order">
					<text class="label">最小容纳人数</text>
					<uv-number-box v-model="filter.minCapacity" :min="1" :max="200" :step="5"
						@change="fetchAvailableClassrooms"></uv-number-box>
				</view>

				<!-- 设备多选 -->
				<view class="form-item">
					<text class="label">教室设备</text>
					<uv-checkbox-group v-model="filter.equipments" @change="fetchAvailableClassrooms">
						<view class="checkbox-item" v-for="item in equipmentOptions" :key="item.value">
							<uv-checkbox :name="item.value" :label="item.label"></uv-checkbox>
						</view>
					</uv-checkbox-group>
				</view>

				<!-- 空调数量 -->
				<view class="form-item">
					<text class="label">空调数量</text>
					<uv-radio-group v-model="filter.airConditioner" @change="fetchAvailableClassrooms">
						<view class="radio-item" v-for="item in airConditionerOptions">
							<uv-radio :name="item.value" :label="item.label"></uv-radio>
						</view>
					</uv-radio-group>
				</view>

				<!-- 多媒体设备 -->
				<view class="form-item">
					<text class="label">多媒体设备</text>
					<uv-radio-group v-model="filter.multimedia" @change="fetchAvailableClassrooms">
						<view class="radio-item" v-for="item in multimediaOptions">
							<uv-radio :name="item.value" :label="item.label"></uv-radio>
						</view>
					</uv-radio-group>
				</view>
			</view>

			<!-- 教室列表 -->
			<view class="classroom-list">
				<uv-loading-icon v-if="loading" mode="circle" color="#2979ff"></uv-loading-icon>

				<template v-if="!loading">
					<uv-empty v-if="classrooms.length === 0" mode="data"></uv-empty>

					<template v-else>
						<view class="list-header">
							<text class="list-title">可用教室 ({{classrooms.length}})</text>
							<uv-button type="primary" size="mini" text="重置条件" @click="resetFilters"></uv-button>
						</view>

						<view class="classroom-item" v-for="room in classrooms" :key="room.classroom_id"
							@click="selectClassroom(room)">
							<view class="room-info">
								<text class="room-name">{{room.code}} - {{room.location}}</text>
								<view class="room-details">
									<uv-tag type="primary" size="mini" text="容量"></uv-tag>
									<text>{{room.capacity}}人</text>
									<uv-tag type="warning" size="mini" text="空调"></uv-tag>
									<text>{{room.air_conditioner_count}}台</text>
									<uv-tag type="success" size="mini" text="设备"></uv-tag>
									<text>{{room.equipment || '无'}}</text>
								</view>
							</view>
							<uv-icon name="arrow-right" color="#999" size="20"></uv-icon>
						</view>
					</template>
				</template>
			</view>
		</view>
	</layout>
</template>

<script setup>
	import {
		ref,
		reactive,
		computed,
		onMounted
	} from 'vue'
	import layout from '@/components/layout/index.vue'
	import headerVue from '@/components/header/index.vue'
	import {
		getCanUseClassrooms
	} from '@/api/reservation.js'
	import {
		useResetPersistentReactive
	} from '@/hooks/useResetPersistentReactive.js'
	import {
		timeSlots,
		multimediaOptions,
		airConditionerOptions,
		equipmentOptions
	} from './constants.js'
	// 查询条件
	const [filter, resetFilterValue, clearPersisted] = useResetPersistentReactive({
		date: new Date().toISOString().split('T')[0], // 默认今天
		timeSlot: '',
		minCapacity: 30,
		equipments: [],
		airConditioner: 0,
		multimedia: -1
	})
	const datePicker = ref(null)
	const timeSlotPicker = ref(null)
	// 控制显示
	const showDatePicker = () => {
		datePicker.value.open()
	}
	const showTimeSlotPicker = () => {
		timeSlotPicker.value.open()
	}

	// 教室列表
	const classrooms = ref([])
	const loading = ref(false)

	// 选项数据
	const timeSlotOptions = timeSlots.map(slot => ({
		label: `第${slot.order}节课 (${slot.start}-${slot.end})`,
		value: slot.order.toString()
	}))
	const selectedTimeSlotLabel = computed(() => {
		const selected = timeSlotOptions.find(item => item.value === filter.timeSlot)
		return selected ? selected.label : ''
	})

	// 日期选择确认
	const handleDateConfirm = (timestamp) => {
		const date = new Date(timestamp.value)
		const year = String(date.getFullYear())
		const month = String(date.getMonth() + 1).padStart(2, '0')
		const day = String(date.getDate()).padStart(2, '0')

		// 直接存储格式化后的日期字符串
		filter.date = `${year}-${month}-${day}`
		fetchAvailableClassrooms()
	}

	// 时间节点选择确认
	const handleTimeSlotConfirm = (value) => {
		const selected = value.value[0]
		filter.timeSlot = selected.value
		fetchAvailableClassrooms()
	}

	// 获取可用教室
	const fetchAvailableClassrooms = async () => {
		loading.value = true
		try {
			// 这里应该是API调用，模拟数据
			const params = {
				...filter,
				equipment: filter.equipments.join(','),
			}
			delete params.equipments // 删除不必要的字段
			const response = await getCanUseClassrooms(params)
			classrooms.value = response.data.classrooms || []
		} catch (error) {
			console.error('获取教室列表失败:', error)
			uni.showToast({
				title: '获取教室列表失败，请重试',
				icon: 'none'
			})
		} finally {
			loading.value = false
		}
	}

	// 重置筛选条件
	const resetFilters = () => {
		resetFilterValue()
		fetchAvailableClassrooms()
	}

	// 选择教室
	const selectClassroom = (room) => {
		if (!filter.timeSlot) {
			uni.showToast({
				title: '请选择上课时间',
				icon: 'none'
			})
			return
		}
		uni.navigateTo({
			url: `apply?classroomId=${room.classroom_id}&date=${filter.date}&timeSlot=${filter.timeSlot}`
		})
	}

	// 返回上一页
	const goBack = () => {
		uni.navigateBack()
	}

	// 初始化加载
	onMounted(() => {
		fetchAvailableClassrooms()
	})
</script>

<style lang="scss" scoped>
	.reservation-container {
		margin: 20rpx;
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

	.filter-form {
		background-color: #fff;
		border-radius: 16rpx;
		padding: 20rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
	}

	.form-item {
		margin-bottom: 10rpx;

		.label {
			display: block;
			font-size: 28rpx;
			height: 30rpx;
			color: #666;
			margin-bottom: 15rpx;
		}

		.uv-cell {
			padding: 0;
		}
	}

	.row-order {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.classroom-list {
		background-color: #fff;
		border-radius: 16rpx;
		padding: 20rpx;
		min-height: 300rpx;

		.list-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 20rpx;
		}

		.list-title {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
		}
	}

	.classroom-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 25rpx 0;
		border-bottom: 1rpx solid #f5f5f5;

		.room-info {
			flex: 1;

			.room-name {
				font-size: 30rpx;
				font-weight: bold;
				color: #333;
				margin-bottom: 10rpx;
				display: block;
			}

			.room-details {
				display: flex;
				align-items: center;
				flex-wrap: wrap;
				gap: 10rpx;
				font-size: 26rpx;
				color: #666;

				.uv-tag {
					margin-right: 5rpx;
				}
			}
		}
	}

	.checkbox-item,
	.radio-item {
		margin-right: 20rpx;
		margin-bottom: 10rpx;
	}

	.uv-radio-group,
	.uv-checkbox-group {
		display: flex;
		flex-wrap: wrap;
	}
</style>