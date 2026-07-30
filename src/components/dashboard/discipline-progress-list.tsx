/**
 * DisciplineProgressList — lista de progresso por disciplina.
 *
 * Exibe 12 disciplinas com barra de progresso individual.
 * Cores semânticas conforme estado de estudo.
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
import type { DisciplineProgress } from '@/types/dashboard'
import { cn } from '@/lib/utils'

export interface DisciplineProgressListProps {
  disciplines: DisciplineProgress[]
  isLoading?: boolean
}

const statusConfig: Record<
  DisciplineProgress['status'],
  { label: string; badge: 'default' | 'success' | 'warning' | 'danger' | 'info' }
> = {
  not_started: { label: 'Não iniciado', badge: 'default' },
  in_progress: { label: 'Em andamento', badge: 'info' },
  completed: { label: 'Concluído', badge: 'success' },
  review: { label: 'Revisão', badge: 'warning' },
}

function ProgressBar({ percent }: { percent: number }): React.ReactElement {
  const colorClass =
    percent >= 80
      ? 'bg-green-500'
      : percent >= 50
        ? 'bg-blue-500'
        : percent >= 25
          ? 'bg-yellow-500'
          : 'bg-red-500'

  return (
    <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
      <div
        className={cn('h-full rounded-full transition-all', colorClass)}
        style={{ width: `${percent}%` }}
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        role="progressbar"
      />
    </div>
  )
}

function DisciplineRow({ discipline }: { discipline: DisciplineProgress }): React.ReactElement {
  const config = statusConfig[discipline.status]

  return (
    <li className="hover:bg-accent/50 space-y-2 rounded-md p-2 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{discipline.name}</span>
          <Badge variant={config.badge} className="text-[10px]">
            {config.label}
          </Badge>
        </div>
        <div className="text-muted-foreground text-right text-xs">
          {discipline.studiedHours}h / {discipline.estimatedHours}h
        </div>
      </div>
      <ProgressBar percent={discipline.percentCompleted} />
      <div className="text-muted-foreground flex justify-between text-xs">
        <span>{discipline.percentCompleted}% completo</span>
        {discipline.weight > 1 && <span>Peso {discipline.weight}</span>}
      </div>
    </li>
  )
}

export function DisciplineProgressList({
  disciplines,
  isLoading = false,
}: DisciplineProgressListProps): React.ReactElement {
  const sorted = [...disciplines].sort((a, b) => a.order - b.order)

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-56" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (disciplines.length === 0) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>Progresso por Disciplina</CardTitle>
          <CardDescription>Nenhuma disciplina configurada.</CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm">
          Adicione disciplinas no cronograma para acompanhar seu progresso.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progresso por Disciplina</CardTitle>
        <CardDescription>
          {disciplines.length} disciplinas ·{' '}
          {Math.round(
            disciplines.reduce((sum, d) => sum + d.percentCompleted, 0) / disciplines.length
          )}
          % médio
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1" role="list">
          {sorted.map((discipline) => (
            <DisciplineRow key={discipline.id} discipline={discipline} />
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

DisciplineProgressList.displayName = 'DisciplineProgressList'
