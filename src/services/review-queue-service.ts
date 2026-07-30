/**
 * Review Queue Service — Concurso AI Platform.
 *
 * Responsabilidade: calcular fila de revisões espaçadas a partir de tarefas concluídas.
 * Algoritmo: 24h → 7d → 30d (adaptação ADR-008 para janela de 11 semanas).
 */

import type { ReviewItem } from '@/types/dashboard'
import type { CompletedTask } from '@/types/planner'
import { toISODate, diffDays, addDays } from '@/utils/date'

// ---------------------------------------------------------------------------
// Cálculo de datas de revisão
// ---------------------------------------------------------------------------

export function calculateNextReviewDates(completedDate: string): {
  r24h: string
  r7d: string
  r30d: string
} {
  const base = addDays(new Date(completedDate + 'T00:00:00'), 0)

  return {
    r24h: toISODate(addDays(base, 1)),
    r7d: toISODate(addDays(base, 7)),
    r30d: toISODate(addDays(base, 30)),
  }
}

// ---------------------------------------------------------------------------
// Urgência
// ---------------------------------------------------------------------------

function calculateUrgency(scheduledDate: string, currentDate: Date): ReviewItem['urgency'] {
  const today = toISODate(currentDate)
  const delta = diffDays(scheduledDate, today)

  if (delta > 0) return 'urgent'
  if (delta === 0) return 'attention'
  return 'normal'
}

// ---------------------------------------------------------------------------
// Geração da fila de revisões
// ---------------------------------------------------------------------------

export function generateReviewQueue(
  completedTasks: CompletedTask[],
  currentDate: Date = new Date()
): ReviewItem[] {
  const seen = new Set<string>()
  const reviews: ReviewItem[] = []

  for (const task of completedTasks) {
    const key = `${task.taskId}_7d`
    if (seen.has(key)) continue
    seen.add(key)

    const dates = calculateNextReviewDates(task.completedDate)

    // Revisão de 24h
    if (diffDays(dates.r24h, toISODate(currentDate)) >= 0) {
      reviews.push({
        id: `rev_${task.taskId}_24h`,
        topic: `${task.topic} — Revisão 24h`,
        discipline: task.discipline,
        type: '24h',
        scheduledDate: dates.r24h,
        urgency: calculateUrgency(dates.r24h, currentDate),
        completed: false,
      })
    }

    // Revisão de 7d
    if (diffDays(dates.r7d, toISODate(currentDate)) >= 0) {
      reviews.push({
        id: `rev_${task.taskId}_7d`,
        topic: `${task.topic} — Revisão 7 dias`,
        discipline: task.discipline,
        type: '7d',
        scheduledDate: dates.r7d,
        urgency: calculateUrgency(dates.r7d, currentDate),
        completed: false,
      })
    }

    // Revisão de 30d
    if (diffDays(dates.r30d, toISODate(currentDate)) >= 0) {
      reviews.push({
        id: `rev_${task.taskId}_30d`,
        topic: `${task.topic} — Revisão 30 dias`,
        discipline: task.discipline,
        type: '30d',
        scheduledDate: dates.r30d,
        urgency: calculateUrgency(dates.r30d, currentDate),
        completed: false,
      })
    }
  }

  // Ordenar por urgência
  const order = { urgent: 0, attention: 1, normal: 2 }
  reviews.sort((a, b) => order[a.urgency] - order[b.urgency])

  return reviews
}

// ---------------------------------------------------------------------------
// Verificar se revisão está vencida
// ---------------------------------------------------------------------------

export function isReviewOverdue(review: ReviewItem, currentDate: Date = new Date()): boolean {
  return diffDays(review.scheduledDate, toISODate(currentDate)) > 0
}
