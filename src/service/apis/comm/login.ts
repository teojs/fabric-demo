import http from '@/service/axios.config'
import type { AxiosRequestConfig } from 'axios'

interface IRequestConfig extends AxiosRequestConfig {
  data: {
    username: string
    password: string
  }
}

interface IResponseData {
  code: string
  message: string
  body: string
}

/**
 * @description 登录接口
 */
export default function api(ctx: IRequestConfig): Promise<IResponseData> {
  return http<IResponseData>({
    method: 'get',
    url: '/api/demo',
    ...ctx,
  })
}
