<template>
	<layout>
		<headerVue>
			<view class="title">
				<view class="back" @click="goBack">
					<uv-icon name="arrow-left" color="#2979ff" size="24"></uv-icon>
				</view>
				<text class="text">{{notification.title}}</text>
			</view>
		</headerVue>

		<view class="detail-container">
			<!-- 通知标题区域 -->
			<view class="header-section" :class="{'urgent-header': notification.is_urgent}">
				<view class="title-wrapper">
					<text class="detail-title">{{notification.title}}</text>
					<text v-if="notification.is_urgent" class="urgent-tag">紧急</text>
				</view>
				<text class="time-text">{{formatTime(notification.created_at)}}</text>
			</view>

			<!-- 通知内容区域 -->
			<view class="content-section">
				<text class="content-text">{{notification.message}}</text>
			</view>

			<!-- 附件区域（如果有） -->
			<view v-if="notification.attachments && notification.attachments.length > 0" class="attachment-section">
				<text class="section-title">相关附件</text>
				<view class="attachment-list">
					<view v-for="(file, index) in notification.attachments" :key="index" class="attachment-item"
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
	} from 'vue';
	import {
		onLoad
	} from '@dcloudio/uni-app';
	import layout from '@/components/layout/index.vue';
	import headerVue from '@/components/header/index.vue';
	import {
		formatTime
	} from '@/utils/date';
	import {
		getNotificationById
	} from '@/api/notification.js';

	const notification = ref({
		id: '',
		title: '',
		message: '',
		is_urgent: false,
		created_at: '',
		attachments: []
	});

	// 获取路由参数
	onLoad((options) => {
		if (options.id) {
			fetchDetail(options.id);
		}
	});

	// 获取详情数据
	const fetchDetail = async (id) => {
		try {
			uni.showLoading({
				title: '加载中...'
			});
			const res = await getNotificationById(id);
			if (res.code === 200) {
				notification.value = res.data;
			}
		} catch (error) {
			console.error('获取详情失败:', error);
			uni.showToast({
				title: '加载失败',
				icon: 'none'
			});
		} finally {
			uni.hideLoading();
		}
	};

	// 返回上一页
	const goBack = () => {
		uni.navigateBack();
	};

	// 下载附件
	const downloadFile = (file) => {
		uni.showLoading({
			title: '下载中...'
		});
		uni.downloadFile({
			url: file.url,
			success: (res) => {
				if (res.statusCode === 200) {
					uni.openDocument({
						filePath: res.tempFilePath,
						fileType: file.type || 'pdf',
						showMenu: true
					});
				}
			},
			complete: () => {
				uni.hideLoading();
			}
		});
	};

	// 格式化文件大小
	const formatFileSize = (bytes) => {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	};
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

			&.urgent-header {
				border-left: 6rpx solid #ff4d4f;
				padding-left: 20rpx;
				margin-left: -30rpx;
			}

			.title-wrapper {
				display: flex;
				align-items: center;
				margin-bottom: 16rpx;

				.detail-title {
					font-size: 36rpx;
					font-weight: 600;
					color: #333;
					margin-right: 20rpx;
				}

				.urgent-tag {
					background-color: #ff4d4f;
					color: white;
					padding: 4rpx 16rpx;
					border-radius: 24rpx;
					font-size: 24rpx;
				}
			}

			.time-text {
				font-size: 26rpx;
				color: #999;
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