<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import type { GlobalThemeOverrides, GlobalTheme } from 'naive-ui'
import {
  lightTheme, darkTheme, zhCN, dateZhCN,
} from 'naive-ui'
import { useColorMode } from '@vueuse/core'

const state = reactive<{
  theme: GlobalTheme
  themeOverrides: GlobalThemeOverrides
}>({
  theme: lightTheme,
  themeOverrides: {
    common: {
      primaryColor: '#027FFF',
      primaryColorHover: '#027FFFdd',
      primaryColorPressed: '#027FFFff',
      successColor: '#33c073',
      successColorHover: '#33c073dd',
      successColorPressed: '#33c073ff',
      warningColor: '#f9ce32',
      warningColorHover: '#f9ce32dd',
      warningColorPressed: '#f9ce32ff',
      errorColor: '#f86577',
      errorColorHover: '#f86577dd',
      errorColorPressed: '#f86577ff',
    },
    Menu: {
      itemHeight: '40px',
    },
    Dropdown: {},
    Breadcrumb: {},
    Card: {
      colorEmbedded: 'rgba(var(--color-gray-light), 1)',
    },
    Image: {
      toolbarColor: 'rgba(var(--color-gray-light), 1)',
      toolbarIconColor: 'rgba(var(--color-gray-dark), 1)',
    },
    Button: {
      textColorPrimary: 'rgba(var(--color-gray-light-original), 1)',
      textColorHoverPrimary: 'rgba(var(--color-gray-light-original), 0.8)',
    },
  },
})

/**
 * 设置移动端可视区域高度
 * 用于代替100vh
 */
const setMobileViewportHeight = () => {
  document.documentElement.style.setProperty(
    '--h-full',
    window.innerHeight + 'px'
  )
}

useColorMode({
  onChanged: (value) => {
    if (value === 'dark') {
      state.theme = darkTheme
    } else {
      state.theme = lightTheme
    }
  },
})

onMounted(() => {
  setMobileViewportHeight()
  window.addEventListener('resize', setMobileViewportHeight)
})
</script>

<template>
  <n-config-provider
    abstract
    :theme="state.theme"
    :locale="zhCN"
    :date-locale="dateZhCN"
    :theme-overrides="state.themeOverrides"
  >
    <n-notification-provider>
      <n-dialog-provider>
        <n-message-provider>
          <n-loading-bar-provider>
            <router-view v-slot="{ Component }">
              <transition name="zoom" mode="out-in">
                <component :is="Component" />
              </transition>
            </router-view>
          </n-loading-bar-provider>
        </n-message-provider>
      </n-dialog-provider>
    </n-notification-provider>
  </n-config-provider>
</template>

<style lang="less"></style>
