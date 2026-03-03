import { defineConfig } from 'tsdown'
import Vue from 'unplugin-vue/rolldown'

export default defineConfig([
  {
    entry: { index: 'src/index.ts' },
    platform: 'node',
    dts: true,
  },
  {
    entry: { client: 'src/client.ts' },
    platform: 'neutral',
    plugins: [Vue({ isProduction: true })],
    dts: { vue: true },
  },
])
