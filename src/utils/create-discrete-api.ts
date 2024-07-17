import type { ConfigProviderProps } from 'naive-ui'
import {
  createDiscreteApi, lightTheme, darkTheme,
} from 'naive-ui'
import { computed } from 'vue'
import { useColorMode } from '@vueuse/core'

const discreteApi = computed(() => {
  const themeMode = useColorMode()

  const configProviderProps: ConfigProviderProps = {
    theme: themeMode.value === 'light' ? lightTheme : darkTheme,
  }

  return createDiscreteApi(
    ['message', 'dialog', 'notification', 'loadingBar'],
    {
      configProviderProps,
    }
  )
})

const useDiscreteApi = () => {
  return discreteApi.value
}

export default useDiscreteApi
