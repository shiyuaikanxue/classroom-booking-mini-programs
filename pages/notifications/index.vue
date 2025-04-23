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
		<notification-list class="list" v-if="activeTab === 0" :school-id="currentSchoolId" />

		<!-- 公告列表 -->
		<announcement-list class="list" v-if="activeTab === 1" :school-id="currentSchoolId" />
	</layout>
</template>

<script setup>
	import layout from '@/components/layout/index.vue'
	import headerVue from '@/components/header/index.vue'
	import notificationList from './NotificationList.vue'
	import announcementList from './AnnouncementList.vue'
	import {
		ref
	} from 'vue';
	import {
		getUserInfo
	} from '@/utils/auth.js'
	import {
		onShow
	} from '@dcloudio/uni-app';
	const tabList = ref([{
		name: '通知',
		type: 0
	}, {
		name: '公告',
		type: 1
	}])
	const school_id = getUserInfo().school_id
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

	.list {
		flex-grow: 1;
		overflow: scroll;
	}
</style>