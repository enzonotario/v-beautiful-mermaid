import type { AsciiRenderOptions, DiagramColors, RenderOptions } from 'beautiful-mermaid'
import { THEMES, renderMermaidASCII, renderMermaidSVG } from 'beautiful-mermaid'
import type MarkdownIt from 'markdown-it'

const DEFAULT_LIGHT_THEME = 'zinc-light'
const DEFAULT_DARK_THEME = 'zinc-dark'

export type { AsciiRenderOptions, DiagramColors, RenderOptions, ThemeName } from 'beautiful-mermaid'
export type RenderMode = 'svg' | 'ascii'
export type ColorMode = 'auto' | 'light' | 'dark'

type LayoutOptions = Omit<RenderOptions, keyof DiagramColors>
type AsciiLayoutOptions = Omit<AsciiRenderOptions, 'theme' | 'colorMode'>

export interface PluginOptions {
  theme?: string
  defaultMode?: RenderMode
  colorMode?: ColorMode
  lightTheme?: string
  darkTheme?: string
  /** Layout, font, and rendering options passed to renderMermaidSVG at build time */
  renderOptions?: LayoutOptions
  /** ASCII layout options passed to renderMermaidASCII at build time */
  asciiOptions?: AsciiLayoutOptions
}

export function vitepressBeautifulMermaid(md: MarkdownIt, options: PluginOptions = {}) {
  const defaultRenderer = md.renderer.rules.fence?.bind(md.renderer.rules)

  md.renderer.rules.fence = (tokens, idx, opts, env, self) => {
    const token = tokens[idx]
    const info = token.info ? token.info.trim() : ''

    if (info === 'mermaid' || info === 'mermaid-ascii' || info === 'mermaid-svg') {
      const content = token.content.trim()

      let mode: RenderMode = options.defaultMode || 'svg'
      if (info === 'mermaid-ascii') mode = 'ascii'
      if (info === 'mermaid-svg') mode = 'svg'

      const encodedCode = Buffer.from(content).toString('base64')

      let prerendered = ''
      if (mode === 'svg') {
        try {
          const prerenderTheme = resolvePrerenderedTheme(options)
          const theme = THEMES[prerenderTheme] || THEMES[DEFAULT_LIGHT_THEME]
          prerendered = renderMermaidSVG(content, { ...theme, ...options.renderOptions })
        } catch (_e) {
          prerendered = ''
        }
      } else if (mode === 'ascii') {
        try {
          const prerenderTheme = resolvePrerenderedTheme(options)
          const theme = THEMES[prerenderTheme] || THEMES[DEFAULT_LIGHT_THEME]
          prerendered = renderMermaidASCII(content, {
            ...options.asciiOptions,
            colorMode: 'html',
            theme,
          })
        } catch (_e) {
          prerendered = ''
        }
      }

      return `<VBeautifulMermaid code="${encodedCode}" mode="${mode}" prerendered="${md.utils.escapeHtml(prerendered)}" />`
    }

    return defaultRenderer ? defaultRenderer(tokens, idx, opts, env, self) : ''
  }
}

function resolvePrerenderedTheme(options: PluginOptions): string {
  if (options.colorMode === 'dark') {
    return options.darkTheme || DEFAULT_DARK_THEME
  }
  if (options.colorMode === 'light' || options.colorMode === 'auto') {
    return options.lightTheme || DEFAULT_LIGHT_THEME
  }
  return options.theme || DEFAULT_LIGHT_THEME
}

export default vitepressBeautifulMermaid
