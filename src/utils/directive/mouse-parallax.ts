import { watchEffect, watch } from 'vue'
import type { WatchStopHandle, Directive } from 'vue'
import { useMouseInElement } from '@vueuse/core'

/**
 * 鼠标经过卡片视差效果
 */

const PERSPECTIVE = 1500
const TRANSITION_PROPERTY = `
  color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter
`
const TRANSITION_DURATION = '150ms'
const TRANSITION_TIMING_FUNCTION = 'linear'

const mouseParallax: Directive<HTMLElement> = {
  mounted(el) {
    /**
     * 创建一个闪光层，并将其添加到指定的元素中。
     */
    const shineLayer = document.createElement('div')
    const shineLayerStyle = `
      position: absolute;
      inset: 0;
      pointer-events: none;
      border-radius: inherit;
      z-index: 9;
      transition: all 150ms linear;
      opacity: 0;
    `
    shineLayer.setAttribute('style', shineLayerStyle)
    el.appendChild(shineLayer)

    const setElementTransition = () => {
      const elPosition = el.computedStyleMap().get('position')
      if (elPosition === 'static') {
        el.style.setProperty('position', 'relative')
      }
      el.style.setProperty('transition-property', TRANSITION_PROPERTY)
      el.style.setProperty('transition-duration', TRANSITION_DURATION)
      el.style.setProperty(
        'transition-timing-function',
        TRANSITION_TIMING_FUNCTION
      )
      el.style.setProperty('overflow', 'hidden')

      const imgNode = el.getElementsByTagName('img')?.[0]
      imgNode?.style.setProperty('transition-property', TRANSITION_PROPERTY)
      imgNode?.style.setProperty('transition-duration', TRANSITION_DURATION)
      imgNode?.style.setProperty(
        'transition-timing-function',
        TRANSITION_TIMING_FUNCTION
      )
    }

    /**
     * 将一个数值限制在指定的范围内。
     * @param value - 需要被限制的数值。
     * @param min - 允许的最小值。
     * @param max - 允许的最大值。
     * @returns 限制后的数值。
     */
    const clamp = (value: number, min: number, max: number) => {
      return Math.min(Math.max(value, min), max)
    }

    const updateTransform = (
      mouseX: number,
      mouseY: number,
      elementWidth: number,
      elementHeight: number
    ) => {
      const x = clamp(mouseX, 0, elementWidth)
      const y = clamp(mouseY, 0, elementHeight)
      const rotateX = (y / elementHeight) * 20 - 10
      const rotateY = (x / elementWidth) * 20 - 10
      const translateX = (x / elementWidth) * 10 - 5
      const translateY = (y / elementHeight) * 10 - 5
      const cardTransform = `
        perspective(${PERSPECTIVE}px)
        scale3d(1.03,1.03,1.03)
        rotateX(${rotateX}deg)
        rotateY(${rotateY * -1}deg)
        translateX(${translateX}px)
        translateY(${translateY}px)`

      const diff = 2
      const imgTransform = `
      scale3d(1.15,1.15,1.15)
      translateX(${-translateX * diff}px)
      translateY(${-translateY * diff}px)`

      el.style.setProperty('transform', cardTransform)

      const imgNode = el.getElementsByTagName('img')?.[0]
      imgNode?.style.setProperty('transform', imgTransform)
    }

    /**
     * 设置反光遮罩层
     *
     * @param {number} mouseX
     * @param {number} mouseY
     * @param {number} elementWidth
     * @param {number} elementHeight
     */
    // const updateShineLayer = (
    //   mouseX: number,
    //   mouseY: number,
    //   elementWidth: number,
    //   elementHeight: number
    // ) => {
    //   const gradientCenter = {
    //     x: (mouseX / elementWidth) * 100,
    //     y: (mouseY / elementHeight) * 100,
    //   }

    //   const backgroundShineLayer = `
    //     radial-gradient(
    //       circle at ${gradientCenter.x}% ${gradientCenter.y}%,
    //       rgba(255, 255, 255, 0.3),
    //       rgba(255, 255, 255, 0) 80%
    //     )
    //   `

    //   shineLayer.style.setProperty('background', backgroundShineLayer)
    //   shineLayer.style.setProperty('opacity', '1')
    // }

    const {
      elementX, elementY, elementWidth, elementHeight, isOutside,
    } =
      useMouseInElement(el)
    let stopWatch: WatchStopHandle
    watch(
      () => isOutside.value,
      (isOutside) => {
        if (!isOutside) {
          setElementTransition()

          stopWatch = watchEffect(() => {
            updateTransform(
              elementX.value,
              elementY.value,
              elementWidth.value,
              elementHeight.value
            )

            // updateShineLayer(
            //   elementX.value,
            //   elementY.value,
            //   elementWidth.value,
            //   elementHeight.value
            // )
          })
        } else {
          el.style.setProperty('transform', 'scale3d(1,1,1)')
          shineLayer.style.setProperty('opacity', '0')

          const imgNode = el.getElementsByTagName('img')?.[0]
          imgNode?.style.setProperty('transform', 'scale3d(1,1,1)')

          stopWatch?.()
        }
      }
    )
  },
}

export default mouseParallax
