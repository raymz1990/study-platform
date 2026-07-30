import { useCallback, useSyncExternalStore } from 'react'
import { loadProgress, saveProgress } from '@/services/planner-service'
import type { ProgressSnapshot, CompletedTaskRecord } from '@/types/planner'
import { toISODate } from '@/utils/date'

/**
 * Hook para persistência de progresso de tarefas.
 *
 * Responsabilidade: CRUD leve de tarefas concluídas em localStorage.
 * Schema v2: completedTasks[] com disciplineId, topicId, completedDate.
 *
 * Reatividade: useSyncExternalStore subscreve 'planner-progress-updated'
 * e 'storage' (sincronização entre abas), garantindo re-render sem reload.
 */

const EVENT_NAME = 'planner-progress-updated'

function subscribeProgress(callback: () => void): () => void {
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

function getProgressSnapshot(): ProgressSnapshot {
  return loadProgress()
}

export interface UseTaskProgressReturn {
  completedIds: Set<string>
  toggleTask: (taskId: string, disciplineId: string, disciplineName: string, topicId: string, topicName: string) => void
  isCompleted: (taskId: string) => boolean
  progress: ProgressSnapshot
}

export function useTaskProgress(): UseTaskProgressReturn {
  const progress = useSyncExternalStore(subscribeProgress, getProgressSnapshot)

  const toggleTask = useCallback(
    (taskId: string, disciplineId: string, disciplineName: string, topicId: string, topicName: string) => {
      const current = loadProgress()
      const existingIndex = current.completedTasks.findIndex((t) => t.taskId === taskId)

      let nextTasks: CompletedTaskRecord[]
      const nextHoursLogged = { ...current.hoursLogged }
      const today = toISODate(new Date())

      if (existingIndex >= 0) {
        // Desmarcar: remover do array
        nextTasks = current.completedTasks.filter((_, i) => i !== existingIndex)
      } else {
        // Marcar: adicionar com metadados
        nextTasks = [
          ...current.completedTasks,
          {
            taskId,
            completedDate: today,
            disciplineId,
            disciplineName,
            topicId,
            topicName,
          },
        ]
        nextHoursLogged[today] = (nextHoursLogged[today] ?? 0) + 1
      }

      const next: ProgressSnapshot = {
        completedTasks: nextTasks,
        hoursLogged: nextHoursLogged,
        lastUpdated: new Date().toISOString(),
      }

      saveProgress(next)
      // Notificar todos os listeners (incluindo useSyncExternalStore)
      window.dispatchEvent(new Event(EVENT_NAME))
    },
    []
  )

  const isCompleted = useCallback(
    (taskId: string) => progress.completedTasks.some((t) => t.taskId === taskId),
    [progress.completedTasks]
  )

  const completedIds = new Set(progress.completedTasks.map((t) => t.taskId))

  return {
    completedIds,
    toggleTask,
    isCompleted,
    progress,
  }
}
