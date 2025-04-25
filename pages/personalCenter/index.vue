<template>
	<layout>
		<!-- 自定义头部 -->
		<headerVue>
			<view class="title">
				<text class="text">个人中心</text>
			</view>
		</headerVue>

		<view class="profile-container">
			<!-- 用户信息卡片 -->
			<view class="user-card" @click="navigateTo('edit')">
				<view class="avatar-wrapper">
					<image :src="userInfo.avatar || '/static/avatar.gif'" mode="aspectFill" class="avatar" />
					<uv-icon name="camera" size="18" color="#fff" class="camera-icon" />
				</view>

				<view class="user-details">
					<text class="username">{{ userInfo.name || '点击登录' }}</text>
					<text class="user-id">学号: {{ userInfo.student_id || '----' }}</text>
					<view class="school-info">
						<text>{{ userInfo.school_name || '重庆邮电大学' }}</text>
						<text>{{ userInfo.college_name || '计算机科学与技术学院' }}</text>
						<text>{{ userInfo.class_name || '计算机科学与技术2023级1班' }}</text>
					</view>
				</view>

				<uv-icon name="arrow-right" size="18" color="#999" />
			</view>

			<!-- 功能入口网格 -->
			<view class="function-grid">
				<view v-for="item in functions" :key="item.id" class="function-item" @click="tip">
					<view class="icon-wrapper" :style="{ backgroundColor: item.bgColor }">
						<uv-icon :name="item.icon" size="20" :color="item.color" />
					</view>
					<text class="function-title">{{ item.title }}</text>
				</view>
			</view>

			<!-- 设置列表 -->
			<view class="settings-list">
				<view v-for="item in settings" :key="item.id" class="setting-item" @click="navigateTo(item.path)">
					<view class="setting-left">
						<uv-icon :name="item.icon" size="18" :color="item.color" />
						<text>{{ item.title }}</text>
					</view>
					<uv-icon name="arrow-right" size="16" color="#ccc" />
				</view>
			</view>

			<!-- 退出登录按钮 -->
			<view class="logout-btn" @click="handleLogout" v-if="isLogin">
				<text>退出登录</text>
			</view>
		</view>
	</layout>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import layout from '@/components/layout/index.vue'
	import headerVue from '@/components/header/index.vue'
	import {
		getUserInfo,
		clearAuth
	} from '@/utils/auth.js'
	import {
		getStudentById
	} from '@/api/student.js'
	import {
		getLoginStatus
	} from '@/utils/auth.js'
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
	})

	const isLogin = ref(getLoginStatus())
	console.log('isLogin:', isLogin)
	// 初始化用户信息
	const initInfo = async () => {
		try {
			const localUser = getUserInfo()
			if (localUser && localUser.student_id) {
				const res = await getStudentById(localUser.student_id)
				if (res.code === 200) {
					userInfo.value = {
						...userInfo.value,
						...res.data,
						student_id: localUser.student_id,
						name: localUser.name
					}
				}
			}
		} catch (error) {
			console.error('初始化用户信息失败:', error)
		}
	}

	function tip() {
		uni.showToast({
			title: '正在开发，敬请期待...',
			icon: 'none',
			duration: 2000
		})
	}
	const functions = ref([{
			id: 1,
			title: '我的收藏',
			icon: 'star',
			color: '#fff',
			bgColor: '#FF9500',
			path: '/pages/profile/favorites'
		},
		{
			id: 2,
			title: '我的预约',
			icon: 'calendar',
			color: '#fff',
			bgColor: '#34C759',
			path: '/pages/profile/reservations'
		},
		{
			id: 3,
			title: '我的评价',
			icon: 'edit-pen',
			color: '#fff',
			bgColor: '#5856D6',
			path: '/pages/profile/reviews'
		},
		{
			id: 4,
			title: '等待开发',
			icon: 'bell',
			color: '#fff',
			bgColor: '#FF2D55',
			path: '/pages/profile/notifications'
		}
	])

	const settings = ref([{
			id: 1,
			title: '主题设置',
			icon: 'setting',
			color: '#007AFF',
			path: 'theme'
		},
		{
			id: 2,
			title: '联系管理员',
			icon: 'kefu-ermai',
			color: '#AF52DE',
			path: 'admin'
		},
		{
			id: 3,
			title: '关于我们',
			icon: 'info-circle',
			color: '#FF9500',
			path: 'about'
		},
		{
			id: 4,
			title: '帮助中心',
			icon: 'question-circle',
			color: '#8E8E93',
			path: 'help'
		}
	])

	// 页面跳转
	const navigateTo = (path) => {
		if (!isLogin.value && path !== '/pages/login') {
			// 第一步：显示模态对话框（带倒计时）
			let seconds = 2
			uni.showModal({
				title: '未登录提示',
				content: `请先登录（${seconds}秒后自动跳转）`,
				showCancel: false,
				confirmText: '立即跳转',
				success: (res) => {
					if (res.confirm) {
						clearTimeout(timer)
						uni.redirectTo({
							url: '/pages/login/index'
						})
					}
				}
			})

			// 第二步：动态更新倒计时
			const timer = setInterval(() => {
				seconds--
				if (seconds <= 0) {
					clearInterval(timer)
					uni.redirectTo({
						url: '/pages/login/index'
					})
				} else {
					// 动态更新对话框内容（小程序可能需要特殊处理）
					uni.showModal({
						title: '未登录提示',
						content: `请先登录（${seconds}秒后自动跳转）`,
						showCancel: false,
						confirmText: '立即跳转'
					})
				}
			}, 1000)

			return
		}
		uni.navigateTo({
			url: path
		})
	}

	// 退出登录
	const handleLogout = () => {
		uni.showModal({
			title: '提示',
			content: '确定要退出登录吗？',
			success: (res) => {
				if (res.confirm) {
					clearAuth()
					uni.reLaunch({
						url: '/pages/login/index'
					})
				}
			}
		})
	}

	onMounted(() => {
		const localUser = getUserInfo()
		if (localUser) {
			initInfo()
		}
	})
