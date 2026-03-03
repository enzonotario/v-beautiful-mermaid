<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { AsciiRenderOptions, RenderOptions } from 'beautiful-mermaid'
import { THEMES, renderMermaidASCII, renderMermaidSVG } from 'beautiful-mermaid'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { DEFAULT_LIGHT_THEME, type RenderMode, mermaidStore, resolvedTheme } from '../store'

const props = defineProps<{
  code: string
  mode?: RenderMode
  prerendered?: string
  renderOptions?: RenderOptions
  asciiOptions?: AsciiRenderOptions
}>()

const containerRef = ref<HTMLElement | null>(null)
const isFullscreen = ref(false)
const scale = ref(1)
const offset = reactive({ x: 0, y: 0 })
const isDragging = ref(false)
const dragStart = reactive({ x: 0, y: 0 })

const displayMode = computed(() => props.mode || mermaidStore.mode)

const decodedCode = computed(() => {
  try {
    return decodeURIComponent(escape(atob(props.code)))
  } catch (_e) {
    return props.code
  }
})

const currentTheme = computed(() => THEMES[resolvedTheme.value] || THEMES[DEFAULT_LIGHT_THEME])

const svgContent = ref(props.mode === 'ascii' ? '' : props.prerendered || '')

const updateSvg = () => {
  try {
    svgContent.value = renderMermaidSVG(decodedCode.value, {
      ...currentTheme.value,
      ...mermaidStore.renderOptions,
      ...props.renderOptions,
    })
  } catch (e: any) {
    svgContent.value = `<div class="mermaid-error">${e.message}</div>`
  }
}

const asciiContent = ref(props.mode === 'ascii' ? props.prerendered || '' : '')

const updateAscii = () => {
  try {
    asciiContent.value = renderMermaidASCII(decodedCode.value, {
      useAscii: false,
      ...mermaidStore.asciiOptions,
      ...props.asciiOptions,
      colorMode: 'html',
      theme: {
        ...currentTheme.value,
        ...mermaidStore.asciiOptions?.theme,
        ...props.asciiOptions?.theme,
      },
    })
  } catch (e: any) {
    asciiContent.value = `<div class="mermaid-error">${e.message}</div>`
  }
}

onMounted(() => {
  if (mermaidStore.themeNames.length === 0) {
    mermaidStore.themeNames = Object.keys(THEMES)
  }
  if (!props.prerendered || resolvedTheme.value !== DEFAULT_LIGHT_THEME) {
    updateSvg()
  }
  if (
    props.mode === 'ascii' &&
    (!props.prerendered || resolvedTheme.value !== DEFAULT_LIGHT_THEME)
  ) {
    updateAscii()
  }

  document.addEventListener('fullscreenchange', () => {
    isFullscreen.value = !!document.fullscreenElement
    if (!isFullscreen.value) resetTransform()
  })
})

watch([resolvedTheme, decodedCode], updateSvg)
watch([resolvedTheme, decodedCode], updateAscii)
watch(() => mermaidStore.asciiOptions, updateAscii, { deep: true })

const zoomIn = () => {
  scale.value *= 1.2
}
const zoomOut = () => {
  scale.value /= 1.2
}
const resetTransform = () => {
  scale.value = 1
  offset.x = 0
  offset.y = 0
}

const onWheel = (e: WheelEvent) => {
  const delta = e.deltaY > 0 ? 0.9 : 1.1
  scale.value = Math.max(0.1, Math.min(10, scale.value * delta))
}

const startDrag = (e: MouseEvent) => {
  isDragging.value = true
  dragStart.x = e.clientX - offset.x
  dragStart.y = e.clientY - offset.y
}

const onDrag = (e: MouseEvent) => {
  if (!isDragging.value) return
  offset.x = e.clientX - dragStart.x
  offset.y = e.clientY - dragStart.y
}

const stopDrag = () => {
  isDragging.value = false
}

const copied = ref(false)
let copyTimeout: ReturnType<typeof setTimeout> | null = null

const triggerCopied = () => {
  copied.value = true
  if (copyTimeout) clearTimeout(copyTimeout)
  copyTimeout = setTimeout(() => {
    copied.value = false
  }, 1500)
}

const copyCode = async () => {
  await navigator.clipboard.writeText(decodedCode.value)
  triggerCopied()
}
const copyAscii = async () => {
  const raw = renderMermaidASCII(decodedCode.value, { colorMode: 'none', useAscii: false })
  await navigator.clipboard.writeText(raw)
  triggerCopied()
}

