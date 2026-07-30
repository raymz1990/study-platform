import { describe, it, expect } from 'vitest'
import { generateReviewQueue, calculateNextReviewDates, isReviewOverdue } from './review-queue-service'
import type { CompletedTask } from '@/types/planner'

describe('review-queue-service', () => {
  describe('calculateNextReviewDates', () => {
    it('calcula datas de revisão corretamente', () => {
      const dates = calculateNextReviewDates('2026-07-28')
      expect(dates.r24h).toBe('2026-07-29')
      expect(dates.r7d).toBe('2026-08-04')
      expect(dates.r30d).toBe('2026-08-27')
    })
  })

  describe('generateReviewQueue', () => {
    it('gera revisões para tarefas concluídas', () => {
      const tasks: CompletedTask[] = [
        {
          taskId: 'task_001',
          topic: 'Juros Compostos',
          discipline: 'Matemática Financeira',
          completedDate: '2026-07-28',
        },
      ]

      const reviews = generateReviewQueue(tasks, new Date(2026, 7, 5)) // 2026-08-05 local

      expect(reviews.length).toBeGreaterThan(0)
      expect(reviews.some((r) => r.type === '24h')).toBe(true)
      expect(reviews.some((r) => r.type === '7d')).toBe(true)
      // Revisão 30d só aparece quando scheduledDate <= currentDate
      // Neste caso: 2026-08-27 > 2026-08-05, então não deve aparecer
      expect(reviews.some((r) => r.type === '30d')).toBe(false)
    })

    it('inclui revisão 30d quando data atual é posterior', () => {
      const tasks: CompletedTask[] = [
        {
          taskId: 'task_001',
          topic: 'Juros Compostos',
          discipline: 'Matemática Financeira',
          completedDate: '2026-07-01',
        },
      ]

      const reviews = generateReviewQueue(tasks, new Date(2026, 7, 15)) // 2026-08-15 local
      expect(reviews.some((r) => r.type === '30d')).toBe(true)
    })

    it('marca revisão atrasada como urgent', () => {
      const tasks: CompletedTask[] = [
        {
          taskId: 'task_001',
          topic: 'Juros Compostos',
          discipline: 'Matemática Financeira',
          completedDate: '2026-07-01',
        },
      ]

      const reviews = generateReviewQueue(tasks, new Date(2026, 7, 15)) // 2026-08-15 local
      const overdue = reviews.filter((r) => r.urgency === 'urgent')
      expect(overdue.length).toBeGreaterThan(0)
    })

    it('retorna lista vazia sem tarefas concluídas', () => {
      const reviews = generateReviewQueue([], new Date(2026, 7, 15)) // 2026-08-15 local
      expect(reviews).toHaveLength(0)
    })

    it('não duplica revisões para mesma tarefa', () => {
      const tasks: CompletedTask[] = [
        {
          taskId: 'task_001',
          topic: 'Juros Compostos',
          discipline: 'Matemática Financeira',
          completedDate: '2026-07-28',
        },
        {
          taskId: 'task_001',
          topic: 'Juros Compostos',
          discipline: 'Matemática Financeira',
          completedDate: '2026-07-28',
        },
      ]

      const reviews = generateReviewQueue(tasks, new Date(2026, 7, 5)) // 2026-08-05 local
      const uniqueTypes = new Set(reviews.map((r) => r.type))
      expect(uniqueTypes.size).toBe(reviews.length)
    })

    it('ordena revisões por urgência (urgent > attention > normal)', () => {
      const tasks: CompletedTask[] = [
        {
          taskId: 'task_001',
          topic: 'Juros Compostos',
          discipline: 'Matemática Financeira',
          completedDate: '2026-07-28',
        },
      ]

      // Data exata da revisão 24h (2026-07-29) → attention
      const reviews = generateReviewQueue(tasks, new Date(2026, 6, 29)) // 2026-07-29 local
      expect(reviews.length).toBeGreaterThan(0)
      expect(reviews[0]?.urgency).toBe('attention')
    })
  })

  describe('isReviewOverdue', () => {
    it('retorna true para revisão atrasada', () => {
      const review = {
        id: 'rev_001',
        topic: 'Teste',
        discipline: 'Teste',
        type: '7d' as const,
        scheduledDate: '2026-07-20',
        urgency: 'urgent' as const,
        completed: false,
      }
      expect(isReviewOverdue(review, new Date(2026, 7, 15))).toBe(true) // 2026-08-15 local
    })

    it('retorna false para revisão no futuro', () => {
      const review = {
        id: 'rev_001',
        topic: 'Teste',
        discipline: 'Teste',
        type: '7d' as const,
        scheduledDate: '2026-08-20',
        urgency: 'normal' as const,
        completed: false,
      }
      expect(isReviewOverdue(review, new Date(2026, 7, 15))).toBe(false) // 2026-08-15 local
    })
  })
})
