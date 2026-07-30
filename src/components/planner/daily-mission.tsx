import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/foundation/card'
import { Button } from '@/components/foundation/button'
import { BookOpen, Calendar } from 'lucide-react'
import type { DayPlan } from '@/types/planner'
import type { ReviewItem } from '@/types/dashboard'
import { TaskItem } from './task-item'
import { cn } from '@/lib/utils'

export interface DailyMissionProps {
  dayPlan: DayPlan | null
  reviews: ReviewItem[]
  completedIds: Set<string>
  onTaskToggle: (taskId: string, disciplineId: string, disciplineName: string, topicId: string, topicName: string) => void
}

export function DailyMission({
  dayPlan,
  reviews,
  completedIds,
  onTaskToggle,
}: DailyMissionProps): React.ReactElement {
  if (!dayPlan) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>Plano do Dia</CardTitle>
          <CardDescription>Nenhuma atividade planejada para hoje.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" size="sm">
            <BookOpen className="mr-2 h-4 w-4" />
            Ver cronograma completo
          </Button>
        </CardContent>
      </Card>
    )
  }

  const totalDuration = dayPlan.activities.reduce((sum, a) => sum + a.duration, 0)
  const completedDuration = dayPlan.activities
    .filter((a) => completedIds.has(a.id))
    .reduce((sum, a) => sum + a.duration, 0)
  const progressPercent = totalDuration > 0 ? Math.round((completedDuration / totalDuration) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Cabeçalho do dia */}
      <Card className={cn('border-l-4', dayPlan.isExamDay ? 'border-l-destructive' : 'border-l-primary')}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" aria-hidden="true" />
                {dayPlan.weekdayLabel}, {dayPlan.date}
                {dayPlan.isExamDay && (
                  <span className="text-destructive text-sm font-semibold">(Dia da Prova)</span>
                )}
              </CardTitle>
              <CardDescription>
                {dayPlan.activities.length} atividades · {totalDuration} min previstos
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{progressPercent}%</div>
              <div className="text-muted-foreground text-xs">
                {completedDuration} / {totalDuration} min
              </div>
            </div>
          </div>

          {/* Barra de progresso */}
          <div className="bg-muted mt-2 h-2 w-full overflow-hidden rounded-full">
            <div
              className="bg-primary h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </CardHeader>
      </Card>

      {/* Atividades */}
      <section>
        <h2 className="mb-3 text-lg font-semibold">Atividades</h2>
        {dayPlan.activities.length === 0 ? (
          <p className="text-muted-foreground text-sm">Nenhuma atividade para hoje.</p>
        ) : (
          <ul className="space-y-2" role="list">
            {dayPlan.activities.map((activity) => (
              <TaskItem
                key={activity.id}
                activity={activity}
                isCompleted={completedIds.has(activity.id)}
                onToggle={() =>
                  onTaskToggle(
                    activity.id,
                    activity.disciplineId,
                    activity.discipline,
                    activity.topicId,
                    activity.title
                  )
                }
              />
            ))}
          </ul>
        )}
      </section>

      {/* Revisões do dia */}
      {reviews.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold">Revisões Pendentes</h2>
          <ul className="space-y-2" role="list">
            {reviews.slice(0, 5).map((review) => (
              <li
                key={review.id}
                className={cn(
                  'flex items-center justify-between rounded-md border-l-4 p-3',
                  review.urgency === 'urgent' && 'border-l-destructive bg-red-50 dark:bg-red-950/20',
                  review.urgency === 'attention' && 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/20',
                  review.urgency === 'normal' && 'border-l-muted-foreground'
                )}
              >
                <div>
                  <p className="text-sm font-medium">{review.topic}</p>
                  <p className="text-muted-foreground text-xs">
                    {review.discipline} · {review.type === '24h' ? 'Revisão 24h' : review.type === '7d' ? 'Revisão 7 dias' : 'Revisão 30 dias'}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

DailyMission.displayName = 'DailyMission'
