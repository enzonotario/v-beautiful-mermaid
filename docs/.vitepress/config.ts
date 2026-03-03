import { resolve } from 'node:path'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vitepress'
import { vitepressBeautifulMermaid } from '../../src/index'
import { vitepressLogoSvg, vueLogoSvg } from './icons'

export default defineConfig({
  title: 'v-beautiful-mermaid',
  description: 'Elegant Mermaid diagrams for VitePress and Vue 3',
  vite: {
    plugins: [UnoCSS()],
    resolve: {
      alias: {
        'v-beautiful-mermaid/style.css': resolve(__dirname, '../../src/style.css'),
        'v-beautiful-mermaid/client': resolve(__dirname, '../../src/client.ts'),
        'v-beautiful-mermaid': resolve(__dirname, '../../src/index.ts'),
      },
    },
  },
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/vue' },
      { text: 'Demo', link: '/demos/basic' },
    ],
    sidebar: [
      {
        text: `${vueLogoSvg} Vue Component`,
        items: [{ text: 'Getting Started', link: '/guide/vue' }],
      },
      {
        text: `${vitepressLogoSvg} VitePress Plugin`,
        items: [{ text: 'Getting Started', link: '/guide/vitepress' }],
      },
      {
        text: '<span class="i-lucide-layout-panel-left inline-block mr-1.5 align-middle"></span> Demos',
        items: [
          { text: 'Basic Demo', link: '/demos/basic' },
          { text: 'Advanced Demo', link: '/demos/advanced' },
        ],
      },
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/enzonotario/v-beautiful-mermaid' }],
    footer: {
      message:
        'Released under the <a href="https://github.com/enzonotario/v-beautiful-mermaid/blob/main/LICENSE">MIT License</a>.',
      copyright: 'Copyright © 2026-present <a href="https://enzonotario.me">Enzo Notario</a>',
    },
  },
  markdown: {
    config: (md) => {
      md.use(vitepressBeautifulMermaid)
    },
  },
})
