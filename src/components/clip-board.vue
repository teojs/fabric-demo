<script setup lang="ts">
import { useClipboard } from '@vueuse/core'

defineProps({
  text: {
    type: String,
  },
})

const { copy, copied } = useClipboard()
</script>

<template>
  <n-popover trigger="hover">
    <template #trigger>
      <span @click="copy(text || '')">
        <slot />
      </span>
    </template>
    <span v-if="copied" class="c-success">已复制</span>
    <span v-else>点击复制</span>
  </n-popover>
</template>
