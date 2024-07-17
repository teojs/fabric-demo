import type { Directive } from 'vue'
declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    vFillHeight: Directive
    vMouseParallax: Directive
    vSkeleton: Directive<any, boolean>
  }
}
