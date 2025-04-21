<template>
	<layout>
		<headerVue>
			<view class="tabs">
				<view class="tab" :class="{activeTab:activeTab===tab.type}" v-for="tab in tabList" :key="tab.type"
					@click="handleExchange(tab.type)">
					{{tab.name}}
				</view>
			</view>
		</headerVue>
	</layout>
</template>

<script setup>
	import layout from '@/components/layout/index.vue'
	import headerVue from '@/components/header/index.vue'
	import {
		ref
	} from 'vue';
	import {
		onShow
	} from '@dcloudio/uni-app';
	const tabList = ref([{
		name: '咨询',
		type: 0
	}])

	const activeTab = ref(0)
	const reservationList = ref(null)

	const handleExchange = (type) => {
		activeTab.value = type
	}
</script>

<style lang="scss">
	.tabs {
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		padding: 0 20rpx;
		display: flex;
		align-items: center;
		column-gap: 20rpx;

		.tab {
			font-size: 32rpx;
			color: #999;
		}

		.activeTab {
			color: #000;
			font-size: 36rpx;
		}
	}

</style>