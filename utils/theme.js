// utils/theme.js
import {
	reactive
} from 'vue';

// 创建全局响应式对象
const state = reactive({
	primaryColor: uni.getStorageSync('appTheme')?.primaryColor || '#FFBF6B',
	listeners: new Set()
});

// 更新所有监听者
const notifyListeners = () => {
	state.listeners.forEach(listener => listener());
};

export function useTheme() {
	const getPrimaryWithOpacity = (opacity) => {
		const hex = state.primaryColor.slice(1);
		const r = parseInt(hex.substr(0, 2), 16);
		const g = parseInt(hex.substr(2, 2), 16);
		const b = parseInt(hex.substr(4, 2), 16);
		return `rgba(${r}, ${g}, ${b}, ${opacity})`;
	};

	const setTheme = (newColor) => {
		if (!/^#[0-9A-F]{6}$/i.test(newColor)) {
			uni.showToast({
				title: '颜色格式错误',
				icon: 'none'
			});
			return false;
		}

		state.primaryColor = newColor;
		uni.setStorageSync('appTheme', {
			primaryColor: newColor
		});
		notifyListeners(); // 通知所有订阅者
		return true;
	};

	// 添加监听回调（返回取消监听函数）
	const onThemeChange = (callback) => {
		state.listeners.add(callback);
		return () => state.listeners.delete(callback);
	};

	return {
		theme: state,
		setTheme,
		getPrimaryWithOpacity,
		onThemeChange
	};
}