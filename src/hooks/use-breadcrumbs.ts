import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import type { BreadcrumbItem } from '@/types/navigation'

const ROUTE_LABELS: Record<string, string> = {
  '': 'Dashboard',
  cronograma: 'Cronograma',
  disciplinas: 'Disciplinas',
  questoes: 'Questões',
  flashcards: 'Flashcards',
  revisoes: 'Revisões',
  simulados: 'Simulados',
  podcasts: 'Podcasts',
  progresso: 'Progresso',
  configuracoes: 'Configurações',
}

/**
 * Hook para gerar breadcrumbs dinâmicos baseados na rota atual.
 *
 * Exemplo: /disciplinas/123 → [Dashboard, Disciplinas, Detalhe]
 */
export function useBreadcrumbs(): BreadcrumbItem[] {
  const location = useLocation()

  return useMemo(() => {
    const segments = location.pathname.split('/').filter(Boolean)
    const crumbs: BreadcrumbItem[] = [{ label: 'Dashboard', path: '/' }]

    let currentPath = ''
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const isLast = index === segments.length - 1
      const label = ROUTE_LABELS[segment] ?? segment

      crumbs.push({
        label,
        path: isLast ? undefined : currentPath,
      })
    })

    return crumbs
  }, [location.pathname])
}
