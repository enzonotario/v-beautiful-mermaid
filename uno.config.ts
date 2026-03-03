import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
  ],
  theme: {
    colors: {
      brand: {
        1: 'var(--vp-c-brand-1)',
        soft: 'var(--vp-c-brand-soft)',
      },
      divider: 'var(--vp-c-divider)',
      text: {
        1: 'var(--vp-c-text-1)',
        2: 'var(--vp-c-text-2)',
        3: 'var(--vp-c-text-3)',
      },
    },
  },
  transformers: [transformerDirectives(), transformerVariantGroup()],
})
