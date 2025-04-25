<template>
	<view class="layout-container page-container" :style="{paddingTop: paddingTop + 'rpx', background: background}">
		<slot></slot>
	</view>
</template>

<script setup>
	import {
		ref,
		computed,
		onMounted,
		onUnmounted
	} from 'vue';
	import {
		pxRatio
	} from '@/utils/ratio.js';
	import {
		useTheme
	} from '@/utils/theme.js';

	const {
		theme,
		getPrimaryWithOpacity,
		onThemeChange
	} = useTheme();
	const paddingTop = ref(0);

	// 使用计算属性 + 手动更新
	const background = ref('');

	const updateBackground = () => {
		background.value =
			`linear-gradient(to bottom, ${getPrimaryWithOpacity(0.35)} 0%, ${getPrimaryWithOpacity(0)} 100%)`;
	};

	// 初始化
	updateBackground();

	// 监听主题变化
	onMounted(() => {
		const rect = uni.getMenuButtonBoundingClientRect();
		if (rect) paddingTop.value = rect.top * pxRatio;

		// 添加主题监听
		const unsubscribe = onThemeChange(updateBackground);

		// 组件卸载时取消监听
		onUnmounted(unsubscribe);
	});
</script>
<style>
	.layout-container {
		width: 100%;
		height: calc(100vh - 100rpx);
		display: flex;
		box-sizing: border-box;
		flex-direction: column;
	}

	/* 全局页面样式 */
	.page-container {
		background: linear-gradient(to bottom, rgba(255, 191, 107, 0.35) 0%, rgba(255, 191, 107, 0) 100%);
		background-attachment: fixed;
		min-height: 100vh;
	}
</style>