/** Tipo de item de navegação da sidebar. */
export interface NavItem {
  id: string
  label: string
  path: string
  icon: string
}

/** Tipo de breadcrumb. */
export interface BreadcrumbItem {
  label: string
  path?: string | undefined
}

/** Definição de rota interna. */
export interface AppRoute {
  path: string
  label: string
  parent?: string
}
