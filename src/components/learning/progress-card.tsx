/**
 * ProgressCard — card reutilizável de métrica de progresso.
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/foundation/card'
import { Skeleton } from '@/components/foundation/skeleton'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

export interface ProgressCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  iconColor?: string
  isLoading?: boolean
}

export function ProgressCard({
  title,
  value,
  description,
  icon: Icon,
  iconColor = 'text-primary',
  isLoading = false,
}: ProgressCardProps): React.ReactElement {
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
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <Icon className={cn('h-4 w-4', iconColor)} aria-hidden="true" />
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-muted-foreground mt-1 text-xs">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}

ProgressCard.displayName = 'ProgressCard'
