<script setup>
	import {
		BUTTON_POSITION,
		getButtonPosition
	} from '@/utils/layout-background.js'
	import {
		onLaunch
	} from '@dcloudio/uni-app'
	import {
		ref
	} from 'vue'
	const marginTop = ref('')
	const init = () => {
		// 初始化按钮位置
		initButtonPosition()
		setMarginTop()
	}
	const setMarginTop = () => {
		const position = getButtonPosition()
		marginTop.value = `${position.top}rpx`
		console.log(marginTop.value)
	}
	const initButtonPosition = () => {
		const buttonPosition = uni.getStorageSync(BUTTON_POSITION)
		if (!buttonPosition) {
			const position = uni.getMenuButtonBoundingClientRect()
			uni.setStorageSync(BUTTON_POSITION, position)
		}
	}
	onLaunch(() => {
		init()
	})
</script>

<style>
	/* 全局页面样式 */
	.page-container {
		background: linear-gradient(to bottom, rgba(255, 191, 107, 0.35) 0%, rgba(255, 191, 107, 0) 100%);
		background-attachment: fixed;
		padding-top: v-bind(marginTop);
		min-height: 100vh;
	}
</style>

<style lang="scss">
	@import '@/uni_modules/uv-ui-tools/index.scss';
</style>