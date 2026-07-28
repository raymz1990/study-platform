import { Header } from '@/components/layout/header'
import { Sidebar } from '@/components/layout/sidebar'
import { Footer } from '@/components/layout/footer'
import { MainContent } from '@/components/layout/main-content'
import { useSidebar } from '@/contexts/sidebar-context'
import { cn } from '@/lib/utils'
import { type ReactNode } from 'react'

interface AppLayoutProps {
  children: ReactNode
}

/**
 * AppLayout — casca estrutural da aplicação.
 *
 * Composição: Header (fixo) + Sidebar (recolhível) + MainContent + Footer.
 * Responsivo: sidebar fixa em desktop, drawer em mobile.
 * Acessibilidade: skip link para conteúdo principal, landmarks semânticos.
 */
export function AppLayout({ children }: AppLayoutProps): React.ReactElement {
  const { isOpen } = useSidebar()

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Skip link — acessibilidade */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Pular para o conteúdo principal
      </a>

      <Header />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <div
          className={cn(
            'flex flex-1 flex-col transition-all duration-200',
            /* Desktop: respeita largura da sidebar */
            isOpen ? 'lg:ml-64' : 'lg:ml-16'
          )}
        >
          <MainContent>{children}</MainContent>
          <Footer />
        </div>
      </div>
    </div>
  )
}
