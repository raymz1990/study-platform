import { describe, it, expect } from 'vitest'
import {
  calculateSyllabusPercent,
  calculateDisciplinePercent,
  calculateCorrectRate,
  calculateRemainingHours,
  calculateDaysUntilExam,
  calculateWeeksUntilExam,
  calculateRecommendedWeeklyHours,
  buildStatistics,
  isExamDateValid,
} from './statistics-service'
import type { DisciplineProgress } from '@/types/dashboard'

const mockDisciplines: DisciplineProgress[] = [
  {
    id: 'd1',
    name: 'A',
    order: 1,
    weight: 1,
    priority: 3,
    estimatedHours: 20,
    studiedHours: 10,
    percentCompleted: 50,
    status: 'in_progress',
  },
  {
    id: 'd2',
    name: 'B',
    order: 2,
    weight: 1,
    priority: 3,
    estimatedHours: 20,
    studiedHours: 20,
    percentCompleted: 100,
    status: 'completed',
  },
  {
    id: 'd3',
    name: 'C',
    order: 3,
    weight: 1,
    priority: 3,
    estimatedHours: 20,
    studiedHours: 0,
    percentCompleted: 0,
    status: 'not_started',
  },
]

describe('calculateSyllabusPercent', () => {
  it('calcula média do percentual do edital', () => {
    expect(calculateSyllabusPercent(mockDisciplines)).toBe(50)
  })

  it('retorna 0 para lista vazia', () => {
    expect(calculateSyllabusPercent([])).toBe(0)
  })
})

describe('calculateDisciplinePercent', () => {
  it('calcula percentual de disciplinas iniciadas', () => {
    expect(calculateDisciplinePercent(mockDisciplines)).toBe(67)
  })

  it('retorna 0 para lista vazia', () => {
    expect(calculateDisciplinePercent([])).toBe(0)
  })
})

describe('calculateCorrectRate', () => {
  it('calcula taxa de acerto corretamente', () => {
    expect(calculateCorrectRate(75, 25)).toBe(75)
  })

  it('retorna 0 quando não há questões', () => {
    expect(calculateCorrectRate(0, 0)).toBe(0)
  })

  it('calcula taxa parcial', () => {
    expect(calculateCorrectRate(1, 3)).toBe(25)
  })
})

describe('calculateRemainingHours', () => {
  it('calcula horas restantes', () => {
    expect(calculateRemainingHours(50, 100)).toBe(50)
  })

  it('não retorna negativo', () => {
    expect(calculateRemainingHours(120, 100)).toBe(0)
  })
})

describe('calculateDaysUntilExam', () => {
  it('calcula dias até a prova (11/10/2026)', () => {
    const now = new Date('2026-07-28T00:00:00Z')
    const days = calculateDaysUntilExam('2026-10-11', now)
    expect(days).toBe(75)
  })

  it('retorna 0 se a data já passou', () => {
    const now = new Date('2027-01-01T00:00:00Z')
    expect(calculateDaysUntilExam('2026-10-11', now)).toBe(0)
  })
})

describe('calculateWeeksUntilExam', () => {
  it('calcula semanas até a prova', () => {
    const now = new Date('2026-07-28T00:00:00Z')
    expect(calculateWeeksUntilExam('2026-10-11', now)).toBe(11)
  })
})

describe('calculateRecommendedWeeklyHours', () => {
  it('calcula horas semanais recomendadas', () => {
    expect(calculateRecommendedWeeklyHours(100, 10)).toBe(10)
  })

  it('retorna horas restantes se semanas <= 0', () => {
    expect(calculateRecommendedWeeklyHours(50, 0)).toBe(50)
  })
})

describe('buildStatistics', () => {
  it('agrega estatísticas completas', () => {
    const stats = buildStatistics(mockDisciplines, 80, 20, 5, 3)
    expect(stats.hoursStudied).toBe(30)
    expect(stats.hoursPlanned).toBe(60)
    expect(stats.syllabusPercent).toBe(50)
    expect(stats.disciplinePercent).toBe(67)
    expect(stats.correctAnswers).toBe(80)
    expect(stats.wrongAnswers).toBe(20)
    expect(stats.averageScore).toBe(80)
    expect(stats.pendingReviews).toBe(5)
    expect(stats.simulations).toBe(3)
  })
})

describe('isExamDateValid', () => {
  it('retorna true para data válida', () => {
    expect(isExamDateValid('2026-10-11')).toBe(true)
  })

  it('retorna false para data inválida', () => {
    expect(isExamDateValid('invalid')).toBe(false)
  })
})
