/// <reference types="vite/client" />
/// <reference types="naive-ui/volar" />
/// <reference types="vite-plugin-vue-layouts/client" />
/// <reference types="vite-plugin-eslint/dist" />

interface ImportMetaEnv {
  readonly VITE_AMAP_KEY: string
  readonly VITE_AMAP_SECURITY_JS_CODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
