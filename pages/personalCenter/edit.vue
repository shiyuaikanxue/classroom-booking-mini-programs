<template>
	<layout>
		<headerVue>
			<view class="title">
				<view class="back" @click="goBack">
					<uv-icon name="arrow-left" color="#2979ff" size="24"></uv-icon>
				</view>
				<text class="text">个人信息</text>
			</view>
		</headerVue>

		<view class="profile-container">
			<!-- 头像展示 -->
			<view class="avatar-display">
				<image :src="userInfo.avatar || '/static/avatar.gif'" mode="aspectFill" class="avatar" />
			</view>

			<!-- 信息卡片 -->
			<view class="info-card">
				<!-- 基础信息 -->
				<view class="info-section">
					<view class="info-item">
						<text class="label">学号</text>
						<text class="value">{{ userInfo.student_id || '--' }}</text>
					</view>
					<view class="info-item">
						<text class="label">姓名</text>
						<text class="value">{{ userInfo.name || '--' }}</text>
					</view>
				</view>

				<!-- 学校信息 -->
				<view class="info-section">
					<view class="section-title">
						<uv-icon name="home" size="18" color="#666"></uv-icon>
						<text>学校信息</text>
					</view>
					<view class="info-item">
						<text class="label">学校</text>
						<text class="value">{{ userInfo.school_name || '--' }}</text>
					</view>
					<view class="info-item">
						<text class="label">学院</text>
						<text class="value">{{ userInfo.college_name || '--' }}</text>
					</view>
					<view class="info-item">
						<text class="label">专业</text>
						<text class="value">{{ userInfo.major_name || '--' }}</text>
					</view>
					<view class="info-item">
						<text class="label">班级</text>
						<text class="value">{{ userInfo.class_name || '--' }}</text>
					</view>
				</view>

				<!-- 联系方式 -->
				<view class="info-section">
					<view class="section-title">
						<uv-icon name="phone" size="18" color="#666"></uv-icon>
						<text>联系方式</text>
					</view>
					<view class="info-item">
						<text class="label">手机号</text>
						<text class="value">{{ userInfo.phone || '--' }}</text>
					</view>
					<view class="info-item">
						<text class="label">邮箱</text>
						<text class="value">{{ userInfo.email || '--' }}</text>
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
	import layout from '@/components/layout/index.vue';
	import headerVue from '@/components/header/index.vue';
	import {
		getUserInfo
	} from '@/utils/auth.js';
	import {
		getStudentById
	} from '@/api/student.js';

	const userInfo = ref({
		student_id: '',
		name: '',
		avatar: '',
		school_name: '',
		college_name: '',
		class_name: '',
		major_name: '',
		email: '',
		phone: ''
	});

	// 初始化数据
	const initData = async () => {
		try {
			const localUser = getUserInfo();
			if (localUser?.student_id) {
				const res = await getStudentById(localUser.student_id);
				if (res.code === 200) {
					userInfo.value = {
						...res.data,
						student_id: localUser.student_id,
						name: localUser.name || ''
					};
				}
			}
		} catch (error) {
			console.error('数据加载失败:', error);
			uni.showToast({
				title: '数据加载失败',
				icon: 'none'
			});
		}
	};

	// 返回上一页
	const goBack = () => {
		uni.navigateBack();
	};

	onMounted(() => {
		initData();
	});
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
		}
	}

	.profile-container {
		padding: 30rpx;

		.avatar-display {
			display: flex;
			justify-content: center;
			margin: 40rpx 0;

			.avatar {
				width: 200rpx;
				height: 200rpx;
				border-radius: 50%;
				border: 6rpx solid #f5f5f5;
				box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.08);
			}
		}

		.info-card {
			background-color: #fff;
			border-radius: 24rpx;
			padding: 30rpx;
			box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.05);

			.info-section {
				margin-bottom: 40rpx;

				&:last-child {
					margin-bottom: 0;
				}

				.section-title {
					display: flex;
					align-items: center;
					margin-bottom: 24rpx;
					padding-bottom: 16rpx;
					border-bottom: 1rpx solid #f5f5f5;

					text {
						margin-left: 10rpx;
						font-size: 28rpx;
						color: #666;
						font-weight: 500;
					}
				}

				.info-item {
					display: flex;
					justify-content: space-between;
					padding: 20rpx 0;
					border-bottom: 1rpx dashed #f0f0f0;

					&:last-child {
						border-bottom: none;
					}

					.label {
						font-size: 28rpx;
						color: #999;
					}

					.value {
						font-size: 28rpx;
						color: #333;
						font-weight: 500;
						max-width: 60%;
						text-align: right;
					}
				}
			}
		}
	}
</style>