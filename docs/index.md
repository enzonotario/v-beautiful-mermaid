---
layout: page
sidebar: false
---

<script setup>
import { ref } from 'vue'
const tab = ref('svg')
</script>

<div class="grid grid-cols-1 gap-12 container mx-auto py-10 px-6 lg:(grid-cols-2 py-8 px-0)">
<div class="flex flex-col items-center text-center">
  <div class="mb-6"><VueLogo size="64px" /></div>
  <h1 class="gradient-name text-[2rem] font-bold leading-tight mb-4">Vue Component</h1>
  <p class="text-lg text-text-2 mb-8 max-w-[400px]">Standalone Vue 3 component to render diagrams in any application.</p>
  <span class="flex-1"></span>
  <a href="/guide/vue" class="btn-brand">Get Started</a>
</div>
<div class="flex flex-col items-center text-center">
  <div class="mb-6"><VitePressLogo size="64px" /></div>
  <h1 class="gradient-name text-[2rem] font-bold leading-tight mb-4">VitePress Plugin</h1>
  <p class="text-lg text-text-2 mb-8 max-w-[400px]">VitePress plugin with build-time SVG rendering and full Markdown integration.</p>
  <span class="flex-1"></span>
  <a href="/guide/vitepress" class="btn-brand">Get Started</a>
</div>
</div>

<div class="text-center text-sm text-text-2 mb-6">
  Powered by <a href="https://github.com/lukilabs/beautiful-mermaid" target="_blank" rel="noopener" class="text-brand-1 hover:underline">Beautiful Mermaid</a>
</div>

<div class="container mx-auto px-6">
<div class="flex justify-center mb-4">
<div class="flex gap-1 p-1 rounded-lg border border-divider bg-[var(--vp-c-bg-soft)]">
  <button class="px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer" :class="tab === 'svg' ? 'bg-brand-soft text-brand-1' : 'text-text-2 hover:text-text-1'" @click="tab = 'svg'">SVG</button>
  <button class="px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer" :class="tab === 'ascii' ? 'bg-brand-soft text-brand-1' : 'text-text-2 hover:text-text-1'" @click="tab = 'ascii'">ASCII</button>
</div>
</div>
<div v-show="tab === 'svg'">

```mermaid-svg
stateDiagram-v2
    direction LR
    [*] --> Input
    Input --> Parse: DSL
    Parse --> Layout: AST
    Layout --> SVG: Vector
    Layout --> ASCII: Text
    SVG --> Theme
    ASCII --> Theme
    Theme --> Output
    Output --> [*]
```

</div>
<div v-show="tab === 'ascii'">

```mermaid-ascii
stateDiagram-v2
    direction LR
    [*] --> Input
    Input --> Parse: DSL
    Parse --> Layout: AST
    Layout --> SVG: Vector
    Layout --> ASCII: Text
    SVG --> Theme
    ASCII --> Theme
    Theme --> Output
    Output --> [*]
```

</div>
</div>

<div class="vp-raw grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6 container mx-auto my-16 px-6">
  <div class="p-6 rounded-xl bg-[var(--vp-c-bg-soft)] border border-[var(--vp-c-divider)]">
    <div class="text-4xl mb-4">✨</div>
    <h3 class="m-0 mb-3 text-lg font-semibold">Beautiful by Default</h3>
    <p class="m-0 text-sm text-text-2 leading-relaxed">Uses beautiful-mermaid for a modern and clean look out of the box. No more clunky, outdated diagram styles.</p>
  </div>
  <div class="p-6 rounded-xl bg-[var(--vp-c-bg-soft)] border border-[var(--vp-c-divider)]">
    <div class="text-4xl mb-4">⚡</div>
    <h3 class="m-0 mb-3 text-lg font-semibold">Build-time Rendering</h3>
    <p class="m-0 text-sm text-text-2 leading-relaxed">Diagrams are pre-rendered during build. This means zero runtime overhead, faster page loads, and perfect SEO.</p>
  </div>
  <div class="p-6 rounded-xl bg-[var(--vp-c-bg-soft)] border border-[var(--vp-c-divider)]">
    <div class="text-4xl mb-4">🌐</div>
    <h3 class="m-0 mb-3 text-lg font-semibold">Full SSR Support</h3>
    <p class="m-0 text-sm text-text-2 leading-relaxed">Works perfectly in server-side rendering environments. No browser DOM required for the initial render.</p>
  </div>
</div>

<style>
.gradient-name {
  background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.btn-brand {
  display: inline-block;
  border: 1px solid var(--vp-button-brand-border);
  color: var(--vp-button-brand-hover-text);
  background-color: var(--vp-button-brand-bg);
  font-weight: 600;
  white-space: nowrap;
  transition: color 0.25s, border-color 0.25s, background-color 0.25s;
  padding: 0 24px;
  line-height: 42px;
  border-radius: 20px;
  font-size: 14px;
  text-decoration: none;
}

.btn-brand:hover {
  border-color: var(--vp-button-brand-hover-border);
  background-color: var(--vp-button-brand-hover-bg);
}
</style>
