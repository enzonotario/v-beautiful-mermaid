<script setup lang="ts">
import { THEMES } from 'beautiful-mermaid'
import {
  type ColorMode,
  DEFAULT_DARK_THEME,
  DEFAULT_LIGHT_THEME,
  VBeautifulMermaid,
  mermaidStore,
  resolvedTheme,
} from 'v-beautiful-mermaid/client'
import { onMounted, ref } from 'vue'

const isDark = ref(false)

function toggleDark() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
}

function setTheme(theme: string) {
  mermaidStore.lightTheme = theme
  mermaidStore.darkTheme = theme
}

function formatName(name: string) {
  return name
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ')
}

function encode(code: string) {
  return btoa(unescape(encodeURIComponent(code)))
}

const colorModes: { label: string; value: ColorMode }[] = [
  { label: 'Auto', value: 'auto' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
]

function setColorMode(mode: ColorMode) {
  mermaidStore.colorMode = mode
  if (mode === 'auto') {
    mermaidStore.lightTheme = DEFAULT_LIGHT_THEME
    mermaidStore.darkTheme = DEFAULT_DARK_THEME
  }
}

const demos = [
  {
    title: 'Simple Flowchart',
    description: 'A basic top-down flowchart.',
    code: `graph TD
  A[Start] --> B[Process] --> C[End]`,
  },
  {
    title: 'XY Bar Chart',
    description: 'Modern bar chart.',
    code: `xychart-beta
    title "Product Sales"
    x-axis [Widgets, Gadgets, Gizmos, Doodads, Thingamajigs]
    bar [150, 230, 180, 95, 310]`,
  },
  {
    title: 'XY Line & Bar Chart',
    description: 'Combined line and bar chart.',
    code: `xychart-beta
    title "Monthly Revenue"
    x-axis "Month" [Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec]
    y-axis "Revenue (USD)" 0 --> 10000
    bar [4200, 5000, 5800, 6200, 5500, 7000, 7800, 7200, 8400, 8100, 9000, 9200]
    line [4200, 5000, 5800, 6200, 5500, 7000, 7800, 7200, 8400, 8100, 9000, 9200]`,
  },
  {
    title: 'Sequence Interaction',
    description: 'A sequence diagram with actor stick figures and aliases.',
    code: `sequenceDiagram
  actor U as User
  participant S as System
  participant DB as Database
  U->>S: Click button
  S->>DB: Query
  DB-->>S: Results
  S-->>U: Display`,
  },
  {
    title: 'Class Structure',
    description: 'A simple class definition with visibility markers.',
    code: `classDiagram
  class Animal {
    +String name
    +int age
    +eat() void
    +sleep() void
  }`,
  },
  {
    title: 'Entity Relationship',
    description: 'A basic relationship between two entities.',
    code: `erDiagram
  CUSTOMER ||--o{ ORDER : places`,
  },
  {
    title: 'System Architecture',
    description: 'A more complex architecture using subgraphs and different node shapes.',
    code: `graph LR
  subgraph clients [Client Layer]
    A([Web App]) --> B[API Gateway]
    C([Mobile App]) --> B
  end
  subgraph services [Service Layer]
    B --> D[Auth Service]
    B --> E[User Service]
    B --> F[Order Service]
  end
  subgraph data [Data Layer]
    D --> G[(Auth DB)]
    E --> H[(User DB)]
    F --> I[(Order DB)]
    F --> J([Message Queue])
  end`,
  },
]

onMounted(() => {
  isDark.value = document.documentElement.classList.contains('dark')
  if (mermaidStore.themeNames.length === 0) {
    mermaidStore.themeNames = Object.keys(THEMES)
  }
})
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <header class="sticky top-0 z-100 bg-[var(--bg)] border-b border-[var(--border)] backdrop-blur-md">
      <div class="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
        <span class="font-bold text-base text-[var(--brand)] whitespace-nowrap">
          v-beautiful-mermaid/client
        </span>
        <div class="flex items-center gap-2.5">
          <div class="flex bg-[var(--bg-soft)] border border-[var(--border)] rounded-lg p-1 gap-0.5">
            <button
              v-for="mode in colorModes"
              :key="mode.value"
              class="px-2.5 py-1 rounded border-0 bg-transparent text-xs font-medium cursor-pointer transition-all duration-150"
              :class="mermaidStore.colorMode === mode.value
                ? 'bg-[var(--bg)] text-[var(--brand)] shadow-sm'
                : 'text-[var(--fg-2)]'"
              @click="setColorMode(mode.value)"
            >
              {{ mode.label }}
            </button>
          </div>
          <button
            class="flex items-center justify-center w-8 h-8 rounded-lg border border-[var(--border)] bg-[var(--bg-soft)] text-[var(--fg-2)] cursor-pointer transition-all duration-150 shrink-0 hover:(border-[var(--brand)] text-[var(--brand)])"
            @click="toggleDark"
            :title="isDark ? 'Switch to light' : 'Switch to dark'"
          >
            <span v-if="isDark" class="i-lucide-sun text-lg" />
            <span v-else class="i-lucide-moon text-lg" />
          </button>
          <select
            :value="resolvedTheme"
            @change="setTheme(($event.target as HTMLSelectElement).value)"
            class="bg-[var(--bg-soft)] border border-[var(--border)] rounded-lg py-1 px-2.5 text-xs font-medium text-[var(--fg-2)] cursor-pointer outline-none shrink-0 hover:border-[var(--brand)]"
          >
            <option v-for="name in mermaidStore.themeNames" :key="name" :value="name">
              {{ formatName(name) }}
            </option>
          </select>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-6 pt-8 pb-16 w-full flex flex-col gap-10">
      <section v-for="demo in demos" :key="demo.title">
        <h2 class="text-lg font-semibold mb-1">{{ demo.title }}</h2>
        <p class="text-sm text-[var(--fg-2)] mb-3">{{ demo.description }}</p>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <span class="text-xs font-medium text-[var(--fg-2)] uppercase tracking-wider mb-1 block">SVG</span>
            <VBeautifulMermaid :code="encode(demo.code)" mode="svg" />
          </div>
          <div>
            <span class="text-xs font-medium text-[var(--fg-2)] uppercase tracking-wider mb-1 block">ASCII</span>
            <VBeautifulMermaid :code="encode(demo.code)" mode="ascii" />
          </div>
        </div>
      </section>
    </main>
  </div>
</template>
