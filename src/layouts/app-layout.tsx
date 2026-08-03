import { Header } from '@/components/layout/header'
import { Sidebar } from '@/components/layout/sidebar'
import { Footer } from '@/components/layout/footer'
import { MainContent } from '@/components/layout/main-content'
import { Breadcrumb } from '@/components/navigation/breadcrumb'
import { SearchModal } from '@/components/search/search-modal'
import { OfflineIndicator } from '@/components/pwa/offline-indicator'
import { UpdatePrompt } from '@/components/pwa/update-prompt'
import { useSidebar } from '@/contexts/sidebar-context'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'
import { cn } from '@/lib/utils'
import { type ReactNode } from 'react'

interface AppLayoutProps {
  children: ReactNode
}

/**
 * AppLayout — casca estrutural da aplicação.
 *
 * Composição: Header (fixo) + Sidebar (recolhível) + Breadcrumb + MainContent + Footer.
 * Responsivo: sidebar fixa em desktop, drawer em mobile.
 * Acessibilidade: skip link para conteúdo principal, landmarks semânticos.
 */
export function AppLayout({ children }: AppLayoutProps): React.ReactElement {
  const { isOpen } = useSidebar()

  /* Atalhos de teclado globais — UI_UX_GUIDELINES.md §Atalhos */
  useKeyboardShortcuts()

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      {/* Skip link — acessibilidade */}
      <a
        href="#main-content"
        className="focus:bg-primary focus:text-primary-foreground sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:rounded-md focus:px-4 focus:py-2"
      >
        Pular para o conteúdo principal
      </a>

      <Header />
      <SearchModal />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <div
          className={cn(
            'flex flex-1 flex-col transition-all duration-200',
            /* Desktop: respeita largura da sidebar */
            isOpen ? 'lg:ml-64' : 'lg:ml-16'
          )}
        >
          <MainContent>
            <Breadcrumb />
            {children}
          </MainContent>
          <Footer />
        </div>
      </div>

      <OfflineIndicator />
      <UpdatePrompt />
    </div>
  )
}
