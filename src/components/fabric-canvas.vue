<script setup lang="ts">
import * as fabric from 'fabric'
import {
  onMounted, ref, shallowRef, watch,
} from 'vue'
import { useResizeObserver, useMagicKeys } from '@vueuse/core'

const props = withDefaults(
  defineProps<{
    canvasOptions?: Partial<fabric.CanvasOptions>
    width?: number
    height?: number
  }>(),
  {
    width: 1000,
    height: 600,
  }
)

const workspaceRef = ref<HTMLDivElement>()
const canvas = shallowRef<fabric.Canvas>()

const { space: spaceKey } = useMagicKeys()
watch(spaceKey, (v) => {
  if (canvas.value) {
    if (v) {
      canvas.value.setCursor('grab')
      canvas.value.defaultCursor = 'grab'
      canvas.value.selection = false
    } else {
      canvas.value.setCursor('default')
      canvas.value.defaultCursor = 'default'
      canvas.value.selection = true
    }
  }
})

onMounted(() => {
  // 初始化fabric
  if (!canvas.value) {
    canvas.value = new fabric.Canvas('fabric-canvas', {
      width: workspaceRef.value?.clientWidth,
      height: workspaceRef.value?.clientHeight,
      fireRightClick: true, // 启用右键，button的数字为3
      stopContextMenu: true, // 禁止默认右键菜单
      controlsAboveOverlay: true, // 超出clipPath后仍然展示控制条
      imageSmoothingEnabled: false, // 解决文字导出后不清晰问题
      preserveObjectStacking: true, // 当选择画布中的对象时，让对象不在顶层。
      enableRetinaScaling: true, // 开启高清屏
      ...props.canvasOptions,
    })

    useResizeObserver(workspaceRef, (entries) => {
      const entry = entries[0]
      const { width, height } = entry.contentRect
      if (canvas.value) {
        canvas.value.width = width
        canvas.value.height = height
      }
    })

    // 创建编辑区
    const workspace = new fabric.Rect({
      id: 'workspace',
      width: props.width,
      height: props.height,
      // strokeWidth: 1,
      // stroke: 'rgba(0,0,0,0.5)',
      fill: 'rgba(255,255,255,1)',
      hasControls: false,
      selectable: false,
      hoverCursor: 'default',
    })
    canvas.value.add(workspace)
    canvas.value.centerObject(workspace)
    canvas.value.clipPath = workspace

    canvas.value.on('mouse:wheel', function(opt) {
      const e = opt.e
      e.preventDefault()
      if (!e.ctrlKey || !canvas.value) {
        return
      }
      const newZoom = canvas.value.getZoom() - e.deltaY / 300
      canvas.value.zoomToPoint(
        new fabric.Point({
          x: e.offsetX,
          y: e.offsetY,
        }),
        newZoom
      )
      return false
    })

    canvas.value.on('mouse:down', function(opt) {
      if (spaceKey.value) {
        opt.e.preventDefault()
        canvas.value!.setCursor('grabbing')
        canvas.value!.defaultCursor = 'grabbing'
      }
    })

    canvas.value.on('mouse:up', function(opt) {
      if (spaceKey.value) {
        canvas.value!.setCursor('grab')
        canvas.value!.defaultCursor = 'grab'
      }
    })
  }
})

defineExpose({
  canvas,
})
</script>

<template>
  <div id="workspace" ref="workspaceRef">
    <canvas
      id="fabric-canvas"
      width="300"
      height="300"
    />
    <div
      v-for="resizeBar in ['top', 'right', 'bottom', 'left']"
      :key="resizeBar"
    />
  </div>
</template>

<style scoped lang="less">
#workspace {
  width: 100%;
  height: 100%;
  position: relative;
}
#fabric-canvas {
  --offsetX: 0px;
  --offsetY: 0px;
  --size: 12px;
  --color: #dedcdc;
  background-image: linear-gradient(
      45deg,
      var(--color) 25%,
      transparent 0,
      transparent 75%,
      var(--color) 0
    ),
    linear-gradient(
      45deg,
      var(--color) 25%,
      transparent 0,
      transparent 75%,
      var(--color) 0
    );
  background-position:
    var(--offsetX) var(--offsetY),
    calc(var(--size) + var(--offsetX)) calc(var(--size) + var(--offsetY));
  background-size: calc(var(--size) * 2) calc(var(--size) * 2);
}
</style>
