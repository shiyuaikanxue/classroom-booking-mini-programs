import {
	reactive
} from "vue"
export const BUTTON_POSITION = 'button_position'
export const getButtonPosition = () => {
	const buttonInfo = reactive({
		bottom: 0,
		height: 0,
		left: 0,
		right: 0,
		top: 0,
		width: 0,
	})
	const buttonPosition = uni.getStorageSync(BUTTON_POSITION)
	buttonInfo.bottom = buttonPosition.bottom || 0
	buttonInfo.height = buttonPosition.height || 0
	buttonInfo.left = buttonPosition.left || 0
	buttonInfo.right = buttonPosition.right || 0
	buttonInfo.top = buttonPosition.top || 0
	buttonInfo.width = buttonPosition.width || 0
	return {
		bottom: buttonInfo.bottom,
		height: buttonInfo.height,
		left: buttonInfo.left,
		right: buttonInfo.right,
		top: buttonInfo.top,
		width: buttonInfo.width,
	}
}