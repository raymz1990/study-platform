import type { ReactNode } from 'react'

/** Item de navegação da sidebar. */
export interface NavItem {
  id: string
  label: string
  href: string
  icon: string
}

/** Props compartilhadas pelos componentes de layout. */
export interface LayoutProps {
  children: ReactNode
}

/** Estado da sidebar. */
export interface SidebarState {
  isOpen: boolean
  isMobileOpen: boolean
}
