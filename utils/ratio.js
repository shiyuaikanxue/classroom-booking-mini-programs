const systemInfo = uni.getSystemInfoSync()
export const rpxRatio = systemInfo.windowWidth / 750  // 1rpx = (windowWidth / 750)px
export const pxRatio = 750 / systemInfo.windowWidth   // 1px = (750 / windowWidth)rpx