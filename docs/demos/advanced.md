---
layout: page
aside: false
sidebar: false
---

<script setup>
import { ref, onMounted } from 'vue'

const samples = ref([])
const loading = ref(true)
const error = ref(null)

const encode = (code) => {
  try {
    return btoa(unescape(encodeURIComponent(code)))
  } catch (e) {
    return btoa(code)
  }
}

onMounted(async () => {
  try {
    const response = await fetch('https://raw.githubusercontent.com/lukilabs/beautiful-mermaid/HEAD/samples-data.ts')
    const text = await response.text()
    
    const extractedSamples = []
    
    // Split by objects to avoid issues with large comments between them
    // Each sample starts with { and ends with }, usually followed by a comma
    const entries = text.split(/\{\s*\n\s*title:/g).slice(1)
    
    for (const entry of entries) {
      try {
        // The first part of the split removed 'title:', so the entry starts with the title value
        const titleMatch = entry.match(/^ '(.*?)'/)
        const sourceMatch = entry.match(/source:\s*`([\s\S]*?)`/)
        const categoryMatch = entry.match(/category:\s*'(.*?)'/)
        
        if (titleMatch && sourceMatch) {
          extractedSamples.push({
            title: titleMatch[1],
            source: sourceMatch[1].trim(),
            category: categoryMatch ? categoryMatch[1] : 'Unknown'
          })
        }
      } catch (e) {
        console.warn('Failed to parse a sample entry', e)
      }
    }
    
    samples.value = extractedSamples
    loading.value = false
  } catch (e) {
    console.error(e)
    error.value = 'Failed to load samples from GitHub'
    loading.value = false
  }
})
</script>

<div class="container mx-auto py-10 px-2">

<div class="vp-doc">

# Advanced Samples Demo

Esta página carga ejemplos complejos directamente desde el repositorio oficial de `beautiful-mermaid` para mostrar el potencial del renderizador.

</div>

<div v-if="loading" class="p-16 text-center italic text-text-2">
  Cargando ejemplos desde GitHub...
</div>

<div v-else-if="error" class="p-8 text-center text-red-500 font-medium">
  {{ error }}
</div>

<div v-else v-for="sample in samples" :key="sample.title" class="mt-20 pt-8 relative clear-both border-t border-divider">
  <div class="bg-brand-soft text-brand-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider absolute top-4 right-0">{{ sample.category }}</div>
  <h2 :id="sample.title.toLowerCase().replace(/\s+/g, '-')" class="mt-0 border-none text-2xl font-bold">{{ sample.title }}</h2>
  
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
    <div class="flex flex-col min-w-0">
      <div class="text-sm font-semibold text-text-2 mb-3 uppercase tracking-wider border-b border-divider pb-2">SVG Render</div>
      <div class="flex-1">
        <ClientOnly>
          <VBeautifulMermaid :code="encode(sample.source)" mode="svg" />
        </ClientOnly>
      </div>
    </div>
    <div class="flex flex-col min-w-0">
      <div class="text-sm font-semibold text-text-2 mb-3 uppercase tracking-wider border-b border-divider pb-2">ASCII / Unicode Render</div>
      <div class="flex-1">
        <ClientOnly>
          <VBeautifulMermaid :code="encode(sample.source)" mode="ascii" />
        </ClientOnly>
      </div>
    </div>
  </div>
</div>

</div>
