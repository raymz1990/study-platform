/**
 * KpiCard — componente de métrica-chave do Dashboard.
 *
 * Exibe um valor destacado, rótulo e ícone opcional.
 * Estados: default, loading (skeleton).
 */

import { type ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/foundation/card'
import { Skeleton } from '@/components/foundation/skeleton'
import { cn } from '@/lib/utils'

export interface KpiCardProps {
  title: string
  value: string | number
  description?: string
  icon?: ReactNode
  isLoading?: boolean
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
}

const variantIconClasses: Record<NonNullable<KpiCardProps['variant']>, string> = {
  default: 'bg-muted text-muted-foreground',
  success: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  danger: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
}

export function KpiCard({
  title,
  value,
  description,
  icon,
  isLoading = false,
  variant = 'default',
}: KpiCardProps): React.ReactElement {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-24" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16" />
          <Skeleton className="mt-2 h-3 w-32" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card variant="interactive">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && (
          <div
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full',
              variantIconClasses[variant]
            )}
            aria-hidden="true"
          >
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        {description && <p className="text-muted-foreground text-xs">{description}</p>}
      </CardContent>
    </Card>
  )
}

KpiCard.displayName = 'KpiCard'
