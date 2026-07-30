import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { useBreadcrumbs } from '@/hooks/use-breadcrumbs'

/**
 * Breadcrumb — trilha de navegação hierárquica.
 *
 * Reflete a rota atual com links navegáveis para níveis superiores.
 */
export function Breadcrumb(): React.ReactElement | null {
  const crumbs = useBreadcrumbs()

  if (crumbs.length <= 1) return null

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="text-muted-foreground flex flex-wrap items-center gap-1 text-sm">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1

          return (
            <li key={`${crumb.label}-${index}`} className="flex items-center gap-1">
              {index > 0 && <ChevronRight className="h-4 w-4" aria-hidden="true" />}

              {isLast || crumb.path === undefined ? (
                <span className="text-foreground font-medium" aria-current="page">
                  {index === 0 ? (
                    <span className="flex items-center gap-1">
                      <Home className="h-4 w-4" />
                      {crumb.label}
                    </span>
                  ) : (
                    crumb.label
                  )}
                </span>
              ) : (
                <Link
                  to={crumb.path}
                  className="hover:text-foreground flex items-center gap-1 transition-colors"
                >
                  {index === 0 ? (
                    <>
                      <Home className="h-4 w-4" />
                      {crumb.label}
                    </>
                  ) : (
                    crumb.label
                  )}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
