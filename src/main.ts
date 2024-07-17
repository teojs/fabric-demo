import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import skeleton from '@/utils/directive/skeleton'
import fillHeight from '@/utils/directive/fill-height'
import mouseParallax from '@/utils/directive/mouse-parallax'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'

import '@unocss/reset/normalize.css'
import 'virtual:uno.css'
import '@/styles/index.less'

import '@/utils/set-root-fontsize'

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app
  .use(router)
  .use(pinia)
  .use(autoAnimatePlugin)
  .directive('skeleton', skeleton)
  .directive('fill-height', fillHeight)
  .directive('mouse-parallax', mouseParallax)

app.mount('#app')
