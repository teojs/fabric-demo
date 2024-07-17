import http from '@/service/axios.config'
import type { AxiosRequestConfig } from 'axios'

interface IRequestConfig extends AxiosRequestConfig {
  params: {
    test: string
  }
}

interface IResponseData {
  code: string
  message: string
  body: {}
}

/**
 * @description 把这句话改成接口描述，不然会有eslint报错
 */
export default function api(ctx: IRequestConfig): Promise<IResponseData> {
  return http<IResponseData>({
    method: 'get',
    url: '/api/demo',
    ...ctx,
  })
}
