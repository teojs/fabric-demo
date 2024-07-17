<script setup lang="ts">
const props = defineProps({
  text: {
    type: String,
  },
  iconClass: {
    type: String,
  },
})
</script>

<template>
  <div class="flex-col flex-center gap-20px c-gray not-select">
    <i
      class="i-icon-official:empty xl:text-200px text-5"
      :class="[iconClass]"
    />
    <div class="text-16px">{{ props.text || '暂无数据' }}</div>
    <slot name="add" />
  </div>
</template>
