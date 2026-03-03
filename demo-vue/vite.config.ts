import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [UnoCSS(), vue()],
  resolve: {
    alias: [
      {
        find: 'v-beautiful-mermaid/style.css',
        replacement: resolve(__dirname, '../src/style.css'),
      },
      {
        find: 'v-beautiful-mermaid/client',
        replacement: resolve(__dirname, '../src/client.ts'),
      },
      {
        find: 'v-beautiful-mermaid',
        replacement: resolve(__dirname, '../src/index.ts'),
      },
    ],
  },
})
