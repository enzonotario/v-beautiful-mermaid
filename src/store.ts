import type { AsciiRenderOptions, DiagramColors, RenderOptions, ThemeName } from 'beautiful-mermaid'
import { DEFAULTS, THEMES } from 'beautiful-mermaid'
import { computed, reactive, ref, watch } from 'vue'

export type { AsciiRenderOptions, DiagramColors, RenderOptions, ThemeName }
export { DEFAULTS, THEMES }

export type RenderMode = 'svg' | 'ascii'
export type ColorMode = 'auto' | 'light' | 'dark'

export const DEFAULT_LIGHT_THEME = 'zinc-light'
export const DEFAULT_DARK_THEME = 'zinc-dark'

type LayoutOptions = Omit<RenderOptions, keyof DiagramColors>
type AsciiLayoutOptions = Omit<AsciiRenderOptions, 'theme' | 'colorMode'>

export interface MermaidStore {
  theme: string
  mode: RenderMode
  themeNames: string[]
  colorMode: ColorMode
  lightTheme: string
  darkTheme: string
  renderOptions: LayoutOptions
  asciiOptions: AsciiLayoutOptions
}

const STORAGE_KEY = 'vp-mermaid-theme'

export const mermaidStore = reactive<MermaidStore>({
  theme: DEFAULT_LIGHT_THEME,
  mode: 'svg',
  themeNames: [],
  colorMode: 'auto',
  lightTheme: DEFAULT_LIGHT_THEME,
  darkTheme: DEFAULT_DARK_THEME,
  renderOptions: {},
  asciiOptions: {},
})

const _isDark = ref(false)

if (typeof window !== 'undefined') {
  _isDark.value = document.documentElement.classList.contains('dark')

  const observer = new MutationObserver(() => {
    _isDark.value = document.documentElement.classList.contains('dark')
  })
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  })

  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    mermaidStore.theme = saved
  }

  watch(
    () => mermaidStore.theme,
    (val) => {
      localStorage.setItem(STORAGE_KEY, val)
    },
  )
}

export const resolvedTheme = computed(() => {
  if (mermaidStore.colorMode === 'light') return mermaidStore.lightTheme
  if (mermaidStore.colorMode === 'dark') return mermaidStore.darkTheme
  return _isDark.value ? mermaidStore.darkTheme : mermaidStore.lightTheme
})
