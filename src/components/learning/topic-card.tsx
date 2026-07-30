/**
 * TopicCard — card de capítulo/tópico para a página de detalhe.
 *
 * Requisitos:
 * - Exibe título, tempo estimado, dificuldade.
 * - Status visual (não iniciado/em andamento/concluído).
 * - Navegável por teclado.
 */

import { FileText, Clock } from 'lucide-react'
import {
  Card,
  CardTitle,
} from '@/components/foundation/card'
import { Badge } from '@/components/foundation/badge'
import { cn } from '@/lib/utils'
import type { Chapter, DisciplineStatus } from '@/types/discipline'

export interface TopicCardProps {
  chapter: Chapter
  status: DisciplineStatus
  onClick: ((id: string) => void) | undefined
}

const DIFFICULTY_LABEL: Record<string, string> = {
  low: 'Fácil',
  medium: 'Médio',
  high: 'Difícil',
}

const DIFFICULTY_VARIANT: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline' | 'secondary'> = {
  low: 'success',
  medium: 'warning',
  high: 'danger',
}

const STATUS_ICON_COLOR: Record<DisciplineStatus, string> = {
  not_started: 'text-muted-foreground',
  in_progress: 'text-blue-500',
  completed: 'text-green-500',
  review: 'text-yellow-500',
}

export function TopicCard({ chapter, status, onClick }: TopicCardProps): React.ReactElement {
  return (
    <Card
      variant="interactive"
      className="flex items-center gap-4 p-4"
      role="button"
      tabIndex={0}
      onClick={() => onClick?.(chapter.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.(chapter.id)
        }
      }}
      aria-label={`Capítulo ${chapter.title}, dificuldade ${DIFFICULTY_LABEL[chapter.difficulty]}, status ${status}`}
    >
      <FileText className={cn('h-5 w-5 shrink-0', STATUS_ICON_COLOR[status])} aria-hidden="true" />

      <div className="min-w-0 flex-1">
        <CardTitle className="text-sm font-medium">{chapter.title}</CardTitle>
        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" aria-hidden="true" />
            {chapter.estimatedTime} min
          </span>
        </div>
      </div>

      <Badge variant={DIFFICULTY_VARIANT[chapter.difficulty] ?? 'default'} className="shrink-0 text-[10px]">
        {DIFFICULTY_LABEL[chapter.difficulty] ?? chapter.difficulty}
      </Badge>
    </Card>
  )
}

TopicCard.displayName = 'TopicCard'
