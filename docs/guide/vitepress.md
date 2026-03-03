# VitePress Plugin

VitePress plugin for seamless Mermaid integration with build-time pre-rendering for both SVG and ASCII.

## Installation

```bash
pnpm add v-beautiful-mermaid
```

## Setup

### Plugin (`config.ts`)

Register the markdown plugin in `.vitepress/config.ts`:

```ts
import { defineConfig } from 'vitepress'
import { vitepressBeautifulMermaid } from 'v-beautiful-mermaid'

export default defineConfig({
  markdown: {
    config: (md) => {
      md.use(vitepressBeautifulMermaid)
    }
  }
})
```

### Theme (`theme/index.ts`)

Import styles and register the component in `.vitepress/theme/index.ts`:

```ts
import DefaultTheme from 'vitepress/theme'
import { installMermaid } from 'v-beautiful-mermaid/client'
import 'v-beautiful-mermaid/style.css'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    installMermaid(app)
  }
}
```

## Plugin Options

Options passed to `vitepressBeautifulMermaid` control **build-time** pre-rendering.

### Theme

```ts
md.use(vitepressBeautifulMermaid, {
  lightTheme: 'zinc-light', // theme pre-rendered for light mode (default: 'zinc-light')
  darkTheme: 'zinc-dark',   // theme pre-rendered for dark mode (default: 'zinc-dark')
  colorMode: 'auto',        // 'auto' | 'light' | 'dark' — which theme to pre-render (default: 'auto')
})
```

### Render Options

Fine-tune layout, font, and rendering at build time. Passed directly to `renderMermaidSVG`.

```ts
md.use(vitepressBeautifulMermaid, {
  lightTheme: 'zinc-light',
  darkTheme: 'zinc-dark',
  defaultMode: 'svg',       // 'svg' | 'ascii' — default fence mode (default: 'svg')
  renderOptions: {
    font: 'Inter',          // font family for all text (default: 'Inter')
    padding: 48,            // canvas padding in px (default: 40)
    nodeSpacing: 32,        // horizontal spacing between nodes (default: 24)
    layerSpacing: 48,       // vertical spacing between layers (default: 40)
    componentSpacing: 32,   // spacing between disconnected components
    thoroughness: 5,        // crossing minimization 1–7, higher = better (default: 3)
    transparent: false,     // transparent SVG background
    interactive: false,     // hover tooltips on XY charts
  },
})
```

### ASCII Options

Fine-tune ASCII layout at build time. Passed directly to `renderMermaidASCII`.

```ts
md.use(vitepressBeautifulMermaid, {
  asciiOptions: {
    useAscii: false,        // true = ASCII chars (+,-,|), false = Unicode box-drawing (default: false)
    paddingX: 5,            // horizontal spacing between nodes (default: 5)
    paddingY: 5,            // vertical spacing between nodes (default: 5)
    boxBorderPadding: 1,    // interior padding inside node boxes (default: 1)
  },
})
```

## Client Options

`installMermaid` from `v-beautiful-mermaid/client` accepts the same options as the [Vue component](/guide/vue#options): `lightTheme`, `darkTheme`, `colorMode`, `renderOptions`, and `asciiOptions`.

```ts
installMermaid(app, {
  lightTheme: 'zinc-light',
  darkTheme: 'zinc-dark',
  colorMode: 'auto',
  renderOptions: {
    font: 'JetBrains Mono',
    thoroughness: 5,
  },
  asciiOptions: {
    useAscii: false,
    paddingX: 6,
    paddingY: 3,
    boxBorderPadding: 1,
  },
})
```

## Markdown Usage

### Default

~~~md
```mermaid
graph TD
    A --> B
```
~~~

### Explicit Mode

~~~md
```mermaid-svg
graph TD
    A --> B
```

```mermaid-ascii
graph TD
    A --> B
```
~~~
