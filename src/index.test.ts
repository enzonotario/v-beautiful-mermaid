import { mount } from '@vue/test-utils'
import MarkdownIt from 'markdown-it'
import { describe, expect, it } from 'vitest'
import { VBeautifulMermaid, mermaidStore } from './client'
import { vitepressBeautifulMermaid } from './index'

describe('vitepressBeautifulMermaid', () => {
  it('should render mermaid blocks with prerendered SVG', () => {
    const md = new MarkdownIt()
    md.use(vitepressBeautifulMermaid)

    const content = '```mermaid\ngraph TD\nA --> B\n```'
    const result = md.render(content)

    expect(result).toContain('<VBeautifulMermaid code="')
    expect(result).toContain('mode="svg"')
    expect(result).toContain('prerendered="&lt;svg')
  })

  it('should respect custom theme in SSR', () => {
    const md = new MarkdownIt()
    md.use(vitepressBeautifulMermaid, { theme: 'dracula' })

    const content = '```mermaid\ngraph TD\nA --> B\n```'
    const result = md.render(content)

    expect(result).toContain('--bg:#282a36')
  })

  it('should not affect other code blocks', () => {
    const md = new MarkdownIt()
    md.use(vitepressBeautifulMermaid)

    const content = '```js\nconst x = 1\n```'
    const result = md.render(content)

    expect(result).toContain('<pre><code class="language-js">')
    expect(result).not.toContain('VBeautifulMermaid')
  })
})

describe('VBeautifulMermaid', () => {
  it('renders correctly with code prop', () => {
    const code = btoa('graph TD\nA --> B')
    const wrapper = mount(VBeautifulMermaid, {
      props: { code, mode: 'svg' },
    })

    expect(wrapper.classes()).toContain('svg')
    expect(wrapper.find('.mermaid-canvas').exists()).toBe(true)
  })

  it('responds to store mode changes', async () => {
    const code = btoa('graph TD\nA --> B')
    const wrapper = mount(VBeautifulMermaid, {
      props: { code },
    })

    expect(wrapper.classes()).toContain('svg')

    mermaidStore.mode = 'ascii'
    await wrapper.vm.$nextTick()

    expect(wrapper.classes()).toContain('ascii')
  })
})
