<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { THEMES } from 'beautiful-mermaid'
import { DEFAULT_DARK_THEME, DEFAULT_LIGHT_THEME, mermaidStore } from 'v-beautiful-mermaid/client'
import { useRoute } from 'vitepress'
import { computed, reactive, ref, watch } from 'vue'

const route = useRoute()
const isDemo = computed(() => route.path.includes('/demos/'))

const isOpen = ref(false)
const activeTab = ref<'theme' | 'svg' | 'ascii' | 'code'>('theme')
const copied = ref(false)

const DEFAULTS = {
  lightTheme: DEFAULT_LIGHT_THEME,
  darkTheme: DEFAULT_DARK_THEME,
  colorMode: 'auto' as const,
  font: 'Inter',
  padding: 40,
  nodeSpacing: 24,
  layerSpacing: 40,
  componentSpacing: 24,
  thoroughness: 3,
  transparent: false,
  interactive: false,
  useAscii: false,
  paddingX: 5,
  paddingY: 5,
  boxBorderPadding: 1,
}

const config = reactive({ ...DEFAULTS })

watch(
  config,
  () => {
    mermaidStore.lightTheme = config.lightTheme
    mermaidStore.darkTheme = config.darkTheme
    mermaidStore.colorMode = config.colorMode
    Object.assign(mermaidStore.renderOptions, {
      font: config.font,
      padding: config.padding,
      nodeSpacing: config.nodeSpacing,
      layerSpacing: config.layerSpacing,
      componentSpacing: config.componentSpacing,
      thoroughness: config.thoroughness,
      transparent: config.transparent,
      interactive: config.interactive,
    })
    Object.assign(mermaidStore.asciiOptions, {
      useAscii: config.useAscii,
      paddingX: config.paddingX,
      paddingY: config.paddingY,
      boxBorderPadding: config.boxBorderPadding,
    })
  },
  { deep: true },
)

const generatedCode = computed(() => {
  const opts: Record<string, any> = {}

  if (config.lightTheme !== DEFAULTS.lightTheme) opts.lightTheme = config.lightTheme
  if (config.darkTheme !== DEFAULTS.darkTheme) opts.darkTheme = config.darkTheme
  if (config.colorMode !== DEFAULTS.colorMode) opts.colorMode = config.colorMode

  const ro: Record<string, any> = {}
  if (config.font !== DEFAULTS.font) ro.font = config.font
  if (config.padding !== DEFAULTS.padding) ro.padding = config.padding
  if (config.nodeSpacing !== DEFAULTS.nodeSpacing) ro.nodeSpacing = config.nodeSpacing
  if (config.layerSpacing !== DEFAULTS.layerSpacing) ro.layerSpacing = config.layerSpacing
  if (config.componentSpacing !== DEFAULTS.componentSpacing)
    ro.componentSpacing = config.componentSpacing
  if (config.thoroughness !== DEFAULTS.thoroughness) ro.thoroughness = config.thoroughness
  if (config.transparent !== DEFAULTS.transparent) ro.transparent = config.transparent
  if (config.interactive !== DEFAULTS.interactive) ro.interactive = config.interactive
  if (Object.keys(ro).length) opts.renderOptions = ro

  const ao: Record<string, any> = {}
  if (config.useAscii !== DEFAULTS.useAscii) ao.useAscii = config.useAscii
  if (config.paddingX !== DEFAULTS.paddingX) ao.paddingX = config.paddingX
  if (config.paddingY !== DEFAULTS.paddingY) ao.paddingY = config.paddingY
  if (config.boxBorderPadding !== DEFAULTS.boxBorderPadding)
    ao.boxBorderPadding = config.boxBorderPadding
  if (Object.keys(ao).length) opts.asciiOptions = ao

  if (!Object.keys(opts).length) return 'installMermaid(app)'

  const lines: string[] = []
  for (const [k, v] of Object.entries(opts)) {
    if (v !== null && typeof v === 'object') {
      lines.push(`  ${k}: {`)
      for (const [k2, v2] of Object.entries(v)) lines.push(`    ${k2}: ${JSON.stringify(v2)},`)
      lines.push('  },')
    } else {
      lines.push(`  ${k}: ${JSON.stringify(v)},`)
    }
  }
  return `installMermaid(app, {\n${lines.join('\n')}\n})`
})

