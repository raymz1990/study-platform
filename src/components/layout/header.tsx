import { Button } from '@/components/foundation/button'
import { useTheme } from '@/hooks/use-theme'
import { useSidebar } from '@/hooks/use-sidebar'
import { GraduationCap, Menu, Moon, Sun } from 'lucide-react'

/**
 * Header — barra superior da aplicação.
 *
 * Contém: logo, título, botão de tema, botão de menu mobile.
 * Fixo no topo, z-index alto.
 */
export function Header(): React.ReactElement {
  const { resolvedTheme, toggleTheme } = useTheme()
  const { toggleMobile } = useSidebar()

  return (
    <header className="bg-background sticky top-0 z-30 flex h-14 items-center gap-4 border-b px-4 shadow-sm">
      {/* Menu mobile */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={toggleMobile}
        aria-label="Abrir menu de navegação"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </Button>

      {/* Logo */}
      <div className="flex items-center gap-2">
        <GraduationCap className="text-primary h-6 w-6" aria-hidden="true" />
        <span className="text-base font-semibold tracking-tight">Concurso AI</span>
      </div>

      {/* Espaçador */}
      <div className="flex-1" />

      {/* Theme toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        aria-label={resolvedTheme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
      >
        {resolvedTheme === 'dark' ? (
          <Sun className="h-5 w-5" aria-hidden="true" />
        ) : (
          <Moon className="h-5 w-5" aria-hidden="true" />
        )}
      </Button>
    </header>
  )
}
