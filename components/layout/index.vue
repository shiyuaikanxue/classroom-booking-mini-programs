<template>
	<view class="layout-container page-container" :style="{paddingTop: paddingTop + 'rpx'}">
		<!-- 添加默认插槽 -->
		<slot></slot>
	</view>
</template>

<script setup>
	import {
		onMounted,
		ref
	} from 'vue'
	import {
		pxRatio
	} from '@/utils/ratio.js'
	const paddingTop = ref(0)

	onMounted(() => {
		const rect = uni.getMenuButtonBoundingClientRect() // 获取胶囊按钮的高度
		if (rect) {
			paddingTop.value = rect.top * pxRatio // 计算padding-top的值
		}
	})
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