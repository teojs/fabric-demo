import set from 'lodash/set'
import type { App } from 'vue'
import type { IApis } from './types/api'
import http from './axios.config'

export * from './types/api.d'

/**
 * 转首字母大写
 *
 * @param {string} word
 * @return {*}  {string}
 */
export function firstUpperCase(word: string): string {
  if (typeof word !== 'string') return ''
  return word.replace(/^[a-z]/, (match) => match.toUpperCase())
}

/**
 * 横杆转驼峰
 *
 * @export
 * @param {string} str
 * @return {*}  {string}
 */
export function crossbar2Case(str: string): string {
  if (!/-/.test(str)) return str
  return str
    .split('-')
    .map((o, i) => {
      if (!i) return o
      return firstUpperCase(o)
    })
    .join('')
}

// 自动注册/src/service/apis的所以接口

export const apis = {
  $http: http,
} as IApis

const allApis = import.meta.glob('./apis/**/*.ts', {
  eager: true,
}) as Record<string, { default: any }>
for (const key in allApis) {
  const path = key.match(/\.\/apis\/(.+?)\.ts/)![1].replace(/\//g, '.')
  set(apis, crossbar2Case(path), allApis[key].default)
}

// 自动注册/src/service/apis的所以接口

export default {
  install: (app: App) => {
    app.config.globalProperties.$api = apis
  },
}
