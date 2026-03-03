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

  it('should use custom languages when specified', () => {
    const md = new MarkdownIt()
    md.use(vitepressBeautifulMermaid, {
      languages: {
        'beautiful-mermaid': 'default',
        'beautiful-mermaid-svg': 'svg',
        'bm-ascii': 'ascii',
      },
    })

    const svgResult = md.render('```beautiful-mermaid\ngraph TD\nA --> B\n```')
    expect(svgResult).toContain('mode="svg"')
    expect(svgResult).toContain('<VBeautifulMermaid')

    const explicitSvgResult = md.render('```beautiful-mermaid-svg\ngraph TD\nA --> B\n```')
    expect(explicitSvgResult).toContain('mode="svg"')

    const asciiResult = md.render('```bm-ascii\ngraph TD\nA --> B\n```')
    expect(asciiResult).toContain('mode="ascii"')
  })

  it('should not handle mermaid when custom languages override defaults', () => {
    const md = new MarkdownIt()
    md.use(vitepressBeautifulMermaid, {
      languages: { 'beautiful-mermaid': 'svg' },
    })

    const result = md.render('```mermaid\ngraph TD\nA --> B\n```')
    expect(result).not.toContain('VBeautifulMermaid')

    const customResult = md.render('```beautiful-mermaid\ngraph TD\nA --> B\n```')
    expect(customResult).toContain('VBeautifulMermaid')
  })

  it('custom language with defaultMode ascii should use ascii', () => {
    const md = new MarkdownIt()
    md.use(vitepressBeautifulMermaid, {
      defaultMode: 'ascii',
      languages: { bm: 'default' },
    })

    const result = md.render('```bm\ngraph TD\nA --> B\n```')
    expect(result).toContain('mode="ascii"')
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
