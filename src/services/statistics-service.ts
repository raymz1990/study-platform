/**
 * Statistics Service — Concurso AI Platform.
 *
 * Responsabilidade: cálculos estatísticos puros (sem side effects).
 * Apenas funções utilitárias tipadas.
 */

import type { DisciplineProgress, Statistics } from '@/types/dashboard'

/**
 * Calcula o percentual geral do edital a partir do progresso das disciplinas.
 */
export function calculateSyllabusPercent(disciplines: DisciplineProgress[]): number {
  if (disciplines.length === 0) return 0
  const total = disciplines.reduce((sum, d) => sum + d.percentCompleted, 0)
  return Math.round(total / disciplines.length)
}

/**
 * Calcula o percentual de disciplinas iniciadas.
 */
export function calculateDisciplinePercent(disciplines: DisciplineProgress[]): number {
  if (disciplines.length === 0) return 0
  const started = disciplines.filter((d) => d.studiedHours > 0).length
  return Math.round((started / disciplines.length) * 100)
}

/**
 * Calcula a taxa de acerto a partir de acertos e erros.
 */
export function calculateCorrectRate(correct: number, wrong: number): number {
  const total = correct + wrong
  if (total === 0) return 0
  return Math.round((correct / total) * 100)
}

/**
 * Calcula horas restantes até a prova com base no cronograma.
 */
export function calculateRemainingHours(studied: number, planned: number): number {
  return Math.max(0, planned - studied)
}

/**
 * Calcula dias restantes até a data da prova.
 */
export function calculateDaysUntilExam(examDate: string, now: Date = new Date()): number {
  const exam = new Date(examDate)
  const diffMs = exam.getTime() - now.getTime()
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)))
}

/**
 * Calcula semanas restantes até a prova.
 */
export function calculateWeeksUntilExam(examDate: string, now: Date = new Date()): number {
  const days = calculateDaysUntilExam(examDate, now)
  return Math.ceil(days / 7)
}

/**
 * Calcula horas semanais recomendadas com base no que falta.
 */
export function calculateRecommendedWeeklyHours(remainingHours: number, weeksLeft: number): number {
  if (weeksLeft <= 0) return remainingHours
  return Math.round((remainingHours / weeksLeft) * 10) / 10
}

/**
 * Agrega estatísticas completas a partir de disciplinas e configuração.
 */
export function buildStatistics(
  disciplines: DisciplineProgress[],
  correctAnswers: number,
  wrongAnswers: number,
  pendingReviews: number,
  simulations: number
): Statistics {
  const totalStudied = disciplines.reduce((sum, d) => sum + d.studiedHours, 0)
  const totalPlanned = disciplines.reduce((sum, d) => sum + d.estimatedHours, 0)
  const syllabusPercent = calculateSyllabusPercent(disciplines)
  const disciplinePercent = calculateDisciplinePercent(disciplines)
  const averageScore = calculateCorrectRate(correctAnswers, wrongAnswers)

  return {
    hoursStudied: totalStudied,
    hoursPlanned: totalPlanned,
    correctAnswers,
    wrongAnswers,
    syllabusPercent,
    disciplinePercent,
    pendingReviews,
    simulations,
    averageScore,
    averageTime: Math.round(
      totalStudied / Math.max(1, disciplines.filter((d) => d.studiedHours > 0).length)
    ),
  }
}

/**
 * Verifica se a data da prova é válida e futura.
 */
export function isExamDateValid(examDate: string): boolean {
  const d = new Date(examDate)
  return !isNaN(d.getTime())
}
