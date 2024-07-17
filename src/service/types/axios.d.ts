import type { AxiosRequestConfig } from 'axios'

// 定义后端接口返回的格式
export interface IAxiosResponseData<D> {
  code: string | number
  message?: string
  body?: D
  file?: Blob
  name?: string
}

// 定义请求格式，用泛型约束请求参数
export interface IAxiosRequestConfig<P, D> extends AxiosRequestConfig {
  params?: P
  data?: D
}

declare module 'axios' {
  export interface AxiosRequestConfig {}
  export interface AxiosResponse {}
}
