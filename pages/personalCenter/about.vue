<template>
	<layout>
		<!-- 自定义头部 -->
		<headerVue>
			<view class="title">
				<view class="back" @click="goBack">
					<uv-icon name="arrow-left" color="#2979ff" size="24"></uv-icon>
				</view>
				<text class="text">关于我们</text>
			</view>
		</headerVue>

		<view class="about-container">
			<!-- 学校logo和信息 -->
			<view class="school-card">
				<text class="school-name">重庆邮电大学</text>
				<text class="slogan">修德 博学 求实 创新</text>
			</view>

			<!-- 应用信息 -->
			<view class="app-card">
				<view class="info-item">
					<uv-icon name="clock" size="18" color="#007AFF"></uv-icon>
					<text class="label">当前版本</text>
					<text class="value">v0.0.2</text>
				</view>
				<view class="info-item">
					<uv-icon name="calendar" size="18" color="#007AFF"></uv-icon>
					<text class="label">更新时间</text>
					<text class="value">2025-04-25</text>
				</view>
				<view class="info-item">
					<uv-icon name="home" size="18" color="#007AFF"></uv-icon>
					<text class="label">官方网站</text>
					<text class="value link" @click="openWebsite">www.cqupt.edu.cn</text>
				</view>
			</view>

			<!-- 开发团队 -->
			<view class="team-card">
				<view class="section-title">
					<uv-icon name="team" size="18" color="#FF9500"></uv-icon>
					<text>开发团队</text>
				</view>
				<view class="team-member" v-for="(member, index) in teamMembers" :key="index">
					<view class="member-info">
						<text class="name">{{ member.name }}</text>
						<text class="role">{{ member.role }} <text class="email">联系方式：{{member.email}}</text></text>
					</view>
					<view class="contact" @click="contactMember(member)">
						<uv-icon name="kefu-ermai" size="18" color="#AF52DE"></uv-icon>
					</view>
				</view>
			</view>

			<!-- 版权信息 -->
			<view class="copyright">
				<text>© 2024 重庆邮电大学 计算机科学与技术学院</text>
				<text>All Rights Reserved</text>
			</view>
		</view>
	</layout>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import layout from '@/components/layout/index.vue'
	import headerVue from '@/components/header/index.vue'

	// 返回上一页
	const goBack = () => {
		uni.navigateBack()
	}

	// 开发团队数据
	const teamMembers = ref([{
			name: '杨莎莎',
			role: '项目指导',
			email: 'yangss@cqupt.edu.cn'
		},
		{
			name: '余泽鹏',
			role: '前端开发',
			email: 'yzp9882@gmail.com'
		},
		{
			name: '余泽鹏',
			role: '后端开发',
			email: 'yzp9882@gmail.com'
		}
	])

	// 打开官网
	const openWebsite = () => {
		uni.setClipboardData({
			data: 'https://www.cqupt.edu.cn',
			success: () => {
				uni.showToast({
					title: '官网地址已复制',
					icon: 'success'
				})
			}
		})
	}

	// 联系团队成员
	const contactMember = (member) => {
		uni.showModal({
			title: `联系${member.name}`,
			content: `是否发送邮件到 ${member.email}?`,
			success: (res) => {
				if (res.confirm) {
					uni.setClipboardData({
						data: member.email,
						success: () => {
							uni.showToast({
								title: '邮箱已复制',
								icon: 'success'
							})
						}
					})
				}
			}
		})
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
		}
	}

	.about-container {
		padding: 30rpx;

		.school-card {
			display: flex;
			flex-direction: column;
			align-items: center;
			margin-bottom: 40rpx;
			padding: 30rpx 0;
			background-color: #fff;
			border-radius: 16rpx;
			box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

			.logo {
				width: 150rpx;
				height: 150rpx;
				margin-bottom: 20rpx;
			}

			.school-name {
				font-size: 36rpx;
				font-weight: bold;
				color: #333;
				margin-bottom: 10rpx;
			}

			.slogan {
				font-size: 26rpx;
				color: #666;
			}
		}

		.app-card {
			background-color: #fff;
			border-radius: 16rpx;
			padding: 0 30rpx;
			margin-bottom: 30rpx;
			box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

			.info-item {
				display: flex;
				align-items: center;
				padding: 30rpx 0;
				border-bottom: 1rpx solid #f5f5f5;

				&:last-child {
					border-bottom: none;
				}

				.label {
					font-size: 28rpx;
					color: #666;
					margin-left: 20rpx;
					flex: 1;
				}

				.value {
					font-size: 28rpx;
					color: #333;

					&.link {
						color: #007AFF;
						text-decoration: underline;
					}
				}
			}
		}

		.team-card {
			background-color: #fff;
			border-radius: 16rpx;
			padding: 30rpx;
			margin-bottom: 30rpx;
			box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

			.section-title {
				display: flex;
				align-items: center;
				margin-bottom: 30rpx;

				text {
					font-size: 30rpx;
					font-weight: bold;
					color: #333;
					margin-left: 10rpx;
				}
			}

			.team-member {
				display: flex;
				align-items: center;
				padding: 20rpx 0;
				border-bottom: 1rpx solid #f5f5f5;

				&:last-child {
					border-bottom: none;
				}

				.avatar {
					width: 80rpx;
					height: 80rpx;
					border-radius: 50%;
					margin-right: 20rpx;
				}

				.member-info {
					flex: 1;

					.name {
						font-size: 28rpx;
						color: #333;
						display: block;
					}

					.role {
						font-size: 24rpx;
						color: #999;
						.email{
							margin-left: 20rpx;
						}
					}
				}

				.contact {
					padding: 10rpx;
				}
			}
		}

		.copyright {
			display: flex;
			flex-direction: column;
			align-items: center;
			margin-top: 40rpx;

			text {
				font-size: 24rpx;
				color: #999;
				margin-bottom: 10rpx;
			}
		}
	}
</style>