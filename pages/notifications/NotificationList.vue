<template>
	<view class="notification-container">
		<scroll-view class="custom-list" scroll-y refresher-enabled @refresherrefresh="onRefresh"
			@scrolltolower="loadMore">
			<view v-for="(item, index) in list" :key="item.id" class="list-item"
				:class="{'urgent-item': item.is_urgent, 'last-item': index === list.length - 1}"
				@click="handleItemClick(item)">
				<view class="item-icon">
					<uv-icon :name="item.is_urgent ? 'bell-fill' : 'file-text'"
						:color="item.is_urgent ? '#ff4d4f' : '#2979ff'" size="20" />
				</view>

				<view class="item-content">
					<view class="item-header">
						<text class="item-title">{{ item.title }}</text>
						<text v-if="item.is_urgent" class="urgent-tag">紧急</text>
					</view>
					<text class="item-time">{{ formatTime(item.created_at) }}</text>
					<view class="item-message-wrapper">
						<text class="item-message">{{ item.message }}</text>
						<text v-if="shouldShowMore(item.message)" class="view-more" @click.stop="handleViewMore(item)">
							查看更多
						</text>
					</view>
				</view>
			</view>

			<view v-if="loading" class="loading-state">
				<uv-loading mode="circle" color="#2979ff" />
				<text>加载中...</text>
			</view>

			<view v-if="noMore && list.length > 0" class="no-more">
				没有更多了
			</view>
		</scroll-view>

		<view v-if="!loading && list.length === 0" class="empty-state">
			<text class="empty-text">暂无通知</text>
			<text class="empty-subtext">暂时没有新的通知消息</text>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import {
		formatTime
	} from '@/utils/date'
	import {
		getAllNotifications
	} from '@/api/notification.js'
	import {
		getUserInfo
	} from '@/utils/auth.js'

	const props = defineProps({
		schoolId: {
			type: Number,
			required: true
		}
	})

	const list = ref([])
	const loading = ref(false)
	const page = ref(1)
	const pageSize = ref(10)
	const noMore = ref(false)

	const shouldShowMore = (message) => {
		if (!message) return false
		// 判断是否需要显示"查看更多"：超过80个字符或包含换行
		return message.length > 80 || message.includes('\n')
	}

	const fetchNotifications = async () => {
		try {
			loading.value = true
			const res = await getAllNotifications({
				student_id: getUserInfo().student_id,
				page: page.value,
				limit: pageSize.value
			})

			if (page.value === 1) {
				list.value = res.data.notifications
			} else {
				list.value = [...list.value, ...res.data.notifications]
			}

			noMore.value = res.data.notifications.length < pageSize.value
		} catch (err) {
			console.error('获取通知失败:', err)
			uni.showToast({
				title: '加载失败',
				icon: 'none'
			})
		} finally {
			loading.value = false
		}
	}

	const loadMore = () => {
		if (noMore.value || loading.value) return
		page.value++
		fetchNotifications()
	}

	const onRefresh = async () => {
		page.value = 1
		await fetchNotifications()
		uni.stopPullDownRefresh()
	}

	const handleItemClick = (item) => {
		uni.navigateTo({
			url: `NotificationDetail?id=${item.id}`
		})
	}

	const handleViewMore = (item) => {
		uni.navigateTo({
			url: `NotificationDetail?id=${item.id}`
		})
	}

	onMounted(() => {
		fetchNotifications()
	})
</script>

<style lang="scss">
	.notification-container {
		height: 100vh;
		padding: 24rpx;
		background-color: transparent;

		.custom-list {
			height: 100%;

			.list-item {
				display: flex;
				padding: 28rpx;
				margin-bottom: 20rpx;
				background-color: rgba(255, 255, 255, 0.9);
				border-radius: 16rpx;
				position: relative;
				transition: all 0.2s;

				&:active {
					transform: scale(0.99);
					opacity: 0.9;
				}

				&.urgent-item {
					background-color: rgba(255, 240, 240, 0.9);
					border-left: 6rpx solid #ff4d4f;
				}

				.item-icon {
					width: 72rpx;
					height: 72rpx;
					border-radius: 16rpx;
					background-color: rgba(41, 121, 255, 0.1);
					display: flex;
					align-items: center;
					justify-content: center;
					margin-right: 24rpx;

					.urgent-item & {
						background-color: rgba(255, 77, 79, 0.1);
					}
				}

				.item-content {
					flex: 1;

					.item-header {
						display: flex;
						align-items: center;
						margin-bottom: 8rpx;

						.item-title {
							font-size: 32rpx;
							font-weight: 500;
							color: #333;
							margin-right: 16rpx;
							flex: 1;
						}

						.urgent-tag {
							background-color: #ff4d4f;
							color: white;
							padding: 4rpx 16rpx;
							border-radius: 24rpx;
							font-size: 22rpx;
						}
					}

					.item-time {
						font-size: 24rpx;
						color: #999;
						display: block;
						margin-bottom: 12rpx;
					}

					.item-message-wrapper {
						position: relative;
						font-size: 28rpx;
						color: #666;
						line-height: 1.6;

						.item-message {
							display: -webkit-box;
							-webkit-line-clamp: 2;
							/* 限制为两行 */
							-webkit-box-orient: vertical;
							overflow: hidden;
							text-overflow: ellipsis;
							max-height: 3.2em;
							/* 两行高度 */
						}

						.view-more {
							position: absolute;
							right: 0;
							bottom: 0;
							background: linear-gradient(to right, transparent, #fff 30%);
							padding-left: 60rpx;
							color: #2979ff;
							font-size: 26rpx;
						}
					}
				}
			}

			.loading-state,
			.no-more {
				text-align: center;
				padding: 30rpx;
				color: #999;
				font-size: 28rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
			}
		}

		.empty-state {
			height: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			padding-top: 100rpx;

			.empty-text {
				color: #333;
				font-size: 32rpx;
				margin-top: 20rpx;
				font-weight: 500;
			}

			.empty-subtext {
				color: #999;
				font-size: 26rpx;
				margin-top: 10rpx;
			}
		}
	}
</style>