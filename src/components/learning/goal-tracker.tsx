/**
 * GoalTracker — barra de progresso da meta semanal de estudo.
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/foundation/card'
import { Target, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { WeeklyGoal } from '@/types/progress'

export interface GoalTrackerProps {
  goal: WeeklyGoal
}

export function GoalTracker({ goal }: GoalTrackerProps): React.ReactElement {
  const percent = Math.min(100, Math.round((goal.completedMinutes / goal.targetMinutes) * 100))
  const isReached = goal.completedMinutes >= goal.targetMinutes

  const completedHours = Math.floor(goal.completedMinutes / 60)
  const completedMins = goal.completedMinutes % 60
  const targetHours = Math.floor(goal.targetMinutes / 60)
  const targetMins = goal.targetMinutes % 60

  const completedStr = `${completedHours}h${completedMins > 0 ? ` ${completedMins}min` : ''}`
  const targetStr = `${targetHours}h${targetMins > 0 ? ` ${targetMins}min` : ''}`

  return (
    <Card className={cn('border-l-4', isReached ? 'border-l-green-500' : 'border-l-blue-500')}>
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        {isReached ? (
          <CheckCircle2 className="h-5 w-5 text-green-500" aria-hidden="true" />
        ) : (
          <Target className="h-5 w-5 text-blue-500" aria-hidden="true" />
        )}
        <CardTitle className="text-sm font-medium">
          {isReached ? 'Meta Semanal Atingida!' : 'Meta Semanal'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progresso</span>
          <span className="font-medium">{percent}%</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500',
              isReached ? 'bg-green-500' : 'bg-blue-500'
            )}
            style={{ width: `${percent}%` }}
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progresso da meta semanal de estudo"
          />
        </div>
        <div className="text-muted-foreground flex justify-between text-xs">
          <span>{completedStr} estudados</span>
          <span>Meta: {targetStr}</span>
        </div>
      </CardContent>
    </Card>
  )
}

GoalTracker.displayName = 'GoalTracker'
