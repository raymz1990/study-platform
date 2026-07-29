import { Card, CardContent, CardHeader, CardTitle } from '@/components/foundation/card'
import { Button } from '@/components/foundation/button'
import { LayoutDashboard } from 'lucide-react'

/** Skeleton de loading para Suspense de rotas. */
export function RouteSkeleton(): React.ReactElement {
  return (
    <div className="space-y-4">
      <div className="h-8 w-1/3 animate-pulse rounded-md bg-muted" />
      <div className="h-4 w-1/2 animate-pulse rounded-md bg-muted" />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="h-32 animate-pulse rounded-lg bg-muted" />
        <div className="h-32 animate-pulse rounded-lg bg-muted" />
      </div>
    </div>
  )
}

/** Estado vazio genérico. */
export interface EmptyStateProps {
  title: string
  description?: string
  icon?: React.ReactNode
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps): React.ReactElement {
  return (
    <Card className="mx-auto max-w-md">
      <CardHeader className="items-center text-center">
        {icon && <div className="mb-2 text-muted-foreground">{icon}</div>}
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
        {action && (
          <Button className="mt-4" onClick={action.onClick}>
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

/** Página 404 — Not Found. */
export function NotFoundPage(): React.ReactElement {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <EmptyState
        title="Página não encontrada"
        description="A página que você tentou acessar não existe."
        icon={<LayoutDashboard className="h-12 w-12" />}
        action={{
          label: 'Voltar ao Dashboard',
          onClick: () => {
            window.location.href = '/'
          },
        }}
      />
    </div>
  )
}
