<template>
	<layout>
		<!-- 自定义头部 -->
		<headerVue>
			<view class="title">
				<view class="back" @click="goBack">
					<uv-icon name="arrow-left" color="#2979ff" size="24"></uv-icon>
				</view>
				<text class="text">联系管理员</text>
			</view>
		</headerVue>

		<view class="admin-container">
			<!-- 紧急联系提示 -->
			<view class="emergency-notice">
				<uv-alert type="warning" description="紧急问题请直接电话联系" :closable="false"></uv-alert>
			</view>

			<!-- 管理员列表 -->
			<view class="admin-list">
				<view class="section-title">
					<uv-icon name="team" size="18" color="#FF9500"></uv-icon>
					<text>教务管理员</text>
				</view>

				<view class="admin-card" v-for="(admin, index) in admins" :key="index">
					<image src="/static/admin.png" mode="aspectFill" class="avatar"></image>
					<view class="admin-info">
						<text class="name">{{ admin.name }}</text>
						<text class="department">{{ admin.department }}</text>
						<text class="responsibility">负责: {{ admin.responsibility }}</text>
					</view>
					<view class="contact-btns">
						<button class="contact-btn phone" @click="makePhoneCall(admin.phone)">
							<uv-icon name="phone" size="18" color="#fff"></uv-icon>
						</button>
					</view>
				</view>
			</view>

			<!-- 办公信息 -->
			<view class="office-info">
				<view class="info-item">
					<uv-icon name="map" size="18" color="#34C759"></uv-icon>
					<text class="label">办公地点</text>
					<text class="value">重庆邮电大学教务处(第三教学楼201室)</text>
				</view>
				<view class="info-item">
					<uv-icon name="clock" size="18" color="#34C759"></uv-icon>
					<text class="label">办公时间</text>
					<text class="value">工作日 8:30-12:00, 14:00-17:30</text>
				</view>
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
	import {
		getAdmins
	} from '@/api/admin.js'
	import {
		getUserInfo
	} from '@/utils/auth.js'
	// 返回上一页
	const goBack = () => {
		uni.navigateBack()
	}
	const userinfo = getUserInfo()
	const initAdmins = async () => {
		try {
			const res = await getAdmins(userinfo.school_id)
			if (res.code === 200) {
				admins.value = res.data.admins.map(item => {
					return {
						name: item.username,
						department: item.office_location,
						responsibility: item.responsibility,
						phone: item.phone_number,
					}
				})
			}
		} catch (err) {
			console.error(err)
		}

	}
	const init = () => {
		initAdmins()
	}
	init()

	// 管理员数据
	const admins = ref([{
			name: '张老师',
			department: '教务处',
			responsibility: '教室预约审核',
			phone: '023-62460111',
		},
		{
			name: '李老师',
			department: '后勤处',
			responsibility: '设备维护报修',
			phone: '023-62460222',
		}
	])

	// 问题类型选项
	const problemTypes = ref([
		'教室预约问题',
		'设备报修',
		'账号问题',
		'系统建议',
		'其他问题'
	])

	// 表单数据
	const form = ref({
		type: '',
		contact: '',
		description: ''
	})

	// 拨打电话
	const makePhoneCall = (phone) => {
		uni.makePhoneCall({
			phoneNumber: phone
		})
	}

	// 发送邮件
	const sendEmail = (email) => {
		uni.setClipboardData({
			data: email,
			success: () => {
				uni.showToast({
					title: '邮箱已复制',
					icon: 'success'
				})
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

	.admin-container {
		padding: 30rpx;

		.emergency-notice {
			margin-bottom: 30rpx;
		}

		.section-title {
			display: flex;
			align-items: center;
			margin: 30rpx 0 20rpx;
			padding-left: 10rpx;
			font-size: 28rpx;
			font-weight: bold;
			color: #333;

			text {
				margin-left: 10rpx;
			}
		}

		.admin-list {
			background-color: #fff;
			border-radius: 16rpx;
			padding: 20rpx;
			margin-bottom: 30rpx;
			box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

			.admin-card {
				display: flex;
				align-items: center;
				padding: 25rpx 0;
				border-bottom: 1rpx solid #f5f5f5;

				&:last-child {
					border-bottom: none;
				}

				.avatar {
					width: 100rpx;
					height: 100rpx;
					border-radius: 50%;
					margin-right: 20rpx;
				}

				.admin-info {
					flex: 1;

					.name {
						font-size: 30rpx;
						color: #333;
						font-weight: 500;
						display: block;
						margin-bottom: 8rpx;
					}

					.department {
						font-size: 24rpx;
						color: #666;
						display: block;
						margin-bottom: 5rpx;
					}

					.responsibility {
						font-size: 24rpx;
						color: #999;
					}
				}

				.contact-btns {
					display: flex;
					flex-direction: column;
					gap: 15rpx;

					.contact-btn {
						width: 60rpx;
						height: 60rpx;
						border-radius: 50%;
						display: flex;
						align-items: center;
						justify-content: center;
						padding: 0;
						margin: 0;

						&.phone {
							background-color: #007AFF;
						}

						&.email {
							background-color: #FF9500;
						}
					}
				}
			}
		}

		.office-info {
			background-color: #fff;
			border-radius: 16rpx;
			padding: 25rpx;
			box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

			.info-item {
				display: flex;
				align-items: flex-start;
				padding: 20rpx 0;

				&:first-child {
					border-bottom: 1rpx solid #f5f5f5;
				}

				.label {
					font-size: 28rpx;
					color: #666;
					margin-left: 15rpx;
					width: 150rpx;
				}

				.value {
					font-size: 28rpx;
					color: #333;
					flex: 1;
				}
			}
		}
	}
</style>