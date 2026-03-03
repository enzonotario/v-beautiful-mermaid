import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import 'virtual:uno.css'
import { installMermaid } from 'v-beautiful-mermaid/client'
import 'v-beautiful-mermaid/style.css'
import DiagramConfigurator from './components/DiagramConfigurator.vue'
import ThemeSelector from './components/ThemeSelector.vue'
import VitePressLogo from './components/VitePressLogo.vue'
import VueLogo from './components/VueLogo.vue'
import './style.css'

const theme: Theme = {
  ...DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'nav-bar-content-after': () => h(ThemeSelector),
      'layout-bottom': () => h(DiagramConfigurator),
    })
  },
  enhanceApp({ app }) {
    installMermaid(app)
    app.component('VueLogo', VueLogo)
    app.component('VitePressLogo', VitePressLogo)
  },
}

export default theme
