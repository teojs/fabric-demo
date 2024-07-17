import { useAppStore } from '@/stores/app'
import type { AxiosRequestConfig, AxiosError } from 'axios'
import axios from 'axios'
import useDiscreteApi from '@/utils/create-discrete-api'
import router from '@/router'

const axiosInstance = axios.create({
  baseURL: '/',
  withCredentials: true,
  timeout: 120000,
  validateStatus: (status) => status >= 200 && status < 300,
})

axiosInstance.interceptors.request.use((config) => {
  const appStore = useAppStore()

  config.headers.Authorization = `${appStore.token}`

  return config
})

axiosInstance.interceptors.response.use(
  async(response) => {
    if (response.config.responseType === 'blob') {
      if ('content-disposition' in response.headers) {
        const file = response.data as Blob
        const reader = new FileReader()
        await new Promise((resolve) => {
          reader.onload = resolve
          reader.readAsText(file)
        })
        try {
          return JSON.parse(reader.result as string)
        } catch (error) {
          return {
            code: '01',
            file,
            name: response.headers['content-disposition'].split('=')[1],
          }
        }
      }
      return response.data
    } else {
      return response.data
    }
  },
  (error: AxiosError) => {
    if (error.response?.status === 403) {
      const appStore = useAppStore()

      // token 过期的情况
      if (router.currentRoute.value.path !== '/login') {
        appStore.$patch({
          token: '',
        })
        router.replace({
          path: '/login',
          query: {
            redirect: router.currentRoute.value.fullPath,
          },
        })
      }

      return Promise.reject(error.message)
    }

    if ('config' in error) {
      const { notification } = useDiscreteApi()
      notification.error({
        content: '请求异常, 请重试或联系管理员',
        meta: `错误信息：${error.message}`,
        duration: 5000,
        keepAliveOnHover: true,
      })
    }

    return {
      code: error.code,
      message: error.message,
      body: null,
    }
  }
)

/**
 * 封装好的Http请求
 *
 * @export
 * @template D
 * @param {AxiosRequestConfig} config
 * @return {*}  {Promise<IAxiosResponseData<D>>}
 */
export default function http<IResponseData>(
  config: AxiosRequestConfig
): Promise<IResponseData> {
  return axiosInstance(config)
}
