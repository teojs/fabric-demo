/// <reference types="vitest" />

import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueRouter from 'unplugin-vue-router/vite'
import Layouts from 'vite-plugin-vue-layouts'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import UnoCSS from 'unocss/vite'
import { viteMockServe } from 'vite-plugin-mock'
import autoApi from './plugin/auto-api'
import eslintPlugin from 'vite-plugin-eslint'
import type { UserConfigExport, ConfigEnv } from 'vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { select } from '@inquirer/prompts'
import VueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default async({ command }: ConfigEnv): Promise<UserConfigExport> => {
  const basePath = process.env.npm_config_base || '/'
  const mock = Boolean(process.env.npm_config_mock)
  let proxyTarget = 'test'

  const servers: {
    [propName: string]: string
  } = {
    test: 'http://127.0.0.1:8080',
  }
  if (command === 'serve') {
    proxyTarget = await select({
      message: '请选择接口代理地址',
      choices: Object.entries(servers).map(([key, value]) => ({
        name: `${key} - ${value}`,
        value: key,
      })),
    })
  }

  return defineConfig({
    base: basePath,
    plugins: [
      {
        ...autoApi({
          serviceDir: 'src/service',
          apisDir: 'src/service/apis',
        }),
        enforce: 'pre',
      },
      VueRouter({
        dts: './types/typed-router.d.ts',
      }),
      vue(),
      vueJsx(),
      Layouts(),
      AutoImport({
        dts: './types/auto-import.d.ts',
      }),
      Components({
        dts: './types/components.d.ts',
        resolvers: [NaiveUiResolver()],
      }),
      UnoCSS(),
      viteMockServe({
        mockPath: 'src/service/mock',
        enable: command === 'serve' && mock,
      }),
      eslintPlugin({
        failOnWarning: false,
        failOnError: false,
      }),
      VueDevTools(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      port: 8022,
      host: '127.0.0.1',
      proxy: {
        '/api': {
          target: servers[proxyTarget],
          changeOrigin: true,
          rewrite: (path) => {
            if (['test', 'prod'].includes(proxyTarget)) return path
            return path.replace(/^\/api/, '')
          },
        },
      },
    },
  })
}
