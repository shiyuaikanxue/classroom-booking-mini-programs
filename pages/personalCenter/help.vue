<template>
	<layout>
		<!-- 自定义头部 -->
		<headerVue>
			<view class="title">
				<view class="back" @click="goBack">
					<uv-icon name="arrow-left" color="#2979ff" size="24"></uv-icon>
				</view>
				<text class="text">帮助中心</text>
			</view>
		</headerVue>

		<view class="help-container">
			<!-- 搜索框 -->
			<view class="search-bar">
				<uv-search placeholder="输入问题关键词" v-model="searchText" :showAction="true" actionText="搜索"
					@search="handleSearch" @custom="handleSearch"></uv-search>
			</view>

			<!-- 分类导航 -->
			<scroll-view class="category-scroll" scroll-x>
				<view v-for="(item, index) in categories" :key="index" class="category-item"
					:class="{ active: activeCategory === index }" @click="changeCategory(index)">
					{{ item.name }}
				</view>
			</scroll-view>

			<!-- 常见问题列表 -->
			<view class="faq-list">
				<view v-for="(item, index) in filteredQuestions" :key="index" class="faq-item"
					@click="toggleAnswer(index)">
					<view class="question">
						<text>{{ item.question }}</text>
						<uv-icon :name="item.expanded ? 'arrow-up' : 'arrow-down'" size="16" color="#999" />
					</view>
					<view class="answer" v-show="item.expanded">
						<text>{{ item.answer }}</text>
					</view>
				</view>
			</view>

			<!-- 无结果提示 -->
			<view class="empty-tip" v-if="filteredQuestions.length === 0">
				<uv-empty mode="search" iconSize="120"></uv-empty>
				<text class="tip-text">没有找到相关问题</text>
			</view>
		</view>
	</layout>
</template>

<script setup>
	import {
		ref,
		computed
	} from 'vue'
	import layout from '@/components/layout/index.vue'
	import headerVue from '@/components/header/index.vue'
	// 返回上一页
	const goBack = () => {
		uni.navigateBack()
	}
	// 分类数据
	const categories = ref([{
			name: '全部',
			type: 'all'
		},
		{
			name: '账号问题',
			type: 'account'
		},
		{
			name: '预约问题',
			type: 'reservation'
		},
		{
			name: '教室使用',
			type: 'classroom'
		},
		{
			name: '系统操作',
			type: 'system'
		}
	])

	// 常见问题数据
	const questions = ref([{
			question: '如何修改个人资料？',
			answer: '进入个人中心页面，点击头像区域即可进入编辑页面修改个人信息。',
			type: 'account',
			expanded: false
		},
		{
			question: '忘记密码怎么办？',
			answer: '个人中心页面，请联系管理员',
			type: 'account',
			expanded: false
		},
		{
			question: '如何预约教室？',
			answer: '在首页选择"教室预约"，选择日期、时间段和教室后提交申请，等待管理员审核。',
			type: 'reservation',
			expanded: false
		},
		{
			question: '预约后可以取消吗？',
			answer: '在"我的预约"页面找到对应预约记录，活动开始前2小时可以取消预约。',
			type: 'reservation',
			expanded: false
		},
		{
			question: '教室设备出现问题怎么办？',
			answer: '立即联系所在教学楼的管理员或拨打后勤服务热线023-62460000报修。',
			type: 'classroom',
			expanded: false
		},
		{
			question: '系统卡顿如何处理？',
			answer: '尝试清理小程序缓存或退出重新登录，如仍存在问题请联系管理员。',
			type: 'system',
			expanded: false
		}
	])

	// 搜索文本
	const searchText = ref('')
	// 当前激活分类
	const activeCategory = ref(0)

	// 处理分类切换
	const changeCategory = (index) => {
		activeCategory.value = index
	}

	// 处理搜索
	const handleSearch = () => {
		// 搜索逻辑已在计算属性中处理
	}

	// 切换问题展开状态
	const toggleAnswer = (index) => {
		questions.value[index].expanded = !questions.value[index].expanded
	}

	// 过滤后的问题列表
	const filteredQuestions = computed(() => {
		const category = categories.value[activeCategory.value].type
		const search = searchText.value.toLowerCase()

		return questions.value.filter(item => {
			const matchCategory = category === 'all' || item.type === category
			const matchSearch = search === '' ||
				item.question.toLowerCase().includes(search) ||
				item.answer.toLowerCase().includes(search)
			return matchCategory && matchSearch
		})
	})

	// 联系客服方法
	const makePhoneCall = () => {
		uni.makePhoneCall({
			phoneNumber: '023-62460000'
		})
	}

	const sendEmail = () => {
		uni.setClipboardData({
			data: 'support@cqupt.edu.cn',
			success: () => {
				uni.showToast({
					title: '邮箱已复制',
					icon: 'success'
				})
			}
		})
	}

	const openChat = () => {
		uni.showToast({
			title: '正在连接客服...',
			icon: 'none'
		})
		// 实际项目中这里可能是打开客服聊天窗口
	}
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

	.help-container {
		padding: 20rpx;

		.search-bar {
			margin-bottom: 30rpx;
		}

		.category-scroll {
			white-space: nowrap;
			margin-bottom: 30rpx;

			.category-item {
				display: inline-block;
				padding: 12rpx 30rpx;
				margin-right: 20rpx;
				border-radius: 40rpx;
				background-color: #f5f5f5;
				color: #666;
				font-size: 26rpx;

				&.active {
					background-color: #007AFF;
					color: #fff;
				}
			}
		}

		.faq-list {
			margin-bottom: 40rpx;

			.faq-item {
				background-color: #fff;
				border-radius: 16rpx;
				margin-bottom: 20rpx;
				padding: 24rpx;
				box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);

				.question {
					display: flex;
					justify-content: space-between;
					align-items: center;
					font-size: 28rpx;
					color: #333;
					font-weight: 500;
				}

				.answer {
					margin-top: 20rpx;
					padding-top: 20rpx;
					border-top: 1rpx solid #f0f0f0;
					font-size: 26rpx;
					color: #666;
					line-height: 1.6;
				}
			}
		}

		.empty-tip {
			text-align: center;
			padding: 60rpx 0;

			.tip-text {
				display: block;
				margin-top: 20rpx;
				color: #999;
				font-size: 26rpx;
			}
		}


	}
</style>