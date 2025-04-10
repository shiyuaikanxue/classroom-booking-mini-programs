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
		<!-- 添加课表组件 -->
		<timetable class="timetableStyle" v-if="activeTab === 0" />
	</layout>
</template>

<script setup>
	import layout from '@/components/layout/index.vue'
	import headerVue from '@/components/header/index.vue'
	import timetable from './timetable.vue' // 导入课表组件
	import {
		ref
	} from 'vue';
	const tabList = ref([{
		name: '课表',
		type: 0
	}, {
		name: '全部安排',
		type: 1
	}])
	const activeTab = ref(0)
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

	.timetableStyle {
		flex-grow: 1;
		overflow: hidden;
	}
</style>