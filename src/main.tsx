import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { ThemeProvider } from '@/contexts/theme-context'
import { SidebarProvider } from '@/contexts/sidebar-context'
import { initPWAService } from '@/services/pwa-service'
import './index.css'
import App from './App'

/* Inicializa listeners PWA (offline, atualizações) */
initPWAService()

const rootElement = document.getElementById('root')

if (rootElement === null) {
  throw new Error('Root element not found')
}

/* HashRouter para compatibilidade com GitHub Pages (SSG) */
createRoot(rootElement).render(
  <StrictMode>
    <HashRouter>
      <ThemeProvider>
        <SidebarProvider>
          <App />
        </SidebarProvider>
      </ThemeProvider>
    </HashRouter>
  </StrictMode>
)
