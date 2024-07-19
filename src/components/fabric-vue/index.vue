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

const workspaceEl = ref<HTMLDivElement>()
const canvas = shallowRef<fabric.Canvas>()
const drawingBoard = shallowRef<fabric.Rect>()
function initWorkspace() {
  if (!canvas.value) {
    canvas.value = new fabric.Canvas('fabric-canvas', {
      width: workspaceEl.value?.clientWidth,
      height: workspaceEl.value?.clientHeight,
      fireRightClick: true, // 启用右键，button的数字为3
      stopContextMenu: true, // 禁止默认右键菜单
      controlsAboveOverlay: true, // 超出clipPath后仍然展示控制条
      imageSmoothingEnabled: false, // 解决文字导出后不清晰问题
      preserveObjectStacking: true, // 当选择画布中的对象时，让对象不在顶层。
      enableRetinaScaling: true, // 开启高清屏
      ...props.canvasOptions,
    })

    drawingBoard.value = new fabric.Rect({
      id: 'workspace',
      width: props.width,
      height: props.height,
      // strokeWidth: 1,
      // stroke: 'rgba(0,0,0,0.5)',
      fill: 'rgba(255,255,255,1)',
      // hasControls: false,
      // selectable: false,
      hoverCursor: 'default',
    })
    canvas.value.add(drawingBoard.value)
    canvas.value.centerObject(drawingBoard.value)
    canvas.value.clipPath = drawingBoard.value
    setWorkspaceZoom()
  }
}

function getScale() {
  if (!drawingBoard.value) return 1
  return fabric.util.findScaleToFit(drawingBoard.value, {
    width: workspaceEl.value?.offsetWidth || 1000,
    height: workspaceEl.value?.offsetHeight || 600,
  })
}

function setWorkspaceZoom() {
  if (!canvas.value) return
  const center = canvas.value.getCenterPoint()
  const scale = getScale()
  canvas.value.zoomToPoint(new fabric.Point(center.x, center.y), scale * 0.8)
}

const resizeBars = ref<
  {
    direction: string
    x: number
    y: number
  }[]
>([])
function initResizeBar() {
  if (!canvas.value || !drawingBoard.value) return
  const viewportTransform = canvas.value.viewportTransform
  const [scaleX, , , scaleY, offsetX, offsetY] = viewportTransform || []
  const wsWidth = drawingBoard.value.width * scaleX
  const wsHeight = drawingBoard.value.height * scaleY
  const wsLeft = drawingBoard.value.left * scaleX
  const wsTop = drawingBoard.value.top * scaleY
  const bWidth = 30
  const bHeight = 6
  const bPadding = 10

  resizeBars.value = [
    {
      direction: 'left',
      x: offsetX + wsLeft - bHeight - bPadding,
      y: offsetY + wsTop + wsHeight / 2 - bWidth / 2,
    },
    {
      direction: 'right',
      x: offsetX + wsLeft + wsWidth + bPadding,
      y: offsetY + wsTop + wsHeight / 2 - bWidth / 2,
    },
    {
      direction: 'top',
      x: offsetX + wsLeft + wsWidth / 2 - bWidth / 2,
      y: offsetY + wsTop - bHeight - bPadding,
    },
    {
      direction: 'bottom',
      x: offsetX + wsLeft + wsWidth / 2 - bWidth / 2,
      y: offsetY + wsTop + wsHeight + bPadding,
    },
  ]
}

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

function initZoom() {
  if (!canvas.value) return

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
    initResizeBar()
    return false
  })
}

function initResize() {
  if (!canvas.value) return

  useResizeObserver(workspaceEl, (entries) => {
    const entry = entries[0]
    const { width, height } = entry.contentRect

    if (canvas.value) {
      canvas.value.width = width
      canvas.value.height = height
    }
  })
}

function initDrag() {
  if (!canvas.value) return

  canvas.value.on('mouse:down', function(opt) {
    if (spaceKey.value) {
      opt.e.preventDefault()
      canvas.value!.setCursor('grabbing')
      canvas.value!.defaultCursor = 'grabbing'
    }
  })

  canvas.value.on('mouse:up', function() {
    if (spaceKey.value) {
      canvas.value!.setCursor('grab')
      canvas.value!.defaultCursor = 'grab'
    }
  })

  canvas.value.on('mouse:move', function(opt) {
    if (spaceKey.value) {
      opt.e.preventDefault()
    }
  })
}

onMounted(() => {
  initWorkspace()

  initResizeBar()

  initZoom()
  initResize()
  initDrag()
})

defineExpose({
  canvas,
})
</script>

<template>
  <div id="workspace" ref="workspaceEl">
    <canvas
      id="fabric-canvas"
      width="300"
      height="300"
    />
    <div
      v-for="resizeBar in resizeBars"
      :key="resizeBar.direction"
      :class="[
        'bg-gray/50 absolute rd-3px hover:bg-primary/80 transition',
        {
          'w-6px h-30px cursor-ew-resize':
            resizeBar.direction === 'left' || resizeBar.direction === 'right',
          'w-30px h-6px cursor-ns-resize':
            resizeBar.direction === 'top' || resizeBar.direction === 'bottom',
        },
      ]"
      :style="{
        left: resizeBar.x + 'px',
        top: resizeBar.y + 'px',
      }"
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
