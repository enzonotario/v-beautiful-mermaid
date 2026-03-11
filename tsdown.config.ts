import { defineConfig } from 'tsdown'
import Vue from 'unplugin-vue/rolldown'

export default defineConfig([
  {
    entry: { 
      index: 'src/index.ts',
      nuxt: 'src/nuxt.ts'
    },
    platform: 'node',
    dts: true,
    external: ['@nuxt/kit', '@nuxt/schema']
  },
  {
    entry: { client: 'src/client.ts' },
    platform: 'neutral',
    plugins: [Vue({ isProduction: true })],
    dts: { vue: true },
  },
])
