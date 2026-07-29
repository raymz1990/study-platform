import { describe, it, expect } from 'vitest'
import { getDashboardData, getExamConfig } from './dashboard-service'

describe('dashboard-service', () => {
  it('getExamConfig retorna configuração do concurso', () => {
    const config = getExamConfig()
    expect(config.examDate).toBe('2026-10-11')
    expect(config.weeklyHours).toBe(13.5)
    expect(config.totalWeeks).toBe(11)
    expect(config.disciplinesCount).toBe(12)
  })

  it('getDashboardData retorna estrutura completa', () => {
    const data = getDashboardData()

    expect(data.examDate).toBe('2026-10-11')
    expect(data.dailyPlan).toBeDefined()
    expect(data.dailyPlan.tasks.length).toBeGreaterThan(0)
    expect(data.reviewQueue).toBeDefined()
    expect(data.reviewQueue.length).toBeGreaterThan(0)
    expect(data.disciplineProgress).toBeDefined()
    expect(data.disciplineProgress.length).toBe(12)
    expect(data.statistics).toBeDefined()
    expect(data.evolution).toBeDefined()
    expect(data.evolution.length).toBeGreaterThan(0)
    expect(data.streak).toBeDefined()
  })

  it('estatísticas são calculadas corretamente a partir das disciplinas', () => {
    const data = getDashboardData()
    const totalStudied = data.disciplineProgress.reduce((s, d) => s + d.studiedHours, 0)
    expect(data.statistics.hoursStudied).toBe(totalStudied)
  })

  it('todas as disciplinas possuem IDs únicos', () => {
    const data = getDashboardData()
    const ids = data.disciplineProgress.map((d) => d.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('revisões pendentes não estão marcadas como concluídas', () => {
    const data = getDashboardData()
    const pending = data.reviewQueue.filter((r) => !r.completed)
    expect(pending.length).toBeGreaterThan(0)
  })

  it('plano do dia possui data atual', () => {
    const data = getDashboardData()
    const today = new Date().toISOString().split('T')[0]
    expect(data.dailyPlan.date).toBe(today)
  })
})
