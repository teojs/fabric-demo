import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router/auto'
import { version } from '../../package.json'
import { useColorMode } from '@vueuse/core'

export interface AppState {
  userName: string
  nickName: string
  avatar: string
  token: string
  theme: 'dark' | 'light'
}

export const useAppStore = defineStore(
  'app',
  () => {
    const router = useRouter()
    const state = reactive<AppState>({
      userName: '',
      nickName: '',
      avatar: '/img/default_avatar.png',
      token: '',
      theme: useColorMode().value === 'dark' ? 'dark' : 'light',
    })

    const logout = () => {
      state.token = ''
      router.replace('/login')
    }

    return {
      /** State */
      ...toRefs(state),

      /** Getter */

      /** Action */
      logout,
    }
  },
  {
    /** 启用缓存 */
    persist: {
      key: 'app-store-' + version,
      storage: localStorage,
    },
  }
)
