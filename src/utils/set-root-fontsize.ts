// 计算根标签的 fontSize
function setRootFontSize() {
  // 获取设备的 DPR
  const dpr = 2

  // 设置基准宽度和基准 fontSize
  const baseWidth = 375 * dpr // 基准宽度，例如 iPhone 6/7/8 的宽度
  const baseFontSize = 100 // 基准 fontSize

  // 计算当前设备的 fontSize
  const fontSize = (window.innerWidth / baseWidth) * baseFontSize

  // 设置根标签的 fontSize
  document.documentElement.style.fontSize = fontSize + 'px'
}

// 初始化时设置一次
setRootFontSize()

// 监听窗口大小变化，动态调整 fontSize
window.addEventListener('resize', setRootFontSize)
