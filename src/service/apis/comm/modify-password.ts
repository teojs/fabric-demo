import http from '@/service/axios.config'
import type { AxiosRequestConfig } from 'axios'

interface IRequestConfig extends AxiosRequestConfig {
  data: {
    oldPassword: string
    newPassword: string
  }
}

interface IResponseData {
  code: string
  message: string
  body: {}
}

/**
 * @description 修改密码
 */
export default function api(ctx: IRequestConfig): Promise<IResponseData> {
  return http<IResponseData>({
    method: 'get',
    url: '/api/demo',
    ...ctx,
  })
}
