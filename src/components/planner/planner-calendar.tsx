import { Card, CardContent, CardHeader, CardTitle } from '@/components/foundation/card'
import { Badge } from '@/components/foundation/badge'
import { CalendarDays } from 'lucide-react'
import type { WeekPlan } from '@/types/planner'
import { cn } from '@/lib/utils'

export interface PlannerCalendarProps {
  weeks: WeekPlan[]
  currentWeek: number
  examDate: string
  completedIds: Set<string>
}

export function PlannerCalendar({
  weeks,
  currentWeek,
  examDate,
  completedIds,
}: PlannerCalendarProps): React.ReactElement {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5" aria-hidden="true" />
          Cronograma Completo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {weeks.map((week) => (
            <div
              key={week.weekNumber}
              className={cn(
                'rounded-lg border p-3',
                week.weekNumber === currentWeek && 'border-primary bg-primary/5'
              )}
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="text-sm font-semibold">Semana {week.weekNumber}</span>
                <span className="text-muted-foreground text-xs">
                  {week.range.start} — {week.range.end}
                </span>
                {week.weekNumber === currentWeek && (
                  <Badge variant="info" className="text-[10px]">Atual</Badge>
                )}
                {week.days.some((d) => d.date === examDate) && (
                  <Badge variant="danger" className="text-[10px]">Prova</Badge>
                )}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {week.days.map((day) => {
                  const completed = day.activities.filter((a) => completedIds.has(a.id)).length
                  const total = day.activities.length

                  return (
                    <div
                      key={day.date}
                      className={cn(
                        'rounded p-2 text-center text-xs',
                        day.isCurrentDay && 'bg-primary text-primary-foreground',
                        day.isExamDay && 'bg-destructive text-destructive-foreground',
                        !day.isCurrentDay && !day.isExamDay && 'bg-muted'
                      )}
                    >
                      <div className="font-medium">{day.weekdayLabel.slice(0, 3)}</div>
                      <div>{day.date.slice(8)}</div>
                      {total > 0 && (
                        <div className="mt-1 text-[10px]">
                          {completed}/{total}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

PlannerCalendar.displayName = 'PlannerCalendar'
