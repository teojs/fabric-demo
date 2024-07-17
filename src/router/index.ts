import {
  createRouter,
  createWebHistory,
  isNavigationFailure,
} from 'vue-router/auto'
import { setupLayouts } from 'virtual:generated-layouts'
import { useAppStore } from '@/stores/app'
import useDiscreteApi from '@/utils/create-discrete-api'
import type { LoadingBarInst } from 'naive-ui/es/loading-bar/src/LoadingBarProvider'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  extendRoutes: (routes) => setupLayouts(routes),
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return {
        top: 0,
      }
    }
  },
})

let loadingBar: LoadingBarInst | null = null

router.beforeEach((to, _from, next) => {
  const appStore = useAppStore()
  !loadingBar && (loadingBar = useDiscreteApi().loadingBar)
  switch (true) {
    case to.matched.some((record) => record.meta.noAuth):
      next()
      break

    case !appStore.token:
      next({
        path: '/login',
        query: {
          redirect: to.fullPath,
        },
      })
      break

    default:
      loadingBar.start()
      next()
      break
  }
})

router.afterEach((to, _from, failure) => {
  if (isNavigationFailure(failure)) {
    loadingBar?.error()
    return
  }
  loadingBar?.finish()

  const title = (to.meta.title || '') + ' - ' + import.meta.env.VITE_APP_TITLE
  document.title = title
})

router.onError((error) => {
  const { notification } = useDiscreteApi()
  loadingBar?.error()
  notification.error({
    content: '页面加载失败, 可能网络异常或者应用已更新, 请刷新页面重试。',
    meta: `错误信息：${error.message}`,
    duration: 0,
    keepAliveOnHover: true,
  })
})

export default router
