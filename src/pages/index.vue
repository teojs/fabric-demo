<script setup lang="ts">
import { definePage } from 'vue-router/auto'
import * as fabric from 'fabric'
import {
  computed, onMounted, ref,
} from 'vue'

import * as THREE from 'three'
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

definePage({
  meta: {
    title: '首页',
    sort: 0,
    noAuth: true,
  },
})

const canvasRef = ref<HTMLCanvasElement>()
const canvas = ref<fabric.Canvas>()

const buttonRef = ref<HTMLCanvasElement>()

const threeCanvasRef = ref<HTMLCanvasElement>()
let renderer: THREE.WebGLRenderer
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
// let controls: OrbitControls;

function setDrawing() {
  if (canvas.value) {
    if (canvas.value.isDrawingMode) {
      canvas.value.isDrawingMode = false
      return
    }
    canvas.value.isDrawingMode = true

    const pencilBrush = new fabric.PencilBrush(canvas.value)
    pencilBrush.color = '#ffcc00'
    pencilBrush.width = 10
    canvas.value.freeDrawingBrush = pencilBrush
  }
}

function toJson() {
  console.log(canvas.value?.toJSON())
}

const isRotating = ref(false)
function initThreeJs() {
  const container = threeCanvasRef.value

  if (!container || !canvas.value) return

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xffeeff)

  camera = new THREE.PerspectiveCamera(45, 16 / 9, 0.1, 1000)
  // camera.position.set(0, 0.1, 1000);

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  })
  renderer.setSize(
    (16 * 50) / window.devicePixelRatio,
    (9 * 50) / window.devicePixelRatio
  )
  renderer.setPixelRatio(window.devicePixelRatio)

  container.appendChild(renderer.domElement)

  // controls = new OrbitControls(camera, renderer.domElement);
  // controls.enableDamping = true;
  // controls.enableZoom = false;
  // controls.enablePan = false;
  // controls.enableRotate = false;

  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshBasicMaterial({
    color: 0xffcc00,
  })
  const cube = new THREE.Mesh(geometry, material)
  scene.add(cube)

  camera.position.z = 5

  function animate() {
    renderer.render(scene, camera)
  }
  renderer.setAnimationLoop(animate)

  const threeScene = new fabric.FabricImage(renderer.domElement, {
    width: 16 * 50,
    height: 9 * 50,
    left: 0,
    top: 0,
  })
  canvas.value.add(threeScene)
  canvas.value.centerObject(threeScene)

  if (!buttonRef.value) return

  buttonRef.value.style.left =
    threeScene.left +
    threeScene.width / 2 -
    buttonRef.value.clientWidth / 2 +
    'px'
  buttonRef.value.style.top =
    threeScene.top +
    threeScene.height / 2 -
    buttonRef.value.clientHeight / 2 +
    'px'

  threeScene.on({
    moving: () => {
      if (!buttonRef.value) return

      buttonRef.value.style.left =
        threeScene.left +
        threeScene.width / 2 -
        buttonRef.value?.clientWidth / 2 +
        'px'
      buttonRef.value.style.top =
        threeScene.top +
        threeScene.height / 2 -
        buttonRef.value?.clientHeight / 2 +
        'px'
    },
  })
  ;(function render() {
    canvas.value.renderAll()
    fabric.util.requestAnimFrame(render)
  })()

  function onMouseMove(event: MouseEvent) {
    if (!isRotating.value) return
    const deltaX = event.movementX
    const deltaY = event.movementY

    cube.rotation.y += deltaX * 0.01
    cube.rotation.x += deltaY * 0.01
  }

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', () => {
    isRotating.value = false
  })
}

onMounted(() => {
  canvas.value = new fabric.Canvas(canvasRef.value, {
    width: 1000,
    height: 800,
    isDrawingMode: false,
    backgroundColor: '#eeeeee',
    enableRetinaScaling: true,
    skipOffscreen: true,
    controlsAboveOverlay: false,
  })

  canvas.value.selectionColor = 'rgba(255,111,0,0.3)'

  const textValue = 'Fabric 画板'
  const text = new fabric.Textbox(textValue, {
    originX: 'center',
    splitByGrapheme: true,
    width: 200,
    top: 20,
    styles: fabric.util.stylesFromArray(
      [
        {
          style: {
            fontWeight: 'bold',
            fontSize: 64,
          },
          start: 0,
          end: 9,
        },
      ],
      textValue
    ),
  })
  canvas.value.add(text)
  canvas.value.centerObjectH(text)

  canvas.value.on('mouse:wheel', function(opt) {
    const e = opt.e
    if (!e.ctrlKey || !canvas.value) {
      return
    }
    const newZoom = canvas.value.getZoom() + e.deltaY / 300
    canvas.value.zoomToPoint(
      new fabric.Point({
        x: e.offsetX,
        y: e.offsetY,
      }),
      newZoom
    )

    e.preventDefault()
    return false
  })

  initThreeJs()
})

const layers = computed(() => {
  return canvas.value?.getObjects().map((obj) => {
    return {
      name: obj.type,
      thumb: obj.toDataURL(),
      visible: obj.visible,
    }
  })
})
</script>

<template>
  <div class="relative">
    <div
      class="bg-white fixed z-100 flex flex-col gap-10px p-10px top-20px left-20px rd-6px"
    >
      <div
        v-for="(layer, i) in layers"
        :key="i"
        class="flex gap-10px items-center"
      >
        <i
          v-if="layer.visible"
          class="i-mdi:eye text-16px"
          @click="canvas.item(i).visible = false"
        />
        <i
          v-else
          class="i-mdi:eye-off text-16px"
          @click="canvas.item(i).visible = true"
        />
        <div class="w-100px h-50px rd-4px flex-center bg-gray/10">
          <img
            :src="layer.thumb"
            alt=""
            class="max-w-full max-h-full"
          >
        </div>
        <div>
          {{ layer.name }}
        </div>
      </div>
    </div>
    <div class="fixed z-100 left-50% top-20px -translate-x-50%">
      <n-button-group size="small">
        <n-button
          round
          strong
          secondary
          @click="setDrawing"
        >
          <template #icon>
            <i class="i-material-symbols:brush" />
          </template>
        </n-button>

        <n-button
          round
          strong
          secondary
          @click="toJson"
        >
          <template #icon>
            <i class="i-carbon:data-unstructured" />
          </template>
        </n-button>
      </n-button-group>
    </div>
    <canvas
      id="canvas"
      ref="canvasRef"
      width="300"
      height="300"
    />
    <div ref="threeCanvasRef" class="hidden" />
    <button
      ref="buttonRef"
      class="absolute z-100"
      style="left: 0; top: 0"
      @mousedown="isRotating = true"
      @mouseup="isRotating = false"
    >
      旋转
    </button>
  </div>
</template>

<style scoped lang="less"></style>