</script>

<style lang="scss">
	.title {
		width: 100%;
		height: 100%;
		position: relative;


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
		padding: 24rpx;
		padding-bottom: 40rpx;

		.user-card {
			display: flex;
			align-items: center;
			padding: 32rpx;
			background-color: #fff;
			border-radius: 24rpx;
			margin-bottom: 24rpx;
			box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);

			.avatar-wrapper {
				position: relative;
				width: 120rpx;
				height: 120rpx;
				margin-right: 24rpx;

				.avatar {
					width: 100%;
					height: 100%;
					border-radius: 50%;
					background-color: #f0f0f0;
				}

				.camera-icon {
					position: absolute;
					right: 0;
					bottom: 0;
					background-color: rgba(0, 0, 0, 0.5);
					padding: 6rpx;
					border-radius: 50%;
				}
			}

			.user-details {
				flex: 1;

				.username {
					font-size: 32rpx;
					font-weight: 500;
					color: #333;
					margin-bottom: 8rpx;
					display: block;
				}

				.user-id {
					font-size: 24rpx;
					color: #999;
					margin-bottom: 12rpx;
					display: block;
				}

				.school-info {
					display: flex;
					flex-direction: column;
					gap: 8rpx;

					text {
						font-size: 24rpx;
						color: #666;
						background-color: #f7f7f7;
						padding: 4rpx 12rpx;
						border-radius: 16rpx;
						display: inline-block;
						margin-right: 8rpx;
						margin-bottom: 4rpx;
					}
				}
			}
		}

		.function-grid {
			display: grid;
			grid-template-columns: repeat(4, 1fr);
			gap: 16rpx;
			margin-bottom: 24rpx;

			.function-item {
				display: flex;
				flex-direction: column;
				align-items: center;
				background-color: #fff;
				padding: 24rpx 0;
				border-radius: 16rpx;
				box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);

				.icon-wrapper {
					width: 80rpx;
					height: 80rpx;
					border-radius: 50%;
					display: flex;
					align-items: center;
					justify-content: center;
					margin-bottom: 16rpx;
				}

				.function-title {
					font-size: 24rpx;
					color: #666;
				}
			}
		}

		.settings-list {
			background-color: #fff;
			border-radius: 16rpx;
			padding: 0 24rpx;
			margin-bottom: 24rpx;
			box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);

			.setting-item {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 28rpx 0;
				border-bottom: 1rpx solid #f5f5f5;

				&:last-child {
					border-bottom: none;
				}

				.setting-left {
					display: flex;
					align-items: center;

					text {
						font-size: 28rpx;
						color: #333;
						margin-left: 16rpx;
					}
				}
			}
		}

		.logout-btn {
			background-color: #fff;
			border-radius: 16rpx;
			padding: 28rpx;
			text-align: center;
			color: #FF2D55;
			font-size: 28rpx;
			font-weight: 500;
			box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
		}
	}
</style>