const isModified = computed(() =>
  Object.keys(DEFAULTS).some(
    (k) => config[k as keyof typeof DEFAULTS] !== DEFAULTS[k as keyof typeof DEFAULTS],
  ),
)

const themeNames = Object.keys(THEMES)
const formatName = (n: string) =>
  n
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ')
const resetToDefaults = () => Object.assign(config, DEFAULTS)
const copyCode = async () => {
  await navigator.clipboard.writeText(generatedCode.value)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 1500)
}

const tabs = [
  { id: 'theme', label: 'Theme', icon: 'lucide:palette' },
  { id: 'svg', label: 'SVG', icon: 'lucide:sliders-horizontal' },
  { id: 'ascii', label: 'ASCII', icon: 'lucide:terminal' },
  { id: 'code', label: 'Code', icon: 'lucide:code-2' },
] as const
</script>

<template>
  <Teleport to="body">
    <div v-if="isDemo" class="cfg-root">
      <!-- Floating toggle button -->
      <button class="cfg-fab" :class="{ 'cfg-fab--modified': isModified, 'cfg-fab--open': isOpen }" @click="isOpen = !isOpen" :title="isOpen ? 'Close configurator' : 'Open configurator'">
        <Icon :icon="isOpen ? 'lucide:x' : 'lucide:settings-2'" width="20" height="20" />
        <span v-if="isModified && !isOpen" class="cfg-dot" />
      </button>

      <!-- Panel -->
      <Transition name="cfg-slide">
        <div v-if="isOpen" class="cfg-panel">
          <div class="cfg-header">
            <span class="cfg-title">
              <Icon icon="lucide:settings-2" width="15" height="15" />
              Configurator
            </span>
            <button v-if="isModified" class="cfg-reset" @click="resetToDefaults" title="Reset to defaults">
              <Icon icon="lucide:rotate-ccw" width="13" height="13" />
              Reset
            </button>
          </div>

          <!-- Tabs -->
          <div class="cfg-tabs">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              class="cfg-tab"
              :class="{ 'cfg-tab--active': activeTab === tab.id }"
              @click="activeTab = tab.id"
            >
              <Icon :icon="tab.icon" width="13" height="13" />
              {{ tab.label }}
            </button>
          </div>

          <div class="cfg-body">
            <!-- Theme tab -->
            <template v-if="activeTab === 'theme'">
              <div class="cfg-field">
                <label class="cfg-label">Light Theme</label>
                <select v-model="config.lightTheme" class="cfg-select">
                  <option v-for="n in themeNames" :key="n" :value="n">{{ formatName(n) }}</option>
                </select>
              </div>
              <div class="cfg-field">
                <label class="cfg-label">Dark Theme</label>
                <select v-model="config.darkTheme" class="cfg-select">
                  <option v-for="n in themeNames" :key="n" :value="n">{{ formatName(n) }}</option>
                </select>
              </div>
              <div class="cfg-field">
                <label class="cfg-label">Color Mode</label>
                <div class="cfg-radio-group">
                  <label v-for="m in ['auto', 'light', 'dark']" :key="m" class="cfg-radio">
                    <input type="radio" v-model="config.colorMode" :value="m" />
                    {{ m.charAt(0).toUpperCase() + m.slice(1) }}
                  </label>
                </div>
              </div>
            </template>

            <!-- SVG tab -->
            <template v-if="activeTab === 'svg'">
              <div class="cfg-field">
                <label class="cfg-label">Font</label>
                <input v-model="config.font" class="cfg-input" placeholder="Inter" />
              </div>
              <div class="cfg-field">
                <label class="cfg-label">
                  Padding
                  <span class="cfg-value">{{ config.padding }}px</span>
                </label>
                <input type="range" v-model.number="config.padding" min="0" max="120" step="4" class="cfg-range" />
              </div>
              <div class="cfg-field">
                <label class="cfg-label">
                  Node Spacing
                  <span class="cfg-value">{{ config.nodeSpacing }}px</span>
                </label>
                <input type="range" v-model.number="config.nodeSpacing" min="4" max="80" step="4" class="cfg-range" />
              </div>
              <div class="cfg-field">
                <label class="cfg-label">
                  Layer Spacing
                  <span class="cfg-value">{{ config.layerSpacing }}px</span>
                </label>
                <input type="range" v-model.number="config.layerSpacing" min="4" max="120" step="4" class="cfg-range" />
              </div>
              <div class="cfg-field">
                <label class="cfg-label">
                  Component Spacing
                  <span class="cfg-value">{{ config.componentSpacing }}px</span>
                </label>
                <input type="range" v-model.number="config.componentSpacing" min="4" max="80" step="4" class="cfg-range" />
              </div>
              <div class="cfg-field">
                <label class="cfg-label">
                  Thoroughness
                  <span class="cfg-value">{{ config.thoroughness }}</span>
                </label>
                <input type="range" v-model.number="config.thoroughness" min="1" max="7" step="1" class="cfg-range" />
                <div class="cfg-range-labels">
                  <span>Fast</span><span>Best</span>
                </div>
              </div>
              <div class="cfg-toggles">
                <label class="cfg-toggle">
                  <input type="checkbox" v-model="config.transparent" />
                  <span class="cfg-toggle-track"><span class="cfg-toggle-thumb" /></span>
                  Transparent background
                </label>
                <label class="cfg-toggle">
                  <input type="checkbox" v-model="config.interactive" />
                  <span class="cfg-toggle-track"><span class="cfg-toggle-thumb" /></span>
                  Interactive XY charts
                </label>
              </div>
            </template>

            <!-- ASCII tab -->
            <template v-if="activeTab === 'ascii'">
              <div class="cfg-toggles">
                <label class="cfg-toggle">
                  <input type="checkbox" v-model="config.useAscii" />
                  <span class="cfg-toggle-track"><span class="cfg-toggle-thumb" /></span>
                  ASCII chars (+ - |) instead of Unicode
                </label>
              </div>
              <div class="cfg-field">
                <label class="cfg-label">
                  Horizontal Spacing
                  <span class="cfg-value">{{ config.paddingX }}</span>
                </label>
                <input type="range" v-model.number="config.paddingX" min="1" max="20" step="1" class="cfg-range" />
              </div>
              <div class="cfg-field">
                <label class="cfg-label">
                  Vertical Spacing
                  <span class="cfg-value">{{ config.paddingY }}</span>
                </label>
                <input type="range" v-model.number="config.paddingY" min="1" max="20" step="1" class="cfg-range" />
              </div>
              <div class="cfg-field">
                <label class="cfg-label">
                  Box Border Padding
                  <span class="cfg-value">{{ config.boxBorderPadding }}</span>
                </label>
                <input type="range" v-model.number="config.boxBorderPadding" min="0" max="6" step="1" class="cfg-range" />
              </div>
            </template>

            <!-- Code tab -->
            <template v-if="activeTab === 'code'">
              <p class="cfg-code-hint">Paste this in your <code>.vitepress/theme/index.ts</code>:</p>
              <div class="cfg-code-wrap">
                <pre class="cfg-code">{{ generatedCode }}</pre>
                <button class="cfg-copy" @click="copyCode" :title="copied ? 'Copied!' : 'Copy'">
                  <Icon :icon="copied ? 'lucide:check' : 'lucide:copy'" width="14" height="14" />
                  {{ copied ? 'Copied!' : 'Copy' }}
                </button>
              </div>
              <p v-if="!isModified" class="cfg-code-default">
                All values are at their defaults — change options in other tabs to generate config.
              </p>
            </template>
          </div>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<style scoped>
