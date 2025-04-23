<template>
	<view class="announcement-container">
		<!-- 自定义列表容器 -->
		<scroll-view class="announcement-list" scroll-y refresher-enabled @refresherrefresh="onRefresh"
			@scrolltolower="loadMore">
			<!-- 公告卡片列表 -->
			<view v-for="item in list" :key="item.id" class="announcement-card" :class="{
          'top-card': item.is_top,
          'urgent-card': item.is_urgent
        }">
				<!-- 卡片头部 -->
				<view class="card-header">
					<view class="tags">
						<view v-if="item.is_top" class="tag top-tag">置顶</view>
						<view v-if="item.is_urgent" class="tag urgent-tag">紧急</view>
					</view>
					<text class="time">{{ formatTime(item.created_at) }}</text>
				</view>

				<!-- 卡片标题 -->
				<text class="card-title">{{ item.title }}</text>

				<!-- 卡片内容 -->
				<text class="card-content">{{ item.content }}</text>

				<!-- 底部装饰线 -->
				<view class="card-divider"></view>
			</view>

			<!-- 加载状态 -->
			<view v-if="loading" class="loading-state">
				<uv-loading mode="circle" color="#2979ff" />
				<text>加载中...</text>
			</view>

			<!-- 没有更多了 -->
			<view v-if="noMore && list.length > 0" class="no-more">
				没有更多了
			</view>
		</scroll-view>

		<!-- 空状态 -->
		<view v-if="!loading && list.length === 0" class="empty-state">
			<text class="empty-text">暂无公告</text>
			<text class="empty-subtext">暂时没有新的公告消息</text>
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
		getUserInfo
	} from '@/utils/auth.js'
	import {
		getAllAnnouncements
	} from '@/api/announcement.js'

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

	const fetchAnnouncements = async () => {
		try {
			loading.value = true

			const res = await getAllAnnouncements({
				school_id: getUserInfo().school_id,
				page: page.value,
				limit: pageSize.value,
				status: 'published'
			})

			if (page.value === 1) {
				list.value = res.data.announcements
			} else {
				list.value = [...list.value, ...res.data.announcements]
			}

			noMore.value = res.data.announcements.length < pageSize.value
		} catch (err) {
			console.error('获取公告失败:', err)
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
		fetchAnnouncements()
	}

	const onRefresh = async () => {
		page.value = 1
		await fetchAnnouncements()
		uni.stopPullDownRefresh()
	}

	onMounted(() => {
		fetchAnnouncements()
	})
</script>

<style lang="scss">
	.announcement-container {
		height: 100vh;
		padding: 24rpx;
		background-color: transparent;

		.announcement-list {
			height: 100%;

			.announcement-card {
				background-color: #fff;
				border-radius: 16rpx;
				padding: 28rpx;
				margin-bottom: 24rpx;
				box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);
				position: relative;
				overflow: hidden;

				&.top-card {
					border-left: 6rpx solid #ffcc00;
				}

				&.urgent-card {
					border-left: 6rpx solid #ff4d4f;
				}

				.card-header {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 20rpx;

					.tags {
						display: flex;
						gap: 12rpx;

						.tag {
							font-size: 22rpx;
							padding: 4rpx 16rpx;
							border-radius: 24rpx;

							&.top-tag {
								background-color: #fff8e6;
								color: #ff9900;
								border: 1rpx solid #ffcc00;
							}

							&.urgent-tag {
								background-color: #fff0f0;
								color: #ff4d4f;
								border: 1rpx solid #ff9999;
							}
						}
					}

					.time {
						font-size: 24rpx;
						color: #999;
					}
				}

				.card-title {
					font-size: 32rpx;
					font-weight: 500;
					color: #333;
					display: block;
					margin-bottom: 16rpx;
					line-height: 1.4;
				}

				.card-content {
					font-size: 28rpx;
					color: #666;
					line-height: 1.6;
					display: -webkit-box;
					-webkit-line-clamp: 3;
					-webkit-box-orient: vertical;
					overflow: hidden;
					text-overflow: ellipsis;
				}

				.card-divider {
					height: 1px;
					background-color: #f0f0f0;
					margin-top: 24rpx;
					transform: scaleY(0.5);
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

			.empty-image {
				width: 300rpx;
				height: 300rpx;
				opacity: 0.6;
			}

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