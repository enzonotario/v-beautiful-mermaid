import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue(), UnoCSS()],
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
})
