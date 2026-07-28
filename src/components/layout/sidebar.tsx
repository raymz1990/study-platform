import { cn } from '@/lib/utils'
import { useSidebar } from '@/hooks/use-sidebar'
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  HelpCircle,
  Layers,
  RotateCcw,
  ClipboardList,
  Headphones,
  BarChart3,
  Settings,
} from 'lucide-react'

/**
 * Sidebar — navegação lateral da aplicação.
 *
 * Desktop: sidebar fixa, recolhível.
 * Mobile: drawer overlay que cobre a tela.
 *
 * Itens: Dashboard, Cronograma, Disciplinas, Questões, Flashcards,
 * Revisões, Simulados, Podcasts, Progresso, Configurações.
 */

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '#dashboard' },
  { id: 'cronograma', label: 'Cronograma', icon: Calendar, href: '#cronograma' },
  { id: 'disciplinas', label: 'Disciplinas', icon: BookOpen, href: '#disciplinas' },
  { id: 'questoes', label: 'Questões', icon: HelpCircle, href: '#questoes' },
  { id: 'flashcards', label: 'Flashcards', icon: Layers, href: '#flashcards' },
  { id: 'revisoes', label: 'Revisões', icon: RotateCcw, href: '#revisoes' },
  { id: 'simulados', label: 'Simulados', icon: ClipboardList, href: '#simulados' },
  { id: 'podcasts', label: 'Podcasts', icon: Headphones, href: '#podcasts' },
  { id: 'progresso', label: 'Progresso', icon: BarChart3, href: '#progresso' },
  { id: 'configuracoes', label: 'Configurações', icon: Settings, href: '#configuracoes' },
] as const

export function Sidebar(): React.ReactElement {
  const { isOpen, isMobileOpen, toggle, closeMobile } = useSidebar()

  return (
    <>
      {/* Overlay mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-14 z-50 flex h-[calc(100vh-3.5rem)] flex-col border-r bg-background transition-all duration-200',
          /* Mobile: drawer */
          isMobileOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0 lg:static lg:h-[calc(100vh-3.5rem)]',
          /* Desktop: largura variável */
          isOpen ? 'w-64' : 'w-16'
        )}
        aria-label="Navegação principal"
      >
        {/* Botão recolher (desktop only) */}
        <button
          type="button"
          onClick={toggle}
          className="hidden lg:flex lg:items-center lg:justify-end lg:px-3 lg:py-2"
          aria-label={isOpen ? 'Recolher menu' : 'Expandir menu'}
        >
          <div className="h-1 w-8 rounded-full bg-muted-foreground/30" />
        </button>

        {/* Navegação */}
        <nav className="flex-1 overflow-y-auto px-2 py-2">
          <ul className="space-y-1" role="menubar">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.id} role="none">
                  <a
                    href={item.href}
                    role="menuitem"
                    className={cn(
                      'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      !isOpen && 'lg:justify-center lg:px-2'
                    )}
                    onClick={closeMobile}
                  >
                    <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                    <span
                      className={cn(
                        'transition-opacity duration-200',
                        isOpen ? 'opacity-100' : 'lg:sr-only lg:w-0 lg:opacity-0'
                      )}
                    >
                      {item.label}
                    </span>
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>
    </>
  )
}
