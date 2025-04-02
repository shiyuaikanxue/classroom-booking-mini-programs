<template>
	<view class="login-container">
		<!-- 顶部logo -->
		<view class="logo-container">
			<image class="logo" src="/static/logo.png"></image>
			<text class="title">欢迎登录</text>
		</view>

		<!-- 登录表单 -->
		<view class="form-container">
			<uv-form :model="form" ref="loginForm">
				<uv-form-item prop="username" label-width="0">
					<uv-input v-model="form.username" placeholder="请输入用户名/手机号" prefix-icon="account" clearable
						border="bottom"></uv-input>
				</uv-form-item>

				<uv-form-item prop="password" label-width="0">
					<uv-input v-model="form.password" placeholder="请输入密码" prefix-icon="lock" clearable border="bottom"
						type="password"></uv-input>
				</uv-form-item>

				<view class="remember-forgot">
					<uv-checkbox-group v-model="form.remember">
						<uv-checkbox label="记住密码"></uv-checkbox>
					</uv-checkbox-group>
				</view>

				<uv-button type="primary" shape="circle" @click="handleLogin" :loading="loading" :disabled="loading">
					登录
				</uv-button>
			</uv-form>
		</view>

		<!-- 其他登录方式 -->
		<!--    <view class="other-login">
      <text class="divider">其他登录方式</text>
      <view class="login-methods">
        <uv-icon name="weixin-fill" size="60rpx" color="#07C160" @click="handleWechatLogin"></uv-icon>
        <uv-icon name="qq-fill" size="60rpx" color="#12B7F5" @click="handleQQLogin"></uv-icon>
      </view>
    </view> -->
	</view>
</template>

<script>
	import {
		login
	} from '@/api/login.js'
	import {setToken,setUserInfo} from '@/utils/auth.js'
	export default {
		data() {
			return {
				form: {
					username: '',
					password: '',
					remember: false
				},
				loading: false,
				rules: {
					username: [{
							required: true,
							message: '请输入用户名',
							trigger: 'blur'
						},
						{
							min: 3,
							max: 20,
							message: '长度在3到20个字符',
							trigger: 'blur'
						}
					],
					password: [{
							required: true,
							message: '请输入密码',
							trigger: 'blur'
						},
						{
							min: 6,
							max: 20,
							message: '长度在6到20个字符',
							trigger: 'blur'
						}
					]
				}
			}
		},
		onLoad() {
			// 从本地存储中获取记住的账号密码
			const rememberAccount = uni.getStorageSync('rememberAccount');
			if (rememberAccount) {
				this.form.username = rememberAccount.username || '';
				this.form.password = rememberAccount.password || '';
				this.form.remember = true;
			}
		},
		methods: {
			async handleLogin() {
				try {
					const {
						token,
						user
					} = await login({
						username: this.form.username,
						password: this.form.password
					});

					// 存储token和用户信息
					setToken(token);
					setUserInfo(user);

					// 跳转到首页
					uni.reLaunch({
						url: '/pages/schedule/index'
					});

				} catch (error) {
					// 显示错误消息
					uni.showToast({
						title: error.message || '登录失败',
						icon: 'none'
					});
				}
			},
			handleForgotPassword() {
				uni.navigateTo({
					url: '/pages/forgot-password/forgot-password'
				});
			},
			handleWechatLogin() {
				uni.showToast({
					title: '微信登录',
					icon: 'none'
				});
			},
			handleQQLogin() {
				uni.showToast({
					title: 'QQ登录',
					icon: 'none'
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.login-container {
		padding: 0 60rpx;
		height: 100vh;
		display: flex;
		flex-direction: column;
		background-color: #ffffff;

		.logo-container {
			margin-top: 120rpx;
			margin-bottom: 80rpx;
			display: flex;
			flex-direction: column;
			align-items: center;

			.logo {
				height: 160rpx;
				width: 160rpx;
				margin-bottom: 30rpx;
			}

			.title {
				font-size: 40rpx;
				font-weight: bold;
				color: #333;
			}
		}

		.form-container {
			flex: 1;

			.remember-forgot {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin: 30rpx 0 60rpx;

				.forgot-password {
					color: #2979ff;
					font-size: 28rpx;
				}
			}

			.uv-button {
				margin-top: 20rpx;
			}
		}

		.other-login {
			margin-bottom: 60rpx;
			display: flex;
			flex-direction: column;
			align-items: center;

			.divider {
				color: #999;
				font-size: 28rpx;
				margin-bottom: 40rpx;
				position: relative;

				&::before,
				&::after {
					content: '';
					position: absolute;
					top: 50%;
					width: 120rpx;
					height: 1rpx;
					background-color: #eee;
				}

				&::before {
					left: -140rpx;
				}

				&::after {
					right: -140rpx;
				}
			}

			.login-methods {
				display: flex;
				justify-content: center;
				gap: 80rpx;
			}
		}
	}
</style>