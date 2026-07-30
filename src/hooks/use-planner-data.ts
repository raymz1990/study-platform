import { useSyncExternalStore } from 'react'
import { loadStudyPlan, getDailyPlan, getCompletedTasksForReview, loadProgress } from '@/services/planner-service'
import { generateReviewQueue } from '@/services/review-queue-service'

/**
 * Hook para carregar e sincronizar dados do Planner.
 *
 * Responsabilidade: orquestrar planner-service e review-queue-service
 * usando a fonte única de persistência (localStorage).
 *
 * Reatividade: useSyncExternalStore subscreve 'planner-progress-updated'
 * e 'storage', garantindo que revisões e plano diário atualizem sem reload.
 */

const EVENT_NAME = 'planner-progress-updated'

function subscribePlanner(callback: () => void): () => void {
  const handleCustom = (): void => callback()
  const handleStorage = (e: StorageEvent): void => {
    if (e.key === 'cap.planner.progress') callback()
  }

  window.addEventListener(EVENT_NAME, handleCustom)
  window.addEventListener('storage', handleStorage)

  return () => {
    window.removeEventListener(EVENT_NAME, handleCustom)
    window.removeEventListener('storage', handleStorage)
  }
}

export interface UsePlannerDataReturn {
  studyPlan: ReturnType<typeof loadStudyPlan>
  dailyPlan: ReturnType<typeof getDailyPlan>
  reviews: ReturnType<typeof generateReviewQueue>
  isLoading: boolean
  error: string | null
}

function getPlannerSnapshot(currentDate: Date): UsePlannerDataReturn {
  try {
    const studyPlan = loadStudyPlan(currentDate)
    const dailyPlan = getDailyPlan(studyPlan, currentDate)
    const progress = loadProgress()

    const completedTasks = getCompletedTasksForReview(progress)
    const reviews = generateReviewQueue(completedTasks, currentDate)

    return {
      studyPlan,
      dailyPlan,
      reviews,
      isLoading: false,
      error: null,
    }
  } catch {
    return {
      studyPlan: {
        examDate: '2026-10-11',
        startDate: '2026-07-27',
        totalWeeks: 11,
        currentWeek: 1,
        weeks: [],
      },
      dailyPlan: null,
      reviews: [],
      isLoading: false,
      error: 'Não foi possível carregar o cronograma.',
    }
  }
}

export function usePlannerData(currentDate: Date = new Date()): UsePlannerDataReturn {
  return useSyncExternalStore(
    subscribePlanner,
    () => getPlannerSnapshot(currentDate),
    () => getPlannerSnapshot(currentDate)
  )
}
