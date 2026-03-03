import type { App } from 'vue'
import VBeautifulMermaid from './components/VBeautifulMermaid.vue'
import { type AsciiRenderOptions, type ColorMode, type RenderOptions, mermaidStore } from './store'

export * from './store'
export { VBeautifulMermaid }

export interface MermaidOptions {
  colorMode?: ColorMode
  lightTheme?: string
  darkTheme?: string
  renderOptions?: Omit<
    RenderOptions,
    'bg' | 'fg' | 'line' | 'accent' | 'muted' | 'surface' | 'border'
  >
  asciiOptions?: Omit<AsciiRenderOptions, 'theme' | 'colorMode'>
}

export function installMermaid(app: App, options: MermaidOptions = {}) {
  if (options.colorMode !== undefined) mermaidStore.colorMode = options.colorMode
  if (options.lightTheme !== undefined) mermaidStore.lightTheme = options.lightTheme
  if (options.darkTheme !== undefined) mermaidStore.darkTheme = options.darkTheme
  if (options.renderOptions !== undefined)
    Object.assign(mermaidStore.renderOptions, options.renderOptions)
  if (options.asciiOptions !== undefined)
    Object.assign(mermaidStore.asciiOptions, options.asciiOptions)
  app.component('VBeautifulMermaid', VBeautifulMermaid)
}
