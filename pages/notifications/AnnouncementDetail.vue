<template>
	<layout>
		<headerVue>
			<view class="title">
				<view class="back" @click="goBack">
					<uv-icon name="arrow-left" color="#2979ff" size="24"></uv-icon>
				</view>
				<text class="text">{{announcement.title}}</text>
			</view>
		</headerVue>

		<view class="detail-container">
			<!-- 公告头部信息 -->
			<view class="header-section" :class="{
        'top-header': announcement.is_top,
        'urgent-header': announcement.is_urgent
      }">
				<view class="title-wrapper">
					<text class="detail-title">{{announcement.title}}</text>
					<view class="tags">
						<text v-if="announcement.is_top" class="tag top-tag">置顶</text>
						<text v-if="announcement.is_urgent" class="tag urgent-tag">紧急</text>
					</view>
				</view>
				<view class="meta-info">
					<text class="time-text">{{formatTime(announcement.created_at)}}</text>
					<text class="author-text">发布者：{{announcement.author || '系统管理员'}}</text>
				</view>
			</view>

			<!-- 公告内容区域 -->
			<view class="content-section">
				<text class="content-text">{{announcement.content}}</text>
			</view>

			<!-- 附件区域 -->
			<view v-if="announcement.attachments && announcement.attachments.length > 0" class="attachment-section">
				<text class="section-title">相关附件</text>
				<view class="attachment-list">
					<view v-for="(file, index) in announcement.attachments" :key="index" class="attachment-item"
						@click="downloadFile(file)">
						<uv-icon name="file-text" size="20" color="#2979ff"></uv-icon>
						<text class="file-name">{{file.name}}</text>
						<text class="file-size">({{formatFileSize(file.size)}})</text>
					</view>
				</view>
			</view>
		</view>
	</layout>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import {
		onLoad
	} from '@dcloudio/uni-app'
	import layout from '@/components/layout/index.vue'
	import headerVue from '@/components/header/index.vue'
	import {
		formatTime
	} from '@/utils/date'
	import {
		getAnnouncementById
	} from '@/api/announcement.js'

	const announcement = ref({
		id: '',
		title: '',
		content: '',
		is_top: false,
		is_urgent: false,
		created_at: '',
		author: '',
		attachments: []
	})

	// 获取路由参数
	onLoad((options) => {
		if (options.id) {
			fetchDetail(options.id)
		}
	})

	// 获取详情数据
	const fetchDetail = async (id) => {
		try {
			uni.showLoading({
				title: '加载中...'
			})
			const res = await getAnnouncementById(id)
			if (res.code === 200) {
				announcement.value = res.data
			}
		} catch (error) {
			console.error('获取详情失败:', error)
			uni.showToast({
				title: '加载失败',
				icon: 'none'
			})
		} finally {
			uni.hideLoading()
		}
	}

	// 返回上一页
	const goBack = () => {
		uni.navigateBack()
	}

	// 下载附件
	const downloadFile = (file) => {
		uni.showLoading({
			title: '下载中...'
		})
		uni.downloadFile({
			url: file.url,
			success: (res) => {
				if (res.statusCode === 200) {
					uni.openDocument({
						filePath: res.tempFilePath,
						fileType: file.type || '',
						showMenu: true
					})
				}
			},
			complete: () => {
				uni.hideLoading()
			}
		})
	}

	// 格式化文件大小
	const formatFileSize = (bytes) => {
		if (bytes === 0) return '0 Bytes'
		const k = 1024
		const sizes = ['Bytes', 'KB', 'MB', 'GB']
		const i = Math.floor(Math.log(bytes) / Math.log(k))
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
	}
</script>

<style lang="scss">
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
			max-width: 70%;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}

	.detail-container {
		padding: 30rpx;

		.header-section {
			margin-bottom: 40rpx;
			padding-bottom: 20rpx;
			border-bottom: 1rpx solid #f0f0f0;

			&.top-header {
				border-left: 6rpx solid #ffcc00;
				padding-left: 20rpx;
				margin-left: -30rpx;
			}

			&.urgent-header {
				border-left: 6rpx solid #ff4d4f;
				padding-left: 20rpx;
				margin-left: -30rpx;
			}

			.title-wrapper {
				margin-bottom: 16rpx;

				.detail-title {
					font-size: 36rpx;
					font-weight: 600;
					color: #333;
					margin-bottom: 12rpx;
					display: block;
				}

				.tags {
					display: flex;
					gap: 12rpx;

					.tag {
						font-size: 24rpx;
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
			}

			.meta-info {
				display: flex;
				justify-content: space-between;

				.time-text,
				.author-text {
					font-size: 26rpx;
					color: #999;
				}
			}
		}

		.content-section {
			background-color: #fff;
			border-radius: 16rpx;
			padding: 30rpx;
			margin-bottom: 30rpx;
			box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

			.content-text {
				font-size: 30rpx;
				color: #333;
				line-height: 1.8;
				white-space: pre-wrap;
			}
		}

		.attachment-section {
			background-color: #fff;
			border-radius: 16rpx;
			padding: 30rpx;
			box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

			.section-title {
				font-size: 28rpx;
				color: #666;
				font-weight: 500;
				margin-bottom: 20rpx;
				display: block;
			}

			.attachment-list {
				.attachment-item {
					display: flex;
					align-items: center;
					padding: 20rpx 0;
					border-bottom: 1rpx dashed #eee;

					&:last-child {
						border-bottom: none;
					}

					.file-name {
						font-size: 28rpx;
						color: #333;
						margin-left: 15rpx;
						flex: 1;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}

					.file-size {
						font-size: 24rpx;
						color: #999;
						margin-left: 15rpx;
					}
				}
			}
		}
	}
</style>