<script setup lang="tsx">
import { useAppStore } from '@/stores/app'
import { ref } from 'vue'

const appStore = useAppStore()

const userOptions = [
  {
    label: '修改密码',
    key: 'passwold',
    icon() {
      return <i class="i-icon:change-password text-20px"></i>
    },
  },
  {
    label: '退出登录',
    key: 'logout',
    icon() {
      return <i class="i-icon:logout text-20px"></i>
    },
  },
]
const showPassWordModify = ref(false)

function onUserOptionsSelect(key: string) {
  if (key === 'logout') {
    appStore.logout()
  }
  if (key === 'passwold') {
    showPassWordModify.value = true
  }
}
</script>

<template>
  <n-layout-header
    :class="[
      'flex',
      'justify-between',
      'items-center',
      'relative',
      'bg-white',
      'h-[var(--header-height)]',
      'shadow-[var(--box-shadow)]',
      'z-2',
    ]"
  >
    <div class="ml-10px flex-center">
      Logo here
    </div>
    <div class="flex items-center gap-5px p-10px">
      <dark-toggle v-slot="{ _isDark, toggle }">
        <n-button
          quaternary
          circle
          mr-20px
          @click="toggle"
        >
          <template #icon>
            <i v-if="_isDark" class="i-icon:night" />
            <i v-else class="i-icon:light" />
          </template>
        </n-button>
      </dark-toggle>

      <template v-if="appStore.token">
        <n-avatar
          round
          :size="30"
          :src="appStore.avatar"
          alt="头像"
        />
        <div class="text-14px">{{ appStore.nickName }}</div>
        <n-dropdown
          trigger="click"
          placement="bottom-start"
          :options="userOptions"
          @select="onUserOptionsSelect"
        >
          <n-button quaternary circle>
            <template #icon>
              <i class="i-icon:menu-dot text-26px" />
            </template>
          </n-button>
        </n-dropdown>
      </template>
    </div>
  </n-layout-header>

  <modify-password v-model:show="showPassWordModify" />
</template>