const downloadSvg = () => {
  const blob = new Blob([svgContent.value], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `mermaid-${Date.now()}.svg`
  a.click()
  URL.revokeObjectURL(url)
}

const toggleFullscreen = () => {
  if (!containerRef.value) return
  if (!document.fullscreenElement) {
    containerRef.value.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}
</script>

<template>
  <div class="mermaid-diagram" :class="[displayMode, { 'is-fullscreen': isFullscreen }]" ref="containerRef">
    <!-- SVG Pane -->
    <div v-if="displayMode === 'svg'" class="mermaid-pane">
      <div
        class="mermaid-viewport"
        @mousedown="startDrag"
        @mousemove="onDrag"
        @mouseup="stopDrag"
        @mouseleave="stopDrag"
        @wheel.prevent="onWheel"
        :class="{ 'is-dragging': isDragging }"
        :style="{ background: currentTheme.bg }"
      >
        <div
          class="mermaid-canvas"
          :style="{
            transform: `scale(${scale}) translate(${offset.x / scale}px, ${offset.y / scale}px)`,
            cursor: isDragging ? 'grabbing' : 'grab'
          }"
          v-html="svgContent"
        ></div>

        <div class="mermaid-toolbar">
          <div class="mermaid-tool-group">
            <button @click="zoomIn" title="Zoom In" class="mermaid-tool-btn">
              <Icon icon="lucide:zoom-in" width="16" height="16" />
            </button>
            <button @click="zoomOut" title="Zoom Out" class="mermaid-tool-btn">
              <Icon icon="lucide:zoom-out" width="16" height="16" />
            </button>
            <button @click="resetTransform" title="Reset View" class="mermaid-tool-btn">
              <Icon icon="lucide:rotate-ccw" width="16" height="16" />
            </button>
          </div>
          <div class="mermaid-divider-v"></div>
          <div class="mermaid-tool-group">
            <div class="mermaid-tooltip-wrap">
              <button @click="copyCode" title="Copy Code" class="mermaid-tool-btn">
                <Icon :icon="copied ? 'lucide:check' : 'lucide:copy'" width="16" height="16" />
              </button>
              <span v-if="copied" class="mermaid-tooltip">Copied!</span>
            </div>
            <button @click="downloadSvg" title="Download SVG" class="mermaid-tool-btn">
              <Icon icon="lucide:download" width="16" height="16" />
            </button>
            <button @click="toggleFullscreen" title="Toggle Fullscreen" class="mermaid-tool-btn">
              <Icon :icon="isFullscreen ? 'lucide:minimize' : 'lucide:maximize'" width="16" height="16" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ASCII Pane -->
    <div v-if="displayMode === 'ascii'" class="mermaid-pane">
      <div class="mermaid-ascii-container" :style="{ background: currentTheme.bg }">
        <pre class="mermaid-ascii-content" :style="{ color: currentTheme.fg }" v-html="asciiContent"></pre>
        <div class="mermaid-copy-overlay">
          <div class="mermaid-tooltip-wrap">
            <button @click="copyAscii" title="Copy ASCII" class="mermaid-tool-btn" style="background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider);">
              <Icon :icon="copied ? 'lucide:check' : 'lucide:copy'" width="14" height="14" />
            </button>
            <span v-if="copied" class="mermaid-tooltip mermaid-tooltip--below">Copied!</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mermaid-diagram {
  margin: 1.5rem 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  overflow: hidden;
  transition: all 0.3s ease;
}

.mermaid-diagram:hover {
  border-color: var(--vp-c-brand-1);
}

.mermaid-diagram.is-fullscreen {
  position: fixed;
  inset: 0;
  width: 100vw !important;
  height: 100vh !important;
  margin: 0 !important;
  z-index: 9999;
  background: var(--vp-c-bg);
  border: none;
  border-radius: 0;
}

.mermaid-pane {
  flex: 1;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.mermaid-viewport {
  width: 100%;
  height: 100%;
  min-height: 400px;
  flex: 1;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  user-select: none;
}

.mermaid-viewport.is-dragging {
  cursor: grabbing;
}

.mermaid-canvas {
  width: 100%;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.1s ease-out;
}

.mermaid-canvas :deep(svg) {
  max-width: 100% !important;
  height: auto !important;
}

.mermaid-toolbar {
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: rgba(var(--vp-c-bg-rgb, 255, 255, 255), 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  display: flex;
  padding: 4px;
  gap: 2px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  opacity: 0.4;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 20;
}

.mermaid-viewport:hover .mermaid-toolbar {
  opacity: 1;
  transform: translateY(0);
}

.mermaid-tool-group {
  display: flex;
  gap: 2px;
}

.mermaid-tool-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.2s;
}

.mermaid-tool-btn:hover {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.mermaid-divider-v {
  width: 1px;
  height: 20px;
  background: var(--vp-c-divider);
  align-self: center;
  margin: 0 4px;
}

.mermaid-ascii-container {
  padding: 1.5rem;
  margin: 0;
  flex: 1;
  overflow-x: auto;
  position: relative;
}

.mermaid-ascii-content {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace !important;
  font-size: 0.85rem !important;
  line-height: 1.1 !important;
  letter-spacing: 0 !important;
  white-space: pre !important;
  display: block;
}

.mermaid-copy-overlay {
  position: absolute;
  top: 12px;
  right: 12px;
  opacity: 0;
  transition: opacity 0.2s;
}

.mermaid-ascii-container:hover .mermaid-copy-overlay {
  opacity: 1;
}

.mermaid-error {
  padding: 1.5rem;
  color: var(--vp-c-danger-1);
  font-family: var(--vp-font-family-mono);
  font-size: 0.85rem;
  background: var(--vp-c-danger-soft);
  border-radius: 6px;
  margin: 1rem;
}

.mermaid-tooltip-wrap {
  position: relative;
  display: flex;
}

.mermaid-tooltip {
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  background: var(--vp-c-bg-elv);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  padding: 3px 8px;
  font-size: 11px;
  white-space: nowrap;
  pointer-events: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  animation: mermaid-tooltip-in 0.12s ease;
}

.mermaid-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 4px solid transparent;
  border-top-color: var(--vp-c-divider);
}

.mermaid-tooltip--below {
  bottom: auto;
  top: calc(100% + 6px);
  animation-name: mermaid-tooltip-in-below;
}

.mermaid-tooltip--below::after {
  top: auto;
  bottom: 100%;
  border-top-color: transparent;
  border-bottom-color: var(--vp-c-divider);
}

@keyframes mermaid-tooltip-in {
  from { opacity: 0; transform: translateX(-50%) translateY(4px); }
  to   { opacity: 1; transform: translateX(-50%) translateY(0); }
}

@keyframes mermaid-tooltip-in-below {
  from { opacity: 0; transform: translateX(-50%) translateY(-4px); }
  to   { opacity: 1; transform: translateX(-50%) translateY(0); }
}
</style>
