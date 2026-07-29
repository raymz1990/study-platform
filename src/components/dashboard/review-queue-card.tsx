/**
 * ReviewQueueCard — fila de revisões pendentes/vencidas.
 *
 * Destaca itens urgentes em vermelho.
 * Hierarquia visual: revisões → cronograma → progresso → estatísticas.
 */

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/foundation/card'
import { Skeleton } from '@/components/foundation/skeleton'
import { Badge } from '@/components/foundation/badge'
import { Button } from '@/components/foundation/button'
import { AlertTriangle, RefreshCw, BookOpen } from 'lucide-react'
import type { ReviewItem } from '@/types/dashboard'
import { cn } from '@/lib/utils'

export interface ReviewQueueCardProps {
  reviews: ReviewItem[]
  isLoading?: boolean
}

const urgencyConfig = {
  urgent: {
    badge: 'danger' as const,
    border: 'border-l-destructive',
    label: 'Urgente',
  },
  attention: {
    badge: 'warning' as const,
    border: 'border-l-yellow-500',
    label: 'Atenção',
  },
  normal: {
    badge: 'default' as const,
    border: 'border-l-muted-foreground',
    label: 'Normal',
  },
}

function ReviewRow({ review }: { review: ReviewItem }): React.ReactElement {
  const config = urgencyConfig[review.urgency]
  return (
    <li
      className={cn(
        'bg-card hover:bg-accent/50 flex items-center justify-between rounded-md border-l-4 p-3 transition-colors',
        config.border
      )}
    >
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{review.topic}</span>
          <Badge variant={config.badge} className="text-[10px]">
            {config.label}
          </Badge>
        </div>
        <p className="text-muted-foreground text-xs">
          {review.discipline} · {review.type === 'free' ? 'Livre' : `Revisão ${review.type}`}
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        aria-label={`Revisar ${review.topic}`}
      >
        <RefreshCw className="h-4 w-4" aria-hidden="true" />
      </Button>
    </li>
  )
}

export function ReviewQueueCard({
  reviews,
  isLoading = false,
}: ReviewQueueCardProps): React.ReactElement {
  const pendingCount = reviews.filter((r) => !r.completed).length
  const urgentCount = reviews.filter((r) => !r.completed && r.urgency === 'urgent').length

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (pendingCount === 0) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>Revisões Pendentes</CardTitle>
          <CardDescription>Nenhuma revisão pendente. Ótimo trabalho!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            Continue estudando para gerar novas revisões.
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Revisões Pendentes
              {urgentCount > 0 && (
                <AlertTriangle className="text-destructive h-4 w-4" aria-hidden="true" />
              )}
            </CardTitle>
            <CardDescription>
              {pendingCount} item{pendingCount > 1 ? 's' : ''} para revisar
              {urgentCount > 0 && (
                <span className="text-destructive ml-1">
                  ({urgentCount} urgente{urgentCount > 1 ? 's' : ''})
                </span>
              )}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2" role="list">
          {reviews
            .filter((r) => !r.completed)
            .sort((a, b) => {
              const order = { urgent: 0, attention: 1, normal: 2 }
              return order[a.urgency] - order[b.urgency]
            })
            .map((review) => (
              <ReviewRow key={review.id} review={review} />
            ))}
        </ul>
      </CardContent>
    </Card>
  )
}

ReviewQueueCard.displayName = 'ReviewQueueCard'
