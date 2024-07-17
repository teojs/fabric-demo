import {
  defineConfig,
  presetIcons,
  presetMini,
  presetAttributify,
} from 'unocss'
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'

export default defineConfig({
  content: {
    filesystem: ['public/**/*.json', 'src/**/*.{vue,ts,js}'],
  },
  presets: [
    presetAttributify(),
    presetIcons({
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
      },
      collections: {
        /** 从iconfont下载的图标统一使用svg格式，
         * 然后放在 ./src/assets/icon/ 目录下,
         * 颜色统一改成 #cccccc 才能进行颜色控制.
         * 优先在此处寻找图标，https://icones.js.org
         * @example <i class="i-icon:图标名" />
         */
        icon: FileSystemIconLoader('./src/assets/icon/', (svg) =>
          svg.replace(/#cccccc/, 'currentColor')
        ),
      },
      warn: true,
    }),
    presetMini(),
  ],
  shortcuts: {
    'flex-center': 'flex items-center justify-center',
    'bg-white': 'bg-white dark:bg-#18181C',
    hearder:
      'flex justify-between items-center transition relative bg-white h-[var(--header-height)] shadow-[var(--box-shadow)]',
    'bg-card': 'bg-#f5f5f7 dark:bg-gray/10',
    'table-button':
      'c-primary cursor-pointer flex-center px-8px py-3px rounded-4px hover:bg-gray/20 transition text-nowrap not-select',
    'table-button-disabled': 'cursor-not-allowed text-gray pointer-events-none',
  },
  rules: [
    [
      'not-select',
      {
        'user-select': 'none',
      },
      {
        layer: '禁止选中文字',
      },
    ],
    [
      'transition-base',
      {
        'transition-property':
          'color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter',
        'transition-duration': '0.2s',
        'transition-timing-function': 'linear',
      },
      {
        layer: '默认过渡效果',
      },
    ],
    [
      'transition-pulse',
      {
        'transition-property':
          'color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter',
        'transition-duration': '0.2s',
        'transition-timing-function': 'cubic-bezier(0.58, 0.59, 0.55, 1.41)',
      },
      {
        layer: '弹跳过渡效果',
      },
    ],
    [
      'blur',
      {
        background: 'rgba(255, 255, 255, 0.25)',
        '-webkit-backdrop-filter': 'blur(4px)',
        'backdrop-filter': 'blur(4px)',
        'box-shadow': '0 8px 32px 0 rgba( 0, 0, 0, 0.4 )',
        'border-radius': '4px',
        border: '1px solid rgba( 255, 255, 255, 0.18 )',
      },
      {
        layer: '磨砂玻璃效果',
      },
    ],
    [
      /^object-fit-(.+)$/,
      ([, value]) => ({
        'object-fit': `${value}`,
      }),
    ],
    [
      /^blur-(\d+)$/,
      ([, value]) => ({
        'backdrop-filter': `blur(${value}px)`,
      }),
    ],
    [
      /^break-inside-(.+)$/,
      ([, value]) => ({
        'break-inside': `${value}`,
      }),
    ],
    [
      /^columns-(\d+)$/,
      ([, value]) => ({
        columns: value,
      }),
    ],
    [
      /^column-gap-(.+)$/,
      ([, value]) => ({
        'column-gap': value,
      }),
    ],
    [
      /^grayscale-(.+)$/,
      ([, value]) => ({
        filter: `grayscale(${value})`,
      }),
    ],

    [
      'h-container',
      {
        height: 'var(--container-full)',
      },
      {
        layer: '主内容区域高度',
        autocomplete: 'h-container',
      },
    ],

    [
      'p-gap',
      {
        padding: 'var(--block-gap)',
      },
      {
        layer: '内边距，用于最外围的容器',
        autocomplete: 'p-gap',
      },
    ],

    [
      'py-gap',
      {
        'padding-top': 'var(--block-gap)',
        'padding-bottom': 'var(--block-gap)',
      },
      {
        layer: '内边距，用于最外围的容器',
        autocomplete: 'py-gap',
      },
    ],
    [
      'px-gap',
      {
        'padding-left': 'var(--block-gap)',
        'padding-right': 'var(--block-gap)',
      },
      {
        layer: '内边距，用于最外围的容器',
        autocomplete: 'px-gap',
      },
    ],
    [
      // the animation of dark toggle button
      /^\$ui-dark-toggle-vtr$/,
      () => {
        return `
          ::view-transition-old(root),
          ::view-transition-new(root) {
            animation: none;
            mix-blend-mode: normal;
          }

          ::view-transition-old(root),
          .dark::view-transition-new(root) {
            z-index: 1;
          }

          ::view-transition-new(root),
          .dark::view-transition-old(root) {
            z-index: 9999;
          }
        `
      },
    ],
    [
      'shadow',
      {
        'box-shadow': 'var(--box-shadow)',
      },
      {
        layer: '投影',
        autocomplete: 'shadow',
      },
    ],
  ],
  theme: {
    colors: {
      primary: 'rgba(var(--color-primary))',
      blue: 'rgba(var(--color-blue))',
      cyan: 'rgba(var(--color-cyan))',
      'purple-dark': 'rgba(var(--color-purple-dark))',
      'purple-light': 'rgba(var(--color-purple-light))',
      'turquoise-dark': 'rgba(var(--color-turquoise-dark))',
      'turquoise-light': 'rgba(var(--color-turquoise-light))',
      'gray-dark': 'rgba(var(--color-gray-dark))',
      'gray-light': 'rgba(var(--color-gray-light))',
      gray: 'rgba(var(--color-gray))',
      success: 'rgba(var(--color-success))',
      warning: 'rgba(var(--color-warning))',
      danger: 'rgba(var(--color-danger))',
      'gray-light-original': 'rgba(var(--color-gray-light-original))',
      'gray-dark-original': 'rgba(var(--color-gray-dark-original))',
      'gray-original': 'rgba(var(--color-gray-original))',
    },
  },
})
