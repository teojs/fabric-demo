// @unocss-include

import type { Ref, VNode } from 'vue'
import {
  computed, h, ref, render,
} from 'vue'
import { useElementVisibility, until } from '@vueuse/core'

/**
 * 分页管理器，
 * 初始化之后，不会立即创建分页监听，
 * 只有手动调用setPage以及setTotal之后，
 * 才会生成监听器监听下一次翻页
 *
 * @example
 * ```js
 * const listRef = ref<HTMLElement>()
 * const pagination = usePagination(listRef, {
 *   pageSize: 10,
 *   onPageChange: ({ page, pageSize }) => {
 *     // 一些请求
 *     pagination.setTotal(// 数据总数)
 *   }
 * })
 * // 手动触发第一页
 * pagination.setPage(1)
 * ```
 *
 * @param el - 一般是当前列表所在的父级元素
 * @param options - 配置选项对象
 * @param options.page - 初始页码，默认为 1
 * @param options.pageSize - 每页数量，默认为 10
 * @param options.total - 数据总数，默认为 0
 * @param options.onPageChange - 页面改变时的回调函数，默认为空函数
 * @returns 提供设置页面、每页数量和数据总数的方法
 */
export const usePagination = (
  el: Ref<HTMLElement | undefined>,
  {
    page = 1,
    pageSize = 10,
    total = -1,
    onPageChange = () => {},
    renderTrigger = undefined,
  }: {
    /** 初始页码，默认为 1 */
    page?: number
    /** 每页数量，默认为 10 */
    pageSize?: number
    /** 数据总数，默认为 -1 */
    total?: number
    /**
     * 页面变化回调函数接口
     *
     * @param params - 参数对象
     * @param params.page - 当前页面数
     * @param params.pageSize - 每页显示的数据数量
     * @param params.total - 数据总数
     */
    onPageChange?: (params: {
      page: number
      pageSize: number
      total: number
    }) => void
    renderTrigger?: () => VNode
  }
) => {
  const _page = ref(page)
  const _pageSize = ref(pageSize)
  const _total = ref(total)

  const triggerText = computed(() => {
    if (_total.value > _page.value * _pageSize.value) {
      return '正在加载更多...'
    }
    if (_total.value !== -1) {
      return '没有更多了'
    }
    return ''
  })

  const createTrigger = () => {
    return renderTrigger
      ? renderTrigger()
      : h(
        'div',
        {
          class: [
            'w-full',
            'min-h-1px',
            'flex-1',
            'text-center',
            'p-20px',
            'c-gray/30',
          ],
          style: {
            'grid-column': '1 / -1',
          },
        },
        triggerText.value
      )
  }

  const setTrigger = async() => {
    try {
      const trigger = createTrigger()
      el?.value && render(trigger, el.value)
      const targetVisible = useElementVisibility(trigger?.el as HTMLElement)
      await until(targetVisible).toBe(true)

      if (_total.value > _page.value * _pageSize.value) {
        _page.value++
        onPageChange({
          page: _page.value,
          pageSize: _pageSize.value,
          total: _total.value,
        })
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(error)
    }
  }

  /**
   * 设置当前页码，并触发页面改变回调函数
   *
   * @param page - 新的页码值
   */
  const setPage = (page: number) => {
    _page.value = page
    _total.value = -1
    onPageChange({
      page: _page.value,
      pageSize: _pageSize.value,
      total: _total.value,
    })
  }

  /**
   * 设置每页数量，并触发页面改变回调函数
   *
   * @param pageSize - 新的每页数量值
   */
  const setPageSize = (pageSize: number) => {
    _pageSize.value = pageSize
    onPageChange({
      page: _page.value,
      pageSize: _pageSize.value,
      total: _total.value,
    })
  }

  /**
   * 设置数据总数
   *
   * @param total - 新的数据总数值
   */
  const setTotal = (total: number) => {
    _total.value = total
    setTrigger()
  }

  return {
    page: _page,
    pageSize: _pageSize,
    total: _total,

    setPage,
    setPageSize,
    setTotal,
  }
}
