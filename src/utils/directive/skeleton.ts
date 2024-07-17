import type { DirectiveBinding } from 'vue'
import './skeleton.less'
/**
 * Vue指令用于显示骨架屏效果。
 * @param el - 绑定指令的元素。
 * @param binding - 指令绑定对象，包含传递给指令的值和其他属性。
 * @example <div v-skeleton="true"></div>
 */
const skeleton = (el: HTMLElement, binding: DirectiveBinding<boolean>) => {
  let skeletonNode = el.querySelector('.v-skeleton') as HTMLElement
  if (!skeletonNode) {
    skeletonNode = document.createElement('div')
    skeletonNode.className = 'v-skeleton'
    el.appendChild(skeletonNode)
    el.classList.add('hasSkeleton')
    if (!el.style.position) {
      el.style.position = 'relative'
    }
  }
  if (binding.value) {
    el.classList.add('events-none')
    skeletonNode.style.display = 'flex'
  } else {
    el.classList.remove('events-none')
    skeletonNode.style.display = 'none'
  }
}

export default skeleton
