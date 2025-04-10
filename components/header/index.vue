<template>
	<view class="header" :style="{height:height+'rpx'}">
		<!-- 添加默认插槽 -->
		<slot></slot>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import {
		pxRatio
	} from '@/utils/ratio.js'
	const height = ref(0)
	const button = uni.getMenuButtonBoundingClientRect()
	height.value = button.height * pxRatio // 计算胶囊按钮的高度加上上下各10px的间距
</script>

<style>
	.header {
		width: 100%;
		display: flex;
		align-items: center;
	}
</style>