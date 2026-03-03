<script setup lang="ts">
import { THEMES } from 'beautiful-mermaid'
import { mermaidStore, resolvedTheme } from 'v-beautiful-mermaid/client'
import { onMounted } from 'vue'

const quickThemes = [
  { label: 'Default', value: 'zinc-light', color: '#ffffff' },
  { label: 'Dracula', value: 'dracula', color: '#282a36' },
  { label: 'Solarized', value: 'solarized-light', color: '#fdf6e3' },
]

const formatName = (name: string) => {
  return name
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ')
}

function setTheme(theme: string) {
  mermaidStore.lightTheme = theme
  mermaidStore.darkTheme = theme
}

const randomTheme = () => {
  const themes = mermaidStore.themeNames
  if (themes.length === 0) return
  let newTheme = themes[Math.floor(Math.random() * themes.length)]
  if (newTheme === resolvedTheme.value && themes.length > 1) {
    newTheme = themes[(themes.indexOf(newTheme) + 1) % themes.length]
  }
  setTheme(newTheme)
}

onMounted(() => {
  if (mermaidStore.themeNames.length === 0) {
    mermaidStore.themeNames = Object.keys(THEMES)
  }
})
</script>

<template>
  <div class="mermaid-controls">
    <div class="theme-pills">
      <button
        v-for="pill in quickThemes"
        :key="pill.value"
        class="theme-pill"
        :class="{ active: resolvedTheme === pill.value }"
        @click="setTheme(pill.value)"
      >
        <span class="theme-dot" :style="{ background: pill.color }"></span>
        {{ pill.label }}
      </button>

      <div class="more-themes" v-if="mermaidStore.themeNames.length > 0">
        <select :value="resolvedTheme" @change="setTheme(($event.target as HTMLSelectElement).value)" class="theme-select">
          <option value="" disabled>More Themes...</option>
          <option v-for="name in mermaidStore.themeNames" :key="name" :value="name">
            {{ formatName(name) }}
          </option>
        </select>
      </div>

      <button class="random-btn" title="Random Theme" @click="randomTheme">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 16V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z"/><path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/></svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.mermaid-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 12px;
}

.theme-pills {
  display: flex;
  align-items: center;
  gap: 8px;
}

.theme-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 99px;
  font-size: 12px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.theme-pill:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.theme-pill.active {
  background: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.theme-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.theme-select {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 99px;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  cursor: pointer;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
}

.theme-select:hover {
  border-color: var(--vp-c-brand-1);
}

.random-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.2s;
}

.random-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

@media (max-width: 960px) {
  .theme-pill:not(.active) {
    display: none;
  }
}

@media (max-width: 640px) {
  .mermaid-controls {
    display: none;
  }
}
</style>
