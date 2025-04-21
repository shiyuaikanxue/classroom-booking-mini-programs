<!-- components/reservation/ReservationList.vue -->
<template>
	<view class="reservation-container">
		<!-- 使用uv-ui的空状态组件 -->
		<uv-empty v-if="list.length === 0">
			<text class="empty-text">暂无预约记录</text>
		</uv-empty>
		<!-- 使用uv-ui的列表组件 -->
		<uv-list v-else>
			<view class="uv-list-item reservation-item" v-for="(item, index) in list" :key="item.reservation_id">
				<view class="header">
					<uv-tags :text="getStatusText(item.status)" :type="getStatusType(item.status)" size="mini" />
					<text class="activity-name">{{ item.activity_name }}</text>
					<uv-tags v-if="canCancel(item.status)" text="取消" type="primary" size="mini" :plain="true"
						@click.stop="handleCancelClick(item)" />
					<uv-tags v-if="canApplay(item.status)" text="编辑" type="primary" size="mini" :plain="true"
						@click="handleEdit(item)" />
					<uv-tags type="error" text="删除" size="mini" :plain="true" @click.stop="handleDeleteClick(item)" />
				</view>
				<view class="content">
					<view class="info-row">
						<uv-icon name="map" size="16" color="#666"></uv-icon>
						<text class="info-text">{{ item.classroom_location }} {{ item.classroom_code }}</text>
					</view>

					<view class="info-row">
						<uv-icon name="clock" size="16" color="#666"></uv-icon>
						<text class="info-text">{{ formatDate(item.date) }} {{ item.time_slot }}</text>
					</view>

					<view class="info-row">
						<uv-icon name="account" size="16" color="#666"></uv-icon>
						<text class="info-text">{{ item.teacher_name }}老师</text>
					</view>

					<view class="info-row" v-if="item.description">
						<uv-icon name="edit-pen" size="16" color="#666"></uv-icon>
						<text class="info-text">{{ item.description }}</text>
					</view>
				</view>
				<view class="footer">
					<text class="participants">参与人数: {{ item.participants || 0 }}人</text>
				</view>
			</view>
		</uv-list>

		<!-- 下拉刷新 -->
		<uv-loadmore :status="loadStatus" @loadmore="loadMore" />
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import {
		getReservationList,
		deleteReservation,
		cancelReservation
	} from '@/api/reservation'

	// 预约列表数据
	const list = ref([])
	const page = ref(1)
	const loadStatus = ref('loadmore')


	// 格式化日期显示
	const formatDate = (dateString) => {
		const date = new Date(dateString)
		return `${date.getMonth()+1}月${date.getDate()}日`
	}
	const handleCancelClick = (item) => {
		uni.showModal({
			title: '确认取消',
			content: `确定要取消【${item.activity_name}】预约吗？`,
			confirmText: '确认取消',
			confirmColor: '#dd524d',
			cancelText: '再想想',
			success: async (res) => {
				if (res.confirm) {
					try {
						await cancelReservation(item.reservation_id)
						uni.showToast({
							title: '取消成功',
							icon: 'success'
						})
						refresh() // 刷新列表
					} catch (error) {
						uni.showToast({
							title: '取消失败',
							icon: 'error'
						})
					}
				}
			}
		})
	}
	// 删除预约操作
	const handleDeleteClick = (item) => {
		uni.showModal({
			title: '确认删除',
			content: `确定要删除【${item.activity_name}】预约记录吗？`,
			confirmText: '确认删除',
			confirmColor: '#dd524d',
			cancelText: '再想想',
			success: async (res) => {
				if (res.confirm) {
					try {
						await deleteReservation(item.reservation_id)
						uni.showToast({
							title: '删除成功',
							icon: 'success'
						})
						refresh() // 刷新列表
					} catch (error) {
						uni.showToast({
							title: '删除失败',
							icon: 'error'
						})
					}
				}
			}
		})
	}
	const handleEdit = (item) => {
		uni.navigateTo({
			url: `apply?reservation_id=${item.reservation_id}`
		})
	}
	// 获取预约列表
	const fetchData = async () => {
		try {
			loadStatus.value = 'loading'
			const res = await getReservationList({
				skip: (page.value - 1) * 10,
				limit: 10,
				student_id: 22 // 根据实际需求传入当前学生ID
			})

			if (page.value === 1) {
				list.value = res.data.reservations
			} else {
				list.value = [...list.value, ...res.data.reservations]
			}

			loadStatus.value = res.data.reservations.length < 10 ? 'nomore' : 'loadmore'
		} catch (error) {
			console.error(error)
			loadStatus.value = 'error'
		}
	}

	// 加载更多
	const loadMore = () => {
		if (loadStatus.value === 'nomore') return
		page.value++
		fetchData()
	}

	// 刷新数据
	const refresh = () => {
		page.value = 1
		fetchData()
	}
	const canCancel = (status) => {
		return status === 'pending' || status === 'approved'
	}
	const canApplay = (status) => {
		return status === 'rejected' || status === 'cancelled' || status === 'pending'
	}
	// 获取状态文本
	const getStatusText = (status) => {
		const texts = {
			pending: '待审核',
			approved: '已通过',
			rejected: '已拒绝',
			cancelled: '已取消'
		}
		return texts[status] || '未知状态'
	}

	// 获取状态标签类型
	const getStatusType = (status) => {
		const types = {
			pending: 'warning',
			approved: 'success',
			rejected: 'error',
			cancelled: 'info'
		}
		return types[status] || 'default'
	}

	onMounted(() => {
		fetchData()
	})

	// 暴露刷新方法
	defineExpose({
		refresh
	})
</script>

<style lang="scss" scoped>
	.reservation-container {
		height: 100%;
		padding-bottom: 120rpx;
		background-color: transparent;
		overflow: scroll;
	}

	.empty-text {
		color: #909399;
		font-size: 28rpx;
		margin-top: 20rpx;
	}

	/* 正确写法（微信小程序专用） */
	:host ::v-deep .uv-list {
		background-color: transparent !important;
	}

	.reservation-item {
		padding: 24rpx;
		background-color: transparent;
		border-radius: 12rpx;
		margin: 16rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);

		.header {
			display: flex;
			align-items: center;
			margin-bottom: 16rpx;
			column-gap: 16rpx;

			.activity-name {
				font-size: 32rpx;
				font-weight: bold;
				flex: 1;
			}

			.btn-left {
				margin-left: 20rpx;
			}
		}

		.content {
			padding-left: 8rpx;

			.info-row {
				display: flex;
				align-items: center;
				margin-bottom: 12rpx;
				font-size: 28rpx;
				color: #666;

				.info-text {
					margin-left: 12rpx;
					flex: 1;
				}
			}
		}

		.footer {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top: 20rpx;
			padding-top: 16rpx;
			border-top: 1rpx solid #f5f5f5;

			.participants {
				font-size: 26rpx;
				color: #999;
			}
		}
	}
</style>