import { useState } from 'react'
import { cn } from '@/lib/utils'
import { DailyMission } from './daily-mission'
import { WeeklyPlan } from './weekly-plan'
import { PlannerCalendar } from './planner-calendar'
import type { StudyPlan, DayPlan } from '@/types/planner'
import type { ReviewItem } from '@/types/dashboard'

export interface StudyPlannerProps {
  studyPlan: StudyPlan
  dailyPlan: DayPlan | null
  reviews: ReviewItem[]
  completedIds: Set<string>
  onTaskToggle: (taskId: string, disciplineId: string, disciplineName: string, topicId: string, topicName: string) => void
}

type ViewMode = 'today' | 'week' | 'month'

export function StudyPlanner({
  studyPlan,
  dailyPlan,
  reviews,
  completedIds,
  onTaskToggle,
}: StudyPlannerProps): React.ReactElement {
  const [activeView, setActiveView] = useState<ViewMode>('today')
  const [weekOffset, setWeekOffset] = useState(0)

  const visibleWeekIndex = clamp(
    studyPlan.currentWeek - 1 + weekOffset,
    0,
    studyPlan.weeks.length - 1
  )
  const visibleWeek = studyPlan.weeks[visibleWeekIndex]

  const tabs: { value: ViewMode; label: string }[] = [
    { value: 'today', label: 'Hoje' },
    { value: 'week', label: 'Semana' },
    { value: 'month', label: 'Mês' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Cronograma</h1>
        <p className="text-muted-foreground text-sm">
          Prova: {studyPlan.examDate} · Semana {studyPlan.currentWeek} de {studyPlan.totalWeeks}
        </p>
      </div>

      {/* Tabs manuais */}
      <div className="bg-muted inline-flex rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActiveView(tab.value)}
            className={cn(
              'rounded-md px-4 py-1.5 text-sm font-medium transition-colors',
              activeView === tab.value
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
            aria-pressed={activeView === tab.value}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {activeView === 'today' && (
          <DailyMission
            dayPlan={dailyPlan}
            reviews={reviews}
            completedIds={completedIds}
            onTaskToggle={onTaskToggle}
          />
        )}

        {activeView === 'week' && visibleWeek && (
          <WeeklyPlan
            week={visibleWeek}
            currentWeek={studyPlan.currentWeek}
            completedIds={completedIds}
            onNavigate={(delta) =>
              setWeekOffset((prev) =>
                clamp(
                  prev + delta,
                  -(studyPlan.currentWeek - 1),
                  studyPlan.totalWeeks - studyPlan.currentWeek
                )
              )
            }
          />
        )}

        {activeView === 'month' && (
          <PlannerCalendar
            weeks={studyPlan.weeks}
            currentWeek={studyPlan.currentWeek}
            examDate={studyPlan.examDate}
            completedIds={completedIds}
          />
        )}
      </div>
    </div>
  )
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

StudyPlanner.displayName = 'StudyPlanner'
