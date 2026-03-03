import { installMermaid } from 'v-beautiful-mermaid/client'
import { createApp } from 'vue'
import 'v-beautiful-mermaid/style.css'
import 'virtual:uno.css'
import App from './App.vue'
import './style.css'

const app = createApp(App)
installMermaid(app, { colorMode: 'auto' })
app.mount('#app')
