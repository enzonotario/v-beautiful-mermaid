<script setup lang="ts">
import { THEMES } from 'beautiful-mermaid'
import { VBeautifulMermaid, mermaidStore, resolvedTheme } from 'v-beautiful-mermaid'
import { computed, ref } from 'vue'

const code = ref(`graph TD
    A[Start] --> B{Is it working?}
    B -- Yes --> C[Enjoy!]
    B -- No --> D[Debug]
    D --> B`)

const themeNames = Object.keys(THEMES)
const formatName = (name: string) =>
  name
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ')

const encodedCode = computed(() => {
  try {
    return btoa(unescape(encodeURIComponent(code.value)))
  } catch (_e) {
    return code.value
  }
})
</script>

<template>
  <div class="mermaid-configurator">
    <div class="config-controls">
      <div class="config-field">
        <label>Output Format</label>
        <div class="config-radio-group">
          <label><input type="radio" v-model="mermaidStore.mode" value="svg"> SVG</label>
          <label><input type="radio" v-model="mermaidStore.mode" value="ascii"> ASCII</label>
        </div>
      </div>

      <div v-if="mermaidStore.mode === 'svg'" class="config-field">
        <label>Theme</label>
        <select :value="resolvedTheme" @change="mermaidStore.lightTheme = mermaidStore.darkTheme = ($event.target as HTMLSelectElement).value" class="config-select">
          <option v-for="name in themeNames" :key="name" :value="name">{{ formatName(name) }}</option>
        </select>
      </div>

      <div class="config-field">
        <label>Mermaid Code</label>
        <textarea v-model="code" rows="8" class="config-textarea"></textarea>
      </div>
    </div>

    <div class="config-preview">
      <div class="preview-label">Live Preview</div>
      <div class="preview-box">
        <VBeautifulMermaid :code="encodedCode" :mode="mermaidStore.mode" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.mermaid-configurator {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin: 2rem 0;
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
}

@media (min-width: 960px) {
  .mermaid-configurator { grid-template-columns: 350px 1fr; }
}

.config-controls { display: flex; flex-direction: column; gap: 1.5rem; }
.config-field label { display: block; font-weight: 600; margin-bottom: 0.5rem; font-size: 0.9rem; }
.config-radio-group { display: flex; gap: 1rem; }
.config-select, .config-textarea {
  width: 100%;
  padding: 0.6rem;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}
.config-textarea { font-family: var(--vp-font-family-mono); font-size: 0.85rem; }
.preview-label { font-weight: 600; margin-bottom: 1rem; color: var(--vp-c-brand-1); }
</style>
