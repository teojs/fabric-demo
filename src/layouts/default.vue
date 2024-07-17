<script setup lang="ts">
import DefaultLayoutHeader from './default-components/default-layout-header.vue'
import DefaultLayoutAside from './default-components/default-layout-aside.vue'
</script>

<template>
  <section>
    <default-layout-header />
    <n-layout
      has-sider
      class="bg-transparent h-[calc(var(--h-full)-var(--header-height))]"
      :native-scrollbar="false"
    >
      <default-layout-aside id="default-layout-aside" />
      <n-layout-content
        id="default-layout-content"
        class="bg-transparent"
        :content-style="{
          padding: 'var(--block-gap)',
          height: 'calc(var(--h-full) - var(--header-height))',
        }"
      >
        <router-view />
      </n-layout-content>
    </n-layout>
  </section>
</template>

<style scoped lang="less">
@media print {
  #default-layout-header {
    display: none;
  }
  @page {
    margin: 0; /* 调整打印页面的边距 */
  }
}
</style>
