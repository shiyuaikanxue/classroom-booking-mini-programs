<template>
	<layout>
		<headerVue>
			<view class="title">
				<view class="back" @click="goBack">
					<uv-icon name="arrow-left" color="#2979ff" size="24"></uv-icon>
				</view>
				<text class="text">主题设置</text>
			</view>
		</headerVue>

		<view class="theme-container">
			<!-- 预设主题 -->
			<view class="section">
				<view class="section-title">预设主题</view>
				<view class="theme-grid">
					<view v-for="(item, index) in presetThemes" :key="index" class="theme-item"
						:style="{ backgroundColor: item.primary }" @click="selectPresetTheme(item)">
						<uv-icon v-if="isActiveTheme(item.primary)" name="checkmark" size="24" color="#fff"
							class="theme-check" />
						<text class="theme-name">{{ item.name }}</text>
					</view>
				</view>
			</view>

			<!-- 自定义颜色 -->
			<view class="section">
				<view class="section-title">自定义颜色</view>
				<view class="custom-color">
					<view class="color-preview" :style="{ backgroundColor: tempColor }"></view>
					<uv-input v-model="tempColor" placeholder="#FFBF6B" border="none" @confirm="applyCustomTheme" />
					<uv-button type="primary" size="small" @click="applyCustomTheme"
						:customStyle="{ marginLeft: '20rpx' }">应用</uv-button>
				</view>
				<view class="color-picker-wrapper">
					<text class="picker-label">或从调色板选择：</text>
					<input type="color" v-model="tempColor" class="color-picker" @change="handleColorPickerChange" />
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
		useTheme
	} from '@/utils/theme.js';

	const {
		theme,
		setTheme
	} = useTheme();

	// 预设主题配置
	const presetThemes = [{
			name: '活力橙',
			primary: '#FFBF6B'
		},
		{
			name: '清新蓝',
			primary: '#5D9CEC'
		},
		{
			name: '优雅紫',
			primary: '#AC92EC'
		},
		{
			name: '自然绿',
			primary: '#A0D568'
		},
		{
			name: '热情红',
			primary: '#ED5565'
		},
		{
			name: '简约灰',
			primary: '#656D78'
		}
	];

	// 临时颜色选择（用于自定义）
	const tempColor = ref(theme.primaryColor);

	// 初始化时同步颜色
	onMounted(() => {
		const savedTheme = uni.getStorageSync('appTheme');
		tempColor.value = savedTheme?.primaryColor || theme.primaryColor;
	});

	// 返回上一页
	const goBack = () => {
		uni.navigateBack();
	};

	// 选择预设主题
	const selectPresetTheme = (themeItem) => {
		tempColor.value = themeItem.primary;
		applyTheme(themeItem.primary, themeItem.name);
	};

	// 应用自定义主题
	const applyCustomTheme = () => {
		if (!isValidColor(tempColor.value)) {
			showColorError();
			return;
		}
		applyTheme(tempColor.value, '自定义');
	};

	// 颜色选择器变化处理
	const handleColorPickerChange = (e) => {
		tempColor.value = e.target.value;
		applyTheme(e.target.value, '自定义');
	};

	// 实际应用主题方法
	const applyTheme = (color, name) => {
		if (setTheme(color)) {
			uni.showToast({
				title: `已应用${name}主题`,
				icon: 'success',
				duration: 1500
			});

			// 强制更新当前页面栈所有页面
			const pages = getCurrentPages();
			pages.forEach(page => {
				if (page?.$vm?.$forceUpdate) {
					page.$vm.$forceUpdate();
				}
			});
		}
	};

	// 检查是否是当前主题
	const isActiveTheme = (color) => {
		return theme.primaryColor.toLowerCase() === color.toLowerCase();
	};

	// 颜色验证
	const isValidColor = (color) => {
		return /^#([0-9A-F]{3}){1,2}$/i.test(color);
	};

	// 显示颜色错误提示
	const showColorError = () => {
		uni.showToast({
			title: '请输入有效的颜色码（如#FFBF6B）',
			icon: 'none',
			duration: 2000
		});
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
		}
	}

	.theme-container {
		padding: 30rpx;

		.section {
			margin-bottom: 40rpx;

			.section-title {
				font-size: 32rpx;
				font-weight: bold;
				margin-bottom: 20rpx;
				color: var(--uv-text-color);
			}
		}

		.theme-grid {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			gap: 20rpx;

			.theme-item {
				height: 140rpx;
				border-radius: 16rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
				position: relative;
				transition: all 0.3s ease;

				&:active {
					transform: scale(0.98);
					opacity: 0.9;
				}

				.theme-check {
					position: absolute;
					top: 10rpx;
					right: 10rpx;
				}

				.theme-name {
					margin-top: 10rpx;
					color: #fff;
					font-size: 24rpx;
					text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
				}
			}
		}

		.custom-color {
			display: flex;
			align-items: center;
			margin-bottom: 20rpx;

			.color-preview {
				width: 80rpx;
				height: 80rpx;
				border-radius: 16rpx;
				border: 1rpx solid #eee;
				margin-right: 20rpx;
			}

			.uv-input {
				flex: 1;
			}
		}

		.color-picker-wrapper {
			margin-top: 30rpx;
			position: relative;

			.picker-label {
				display: block;
				margin-bottom: 15rpx;
				color: #666;
				font-size: 28rpx;
			}

			.color-picker {
				width: 100%;
				height: 80rpx;
				opacity: 0;
				position: absolute;
				left: 0;
				top: 0;
			}

			&::after {
				content: '点击选择颜色';
				display: block;
				width: 100%;
				height: 80rpx;
				line-height: 80rpx;
				text-align: center;
				background-color: var(--uv-primary);
				color: white;
				border-radius: 8rpx;
				pointer-events: none;
			}
		}
	}
</style>