import {
	reactive,
	watch
} from 'vue';

export function useResetPersistentReactive(initialState, storageKey = 'persistent-state') {
	// 从Uniapp存储加载初始状态
	const loadFromStorage = () => {
		try {
			const stored = uni.getStorageSync(storageKey);
			return stored ? JSON.parse(stored) : initialState;
		} catch (e) {
			console.error('Failed to parse stored state', e);
			return initialState;
		}
	};

	// 创建响应式状态
	const state = reactive(loadFromStorage());

	// 保存状态到Uniapp存储
	const saveToStorage = () => {
		try {
			uni.setStorageSync(storageKey, JSON.stringify(state));
		} catch (e) {
			console.error('Failed to save state', e);
		}
	};

	// 监听状态变化并自动持久化
	watch(
		() => state,
		() => {
			saveToStorage();
		}, {
			deep: true
		}
	);

	// 重置状态到初始值
	const reset = () => {
		Object.assign(state, initialState);
		saveToStorage();
	};

	// 清除持久化数据并重置状态
	const clearPersisted = () => {
		uni.removeStorageSync(storageKey);
		Object.assign(state, initialState);
	};

	return [
		state, // 响应式状态
		reset, // 重置方法
		clearPersisted // 清除持久化数据的方法
	]
}