.cfg-root {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 200;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
}

/* FAB */
.cfg-fab {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1.5px solid var(--vp-c-divider);
  background: var(--vp-c-bg-elv);
  color: var(--vp-c-text-2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(0,0,0,0.12);
  transition: all 0.2s;
  position: relative;
  flex-shrink: 0;
}
.cfg-fab:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  transform: scale(1.05);
}
.cfg-fab--open {
  background: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}
.cfg-dot {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  border: 1.5px solid var(--vp-c-bg-elv);
}

/* Panel */
.cfg-panel {
  width: 300px;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  box-shadow: 0 8px 40px rgba(0,0,0,0.15);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 100px);
}

.cfg-slide-enter-active,
.cfg-slide-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.cfg-slide-enter-from,
.cfg-slide-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.97);
}

/* Header */
.cfg-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px 0;
}
.cfg-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.cfg-reset {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
  background: transparent;
  color: var(--vp-c-text-3);
  font-size: 11px;
  cursor: pointer;
  transition: all 0.15s;
}
.cfg-reset:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

/* Tabs */
.cfg-tabs {
  display: flex;
  gap: 2px;
  padding: 10px 10px 0;
}
.cfg-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 6px 4px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--vp-c-text-3);
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}
.cfg-tab:hover {
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
}
.cfg-tab--active {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

/* Body */
.cfg-body {
  padding: 12px 14px 14px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cfg-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.cfg-label {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}
.cfg-value {
  font-weight: 600;
  color: var(--vp-c-brand-1);
  font-variant-numeric: tabular-nums;
}
.cfg-select,
.cfg-input {
  width: 100%;
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 12px;
  outline: none;
  transition: border-color 0.15s;
}
.cfg-select:focus,
.cfg-input:focus {
  border-color: var(--vp-c-brand-1);
}

.cfg-range {
  width: 100%;
  accent-color: var(--vp-c-brand-1);
  cursor: pointer;
}
.cfg-range-labels {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: var(--vp-c-text-3);
  margin-top: -4px;
}

.cfg-radio-group {
  display: flex;
  gap: 12px;
}
.cfg-radio {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: var(--vp-c-text-1);
  cursor: pointer;
}
.cfg-radio input { accent-color: var(--vp-c-brand-1); cursor: pointer; }

/* Toggles */
.cfg-toggles {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.cfg-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--vp-c-text-1);
  cursor: pointer;
}
.cfg-toggle input { display: none; }
.cfg-toggle-track {
  flex-shrink: 0;
  width: 32px;
  height: 18px;
  border-radius: 9px;
  background: var(--vp-c-divider);
  position: relative;
  transition: background 0.2s;
}
.cfg-toggle input:checked ~ .cfg-toggle-track {
  background: var(--vp-c-brand-1);
}
.cfg-toggle-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: white;
  transition: transform 0.2s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}
.cfg-toggle input:checked ~ .cfg-toggle-track .cfg-toggle-thumb {
  transform: translateX(14px);
}

/* Code */
.cfg-code-hint {
  font-size: 11px;
  color: var(--vp-c-text-3);
  margin: 0;
}
.cfg-code-hint code {
  font-size: 10px;
  background: var(--vp-c-bg-soft);
  padding: 1px 4px;
  border-radius: 4px;
}
.cfg-code-wrap {
  position: relative;
}
.cfg-code {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 11px;
  font-family: var(--vp-font-family-mono);
  line-height: 1.6;
  white-space: pre;
  overflow-x: auto;
  margin: 0;
  color: var(--vp-c-text-1);
}
.cfg-copy {
  position: absolute;
  top: 6px;
  right: 6px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-elv);
  color: var(--vp-c-text-2);
  font-size: 11px;
  cursor: pointer;
  transition: all 0.15s;
}
.cfg-copy:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}
.cfg-code-default {
  font-size: 11px;
  color: var(--vp-c-text-3);
  margin: 0;
  font-style: italic;
}
</style>
