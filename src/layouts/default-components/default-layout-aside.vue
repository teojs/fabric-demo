<script setup lang="tsx">
import type { MenuInst, MenuOption } from 'naive-ui'
import {
  reactive, ref, watch,
} from 'vue'
import type { RouteRecordRaw } from 'vue-router/auto'
import { useRoute } from 'vue-router/auto'
import { routes } from 'vue-router/auto/routes'
import findLast from 'lodash/findLast'
import sortBy from 'lodash/sortBy'

const route = useRoute()
const menuInstRef = ref<MenuInst | null>(null)

const state = reactive<{
  menuOptions: MenuOption[]
  currentMenuKey: string
  collapsedMenu: boolean
}>({
  menuOptions: [],
  currentMenuKey: '',
  collapsedMenu: false,
})

const getMenuListByRouter = (
  routes: readonly RouteRecordRaw[],
  level: number = 0
) => {
  const menuItems: MenuOption[] = []
  sortBy(routes, 'meta.sort').forEach((routeRecordRaw) => {
    if (routeRecordRaw?.meta?.isMenu && routeRecordRaw.meta.title) {
      const hasChildren =
        routeRecordRaw.children?.length &&
        routeRecordRaw.children.some((o) => o.meta?.isMenu)
      const menuItem: MenuOption = {
        label: () => (
          <router-link
            to={routeRecordRaw.name}
            class={[
              'block',
              {
                'text-16px font-bold': level === 0,
                'c-primary!': route.path === routeRecordRaw.path,
              },
            ]}
            onClick={(e: MouseEvent) => e.stopPropagation()}>
            {routeRecordRaw?.meta?.title}
          </router-link>
        ),
        key: routeRecordRaw.name as string,
      }
      if (routeRecordRaw.meta?.icon) {
        menuItem.icon = () => {
          if (route.path.startsWith(routeRecordRaw.path)) {
            return <i class={[routeRecordRaw.meta?.iconSelected]} />
          }
          return <i class={[routeRecordRaw.meta?.icon]} />
        }
      }
      if (hasChildren) {
        menuItem.children = getMenuListByRouter(
          routeRecordRaw.children || [],
          level + 1
        )
      }
      menuItems.push(menuItem)
    }
  })
  return menuItems
}

// @ts-ignore
state.menuOptions = getMenuListByRouter(routes)

watch(
  () => route.path,
  () => {
    const matched = route.matched
    const isMenuItem = findLast(matched, (o) => !!o.meta.isMenu)
    if (isMenuItem) {
      state.currentMenuKey = isMenuItem.path
      menuInstRef.value?.showOption(isMenuItem.path)
    } else {
      state.currentMenuKey = ''
      menuInstRef.value?.showOption()
    }
  },
  {
    immediate: true,
  }
)
</script>

<template>
  <n-layout-sider
    collapse-mode="width"
    :collapsed-width="64"
    :width="240"
    :collapsed="state.collapsedMenu"
    show-trigger
    class="h-[calc(var(--h-full)-var(--header-height))] pt-6px not-select"
    :native-scrollbar="false"
    @collapse="state.collapsedMenu = true"
    @expand="state.collapsedMenu = false"
  >
    <n-menu
      ref="menuInstRef"
      v-model:value="state.currentMenuKey"
      :options="state.menuOptions"
      :root-indent="18"
      :indent="30"
      :collapsed-width="64"
      :icon-size="24"
      :collapsed-icon-size="24"
      :collapsed="state.collapsedMenu"
      :default-expand-all="true"
    />
  </n-layout-sider>
</template>
<style scoped lang="less">
:deep(.n-menu) {
  > .n-menu-item,
  .n-submenu:not(:first-child) {
    margin-top: 24px;
  }
}

:deep(.n-submenu-children) {
  .n-menu-item {
    margin-top: 4px;
  }
}
</style>
