<script setup lang="ts">
import { definePage } from 'vue-router/auto'

definePage({
  meta: {
    title: '404',
    layout: 'blank',
    noAuth: true,
  },
})
</script>

<template>
  <div class="h-[var(--h-full)] flex-center flex-col">
    <i class="i-icon:404 text-24 xl:text-700px" />
    <router-link
      to="/"
      class="fixed bottom-1 left-50% transform-translate-x--50%"
    >
      <n-button>Back to Home</n-button>
    </router-link>
  </div>
</template>
