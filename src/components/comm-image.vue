<script setup lang="ts">
import { UseImage } from '@vueuse/components'
import type { PropType } from 'vue'
const props = defineProps({
  /** 图像链接 */
  src: {
    type: String as PropType<string | null>,
  },
  /** 图片描述 */
  alt: {
    type: String as PropType<string>,
  },
  imageClass: {
    type: String,
  },
})
</script>

<template>
  <UseImage
    :src="props.src || ''"
    class="max-w-100% max-h-100% object-fit-cover"
    v-bind="$attrs"
    :class="imageClass"
  >
    <template #loading>
      <n-skeleton
        width="100%"
        height="100%"
        class="w-100% h-100%"
        v-bind="$attrs"
      />
    </template>

    <template #error>
      <div
        v-bind="$attrs"
        class="w-full h-full min-h-200px flex-center! flex-col bg-gray-dark/10 c-gray/50"
      >
        <i class="i-icon-official:empty text-150px" />
        <div>图片加载失败</div>
      </div>
    </template>
  </UseImage>
</template>
