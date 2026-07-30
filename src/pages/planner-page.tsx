import { StudyPlanner } from '@/components/planner/study-planner'
import { usePlannerData } from '@/hooks/use-planner-data'
import { useTaskProgress } from '@/hooks/use-task-progress'
import { Skeleton } from '@/components/foundation/skeleton'
import { AlertTriangle } from 'lucide-react'

/**
 * PlannerPage — página de Cronograma (/cronograma).
 *
 * Integra StudyPlanner com hooks de dados e progresso.
 */
export function PlannerPage(): React.ReactElement {
  const { completedIds, toggleTask } = useTaskProgress()

  const { studyPlan, dailyPlan, reviews, isLoading, error } = usePlannerData()

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-1/2" />
        <div className="grid gap-4 sm:grid-cols-3">
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-20">
        <AlertTriangle className="text-destructive h-12 w-12" aria-hidden="true" />
        <h2 className="text-xl font-semibold">Erro ao carregar cronograma</h2>
        <p className="text-muted-foreground">{error}</p>
      </div>
    )
  }

  return (
    <StudyPlanner
      studyPlan={studyPlan}
      dailyPlan={dailyPlan}
      reviews={reviews}
      completedIds={completedIds}
      onTaskToggle={toggleTask}
    />
  )
}

PlannerPage.displayName = 'PlannerPage'
