import { AppLayout } from '@/layouts/app-layout'
import { AppRoutes } from '@/routes'

/**
 * App — ponto de entrada da aplicação.
 *
 * Envolve as rotas no layout shell (Header, Sidebar, Footer).
 */
function App(): React.ReactElement {
  return (
    <AppLayout>
      <AppRoutes />
    </AppLayout>
  )
}

export default App
