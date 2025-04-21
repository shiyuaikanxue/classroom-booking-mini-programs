<template>
	<view class="footer-btn" @click="handleSubmit">
		<text class="text">预约</text>
	</view>
</template>

<script setup>
	import {
		defineEmits
	} from 'vue'

	const emit = defineEmits(['submit'])

	const handleSubmit = () => {
		emit('submit')
	}
</script>

<style lang="scss" scoped>
	.footer-btn {
		position: fixed;
		bottom: 30rpx;
		right: 30rpx;
		width: 80rpx;
		height: 80rpx;
		padding: 20rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 50%;
		background-color: #2979ff;
		z-index: 1000;

		/* 适配安全区域 */
		padding-bottom: calc(20rpx + env(safe-area-inset-bottom));

		.text {
			color: #fff;
			font-size: 32rpx;
			font-weight: bold;
		}
	}
</style>