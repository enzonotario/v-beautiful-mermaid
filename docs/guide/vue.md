# Vue Component

Standalone Vue 3 component for rendering Mermaid diagrams with full SSR support and global theming.

## Installation

```bash
pnpm add v-beautiful-mermaid
```

## Setup

### Global Registration

Register once in your `main.ts` and use `<VBeautifulMermaid>` anywhere:

```ts
import { createApp } from 'vue'
import { installMermaid } from 'v-beautiful-mermaid/client'
import 'v-beautiful-mermaid/style.css'

const app = createApp(App)
installMermaid(app)
app.mount('#app')
```

### Local Component

Import directly in a single component:

```vue
<script setup>
import { VBeautifulMermaid } from 'v-beautiful-mermaid/client'
import 'v-beautiful-mermaid/style.css'

const code = btoa(`graph TD
    A --> B`)
</script>

<template>
  <VBeautifulMermaid :code="code" />
</template>
```

## Component Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `code` | `string` | — | Mermaid source encoded as Base64. Optional if using the default slot. |
| `mode` | `'svg' \| 'ascii'` | store value (`'svg'`) | Output format. `svg` renders a vector diagram; `ascii` renders Unicode box-drawing art. |
| `prerendered` | `string` | — | Pre-rendered output string injected on first paint (used by the VitePress plugin to avoid flash). |
| `renderOptions` | `RenderOptions` | — | SVG layout/color overrides for this instance. Merged over global store options. |
| `asciiOptions` | `AsciiRenderOptions` | — | ASCII rendering overrides for this instance. Merged over global store options. |

### Slot usage

Pass Mermaid source directly as slot content — no Base64 encoding needed:

```vue
<VBeautifulMermaid mode="svg">
graph TD
  A[Start] --> B[Process] --> C[End]
</VBeautifulMermaid>
```

### `code` prop

For dynamic diagrams, use the `code` prop with Base64-encoded source:

```ts
const code = btoa(unescape(encodeURIComponent(`
  graph TD
    A --> B
`)))
```

```vue
<VBeautifulMermaid :code="code" />
```

### `mode` per component

Override the global render mode for a specific diagram:

```vue
<VBeautifulMermaid :code="code" mode="ascii" />
<VBeautifulMermaid :code="code" mode="svg" />
```

The default mode can be set globally:

```ts
installMermaid(app, { /* colorMode, themes… */ })
// or at runtime:
mermaidStore.mode = 'ascii'
```

## Options

### Theme

```ts
installMermaid(app, {
  lightTheme: 'zinc-light', // theme used in light mode (default: 'zinc-light')
  darkTheme: 'zinc-dark',   // theme used in dark mode (default: 'zinc-dark')
  colorMode: 'auto',        // 'auto' | 'light' | 'dark' (default: 'auto')
})
```

### Render Options

Fine-tune layout, font, and rendering behavior globally or per component.

**Global defaults** via `installMermaid`:

```ts
installMermaid(app, {
  renderOptions: {
    font: 'JetBrains Mono', // font family for all text (default: 'Inter')
    padding: 48,            // canvas padding in px (default: 40)
    nodeSpacing: 32,        // horizontal spacing between nodes (default: 24)
    layerSpacing: 48,       // vertical spacing between layers (default: 40)
    componentSpacing: 32,   // spacing between disconnected components
    thoroughness: 5,        // crossing minimization 1–7, higher = better (default: 3)
    transparent: false,     // transparent SVG background
    interactive: false,     // hover tooltips on XY charts
  },
  asciiOptions: {
    useAscii: false,        // true = ASCII chars (+,-), false = Unicode box-drawing
    paddingX: 6,            // horizontal spacing between nodes (default: 5)
    paddingY: 3,            // vertical spacing between nodes (default: 5)
    boxBorderPadding: 1,    // interior padding inside node boxes
  },
})
```

**Per component** via props (overrides global defaults):

```vue
<VBeautifulMermaid
  :code="code"
  :render-options="{ transparent: true, thoroughness: 6, font: 'Fira Code' }"
  :ascii-options="{ useAscii: true, paddingX: 8 }"
/>
```

**Custom theme colors** on top of the active theme:

```vue
<VBeautifulMermaid
  :code="code"
  :render-options="{ accent: '#f97316', surface: '#fef3c7' }"
/>
```

### Available Themes

```ts
import { THEMES } from 'v-beautiful-mermaid/client'

// zinc-light · zinc-dark
// tokyo-night · tokyo-night-storm · tokyo-night-light
// catppuccin-mocha · catppuccin-latte
// nord · nord-light
// dracula · github-light · github-dark
// solarized-light · solarized-dark · one-dark
console.log(Object.keys(THEMES))
```

## Global Store

Read or override the current configuration at runtime:

```ts
import { mermaidStore } from 'v-beautiful-mermaid/client'

mermaidStore.lightTheme = 'dracula'
mermaidStore.mode = 'ascii'
```
