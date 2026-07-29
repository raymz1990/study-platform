/**
 * DailyPlanCard — Plano do dia no topo do Dashboard.
 *
 * Exibe disciplinas do momento, tarefas e tempo previsto.
 * Hierarquia visual: plano do dia → revisões → progresso → estatísticas.
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
import { CheckCircle2, Clock, BookOpen, Play } from 'lucide-react'
import type { DailyPlan, DailyTask } from '@/types/dashboard'
import { cn } from '@/lib/utils'

export interface DailyPlanCardProps {
  plan: DailyPlan | null
  isLoading?: boolean
}

const priorityBadgeVariant: Record<DailyTask['priority'], 'default' | 'warning' | 'danger'> = {
  low: 'default',
  medium: 'warning',
  high: 'danger',
}

const statusIconClasses: Record<DailyTask['status'], string> = {
  pending: 'text-muted-foreground',
  in_progress: 'text-blue-500',
  completed: 'text-green-500',
  cancelled: 'text-muted-foreground line-through',
}

function TaskRow({ task }: { task: DailyTask }): React.ReactElement {
  return (
    <li className="hover:bg-accent/50 flex items-start gap-3 rounded-md p-2 transition-colors">
      <div className={cn('mt-0.5', statusIconClasses[task.status])}>
        {task.status === 'completed' ? (
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
        ) : task.status === 'in_progress' ? (
          <Play className="h-4 w-4" aria-hidden="true" />
        ) : (
          <div className="h-4 w-4 rounded-full border-2 border-current" aria-hidden="true" />
        )}
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'text-sm font-medium',
              task.status === 'completed' && 'text-muted-foreground line-through'
            )}
          >
            {task.title}
          </span>
          <Badge variant={priorityBadgeVariant[task.priority]} className="text-[10px]">
            {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}
          </Badge>
        </div>
        <p className="text-muted-foreground text-xs">{task.description}</p>
        <div className="text-muted-foreground flex items-center gap-1 text-xs">
          <Clock className="h-3 w-3" aria-hidden="true" />
          {task.time} min
        </div>
      </div>
    </li>
  )
}

export function DailyPlanCard({ plan, isLoading = false }: DailyPlanCardProps): React.ReactElement {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-56" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (!plan) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>Plano do Dia</CardTitle>
          <CardDescription>Nenhum plano configurado para hoje.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" size="sm">
            <BookOpen className="mr-2 h-4 w-4" />
            Criar plano
          </Button>
        </CardContent>
      </Card>
    )
  }

  const progressPercent = Math.round((plan.completedTime / Math.max(1, plan.estimatedTime)) * 100)

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Plano do Dia</CardTitle>
            <CardDescription>
              {plan.disciplines.join(' · ')} — {plan.estimatedTime} min previstos
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{progressPercent}%</div>
            <div className="text-muted-foreground text-xs">
              {plan.completedTime} / {plan.estimatedTime} min
            </div>
          </div>
        </div>
        {/* Barra de progresso */}
        <div className="bg-muted mt-2 h-2 w-full overflow-hidden rounded-full">
          <div
            className="h-full rounded-full bg-blue-500 transition-all"
            style={{ width: `${progressPercent}%` }}
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            role="progressbar"
          />
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1" role="list">
          {plan.tasks.map((task) => (
            <TaskRow key={task.id} task={task} />
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

DailyPlanCard.displayName = 'DailyPlanCard'
