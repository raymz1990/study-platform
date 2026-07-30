import { Card, CardContent, CardHeader, CardTitle } from '@/components/foundation/card'
import { Badge } from '@/components/foundation/badge'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { Button } from '@/components/foundation/button'
import type { WeekPlan, DayPlan } from '@/types/planner'
import { cn } from '@/lib/utils'

export interface WeeklyPlanProps {
  week: WeekPlan
  currentWeek: number
  completedIds: Set<string>
  onNavigate: (delta: number) => void
}

function DayCard({ day, completedIds }: { day: DayPlan; completedIds: Set<string> }): React.ReactElement {
  const completed = day.activities.filter((a) => completedIds.has(a.id)).length
  const total = day.activities.length

  return (
    <div
      className={cn(
        'rounded-lg border p-3 transition-colors',
        day.isCurrentDay ? 'border-primary bg-primary/5' : 'border-border'
      )}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium">{day.weekdayLabel}</span>
        <span className="text-muted-foreground text-xs">{day.date.slice(5)}</span>
      </div>

      {day.activities.length === 0 ? (
        <p className="text-muted-foreground text-xs">Sem atividades</p>
      ) : (
        <div className="space-y-1">
          {day.activities.slice(0, 3).map((activity) => (
            <div key={activity.id} className="flex items-center gap-2 text-xs">
              <div
                className={cn(
                  'h-2 w-2 rounded-full',
                  completedIds.has(activity.id) ? 'bg-green-500' : 'bg-muted-foreground'
                )}
              />
              <span className="truncate">{activity.title}</span>
            </div>
          ))}
          {day.activities.length > 3 && (
            <p className="text-muted-foreground text-xs">+{day.activities.length - 3} mais</p>
          )}
        </div>
      )}

      {total > 0 && (
        <div className="mt-2 flex items-center gap-2">
          <Badge variant={completed === total ? 'success' : 'default'} className="text-[10px]">
            {completed}/{total}
          </Badge>
        </div>
      )}
    </div>
  )
}

export function WeeklyPlan({
  week,
  currentWeek,
  completedIds,
  onNavigate,
}: WeeklyPlanProps): React.ReactElement {
  const isCurrentWeek = week.weekNumber === currentWeek

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" aria-hidden="true" />
              Semana {week.weekNumber}
              {isCurrentWeek && (
                <Badge variant="info" className="text-[10px]">Atual</Badge>
              )}
            </CardTitle>
            <p className="text-muted-foreground text-sm">
              {week.range.start} — {week.range.end}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => onNavigate(-1)} aria-label="Semana anterior">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onNavigate(1)} aria-label="Próxima semana">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          {week.days.map((day) => (
            <DayCard key={day.date} day={day} completedIds={completedIds} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

WeeklyPlan.displayName = 'WeeklyPlan'
