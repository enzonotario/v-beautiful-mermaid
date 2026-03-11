import { defineNuxtModule, addComponent, createResolver } from '@nuxt/kit'

// biome-ignore lint/suspicious/noEmptyInterface: <explanation>
export interface ModuleOptions {
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'v-beautiful-mermaid',
    configKey: 'beautifulMermaid',
    compatibility: {
      nuxt: '^3.0.0 || ^4.0.0'
    }
  },
  defaults: {
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    nuxt.options.alias['elkjs'] = 'elkjs/lib/elk.bundled.js'

    nuxt.options.build.transpile.push('v-beautiful-mermaid', 'beautiful-mermaid', 'elkjs')

    addComponent({
      name: 'VBeautifulMermaid',
      export: 'VBeautifulMermaid',
      filePath: resolve('./client')
    })
  }
})
