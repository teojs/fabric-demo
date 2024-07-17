import { watchEffect } from 'vue'
import type { DirectiveBinding, Directive } from 'vue'
import { useElementBounding } from '@vueuse/core'

/**
 * 获取元素的总下边距
 * @param {HTMLElement} element - 目标元素
 * @return {number} 元素的总下边距
 */
const getTotalPaddingBottom = (element: HTMLElement): number => {
  let totalPaddingBottom = 0
  let parent = element.parentElement
  while (parent !== null) {
    const computedStyle = getComputedStyle(parent)
    const paddingBottom = parseFloat(computedStyle.paddingBottom)
    if (!isNaN(paddingBottom)) {
      totalPaddingBottom += paddingBottom
    }
    parent = parent.parentElement
  }
  return totalPaddingBottom
}

/**
 * 设置元素相对父元素的剩余高度
 *
 * @param {HTMLElement} el
 */
const updateHeight = (el: HTMLElement, offset: number | boolean = 0) => {
  if (typeof offset !== 'number') {
    offset = 0
  }
  const { top } = useElementBounding(el)
  const offsetTop = el.offsetTop
  const diff = top.value - offsetTop
  watchEffect(() => {
    const totalPaddingBottom = getTotalPaddingBottom(el) || 0
    const remainingHeight =
      innerHeight - offsetTop - totalPaddingBottom - diff - (offset as number)
    el.style.setProperty('height', `${remainingHeight}px`)
  })
}

const fillHeight: Directive<HTMLElement> = {
  mounted(el, binding: DirectiveBinding<boolean | number>) {
    updateHeight(el, binding.value)
    window.addEventListener('resize', () => updateHeight(el))
  },
  beforeUnmount(el) {
    window.removeEventListener('resize', () => updateHeight(el))
  },
}

export default fillHeight
