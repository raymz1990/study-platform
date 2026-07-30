/**
 * DisciplineCard — card de disciplina para listagem.
 *
 * Requisitos:
 * - Exibe nome, progresso, prioridade, horas estimadas/estudadas.
 * - Cores semânticas de status (não iniciada/em andamento/concluída).
 * - Navegável por teclado e clicável.
 * - Responsivo (grid de 1–3 colunas na página pai).
 */

import { BookOpen, Clock, ArrowRight } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/foundation/card'
import { Badge } from '@/components/foundation/badge'
import { cn } from '@/lib/utils'
import type { DisciplineWithProgress } from '@/types/discipline'

export interface DisciplineCardProps {
  discipline: DisciplineWithProgress
  onClick?: (id: string) => void
}

const STATUS_CONFIG = {
  not_started: { label: 'Não iniciada', badgeVariant: 'outline' as const, barColor: 'bg-muted' },
  in_progress: { label: 'Em andamento', badgeVariant: 'info' as const, barColor: 'bg-blue-500' },
  completed: { label: 'Concluída', badgeVariant: 'success' as const, barColor: 'bg-green-500' },
  review: { label: 'Revisão', badgeVariant: 'warning' as const, barColor: 'bg-yellow-500' },
}

const PRIORITY_LABEL: Record<number, string> = {
  1: 'Alta',
  2: 'Média',
  3: 'Baixa',
}

export function DisciplineCard({ discipline, onClick }: DisciplineCardProps): React.ReactElement {
  const statusConfig = STATUS_CONFIG[discipline.status]
  const priorityLabel = PRIORITY_LABEL[discipline.priority] ?? String(discipline.priority)

  return (
    <Card
      variant="interactive"
      className="group relative flex flex-col"
      role="button"
      tabIndex={0}
      onClick={() => onClick?.(discipline.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.(discipline.id)
        }
      }}
      aria-label={`Disciplina ${discipline.name}, status ${statusConfig.label}, progresso ${discipline.percentCompleted}%`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" aria-hidden="true" />
            <CardTitle className="text-base">{discipline.name}</CardTitle>
          </div>
          <Badge variant={statusConfig.badgeVariant}>{statusConfig.label}</Badge>
        </div>
        <CardDescription className="line-clamp-2">{discipline.description}</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col justify-end gap-3 pt-0">
        {/* Barra de progresso */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progresso</span>
            <span>{discipline.percentCompleted}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn('h-full rounded-full transition-all', statusConfig.barColor)}
              style={{ width: `${discipline.percentCompleted}%` }}
            />
          </div>
        </div>

        {/* Metadados */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {discipline.studiedHours}h / {discipline.estimatedHours}h
            </span>
            <span>Peso {discipline.weight}</span>
          </div>
          <Badge variant="outline" className="text-[10px]">
            Prioridade {priorityLabel}
          </Badge>
        </div>

        {/* Arrow hint on hover */}
        <div className="flex justify-end">
          <ArrowRight
            className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
            aria-hidden="true"
          />
        </div>
      </CardContent>
    </Card>
  )
}

DisciplineCard.displayName = 'DisciplineCard'
