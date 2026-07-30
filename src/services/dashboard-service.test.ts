import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getDashboardData, getExamConfig } from './dashboard-service'

describe('dashboard-service', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    vi.setSystemTime(new Date(2026, 6, 29)) // 2026-07-29 — quarta-feira, semana 1
    localStorage.clear()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('getExamConfig retorna configuração do concurso', () => {
    const config = getExamConfig()
    expect(config.examDate).toBe('2026-10-11')
    expect(config.weeklyHours).toBe(13.5)
    expect(config.totalWeeks).toBe(11)
    expect(config.disciplinesCount).toBe(12)
  })

  it('getDashboardData retorna estrutura completa sem mocks', () => {
    const data = getDashboardData()

    expect(data.examDate).toBe('2026-10-11')
    expect(data.dailyPlan).toBeDefined()
    expect(data.dailyPlan.tasks.length).toBeGreaterThan(0)
    expect(data.reviewQueue).toBeDefined()
    expect(data.disciplineProgress).toBeDefined()
    expect(data.disciplineProgress.length).toBe(12)
    expect(data.statistics).toBeDefined()
    expect(data.evolution).toBeDefined()
    expect(data.evolution.length).toBe(0)
    expect(data.streak).toBeNull()
  })

  it('estatísticas são calculadas corretamente a partir das disciplinas', () => {
    const data = getDashboardData()
    const totalStudied = data.disciplineProgress.reduce((s, d) => s + d.studiedHours, 0)
    expect(data.statistics.hoursStudied).toBe(totalStudied)
  })

  it('taxa de acerto é 0 sem dados reais de questões', () => {
    const data = getDashboardData()
    expect(data.statistics.averageScore).toBe(0)
    expect(data.statistics.correctAnswers).toBe(0)
    expect(data.statistics.wrongAnswers).toBe(0)
  })

  it('todas as disciplinas possuem IDs únicos', () => {
    const data = getDashboardData()
    const ids = data.disciplineProgress.map((d) => d.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('plano do dia possui data atual', () => {
    const data = getDashboardData()
    expect(data.dailyPlan.date).toBe('2026-07-29')
  })

  it('disciplinas com progresso refletem no dashboard', () => {
    const progress = {
      completedTasks: [
        {
          taskId: 'task_s01_1_0',
          completedDate: '2026-07-29',
          disciplineId: 'disc_portugues',
          disciplineName: 'Língua Portuguesa',
          topicId: 'chap_morfologia',
          topicName: 'Morfologia',
          durationMinutes: 90,
        },
      ],
      hoursLogged: {},
      lastUpdated: '2026-07-29T12:00:00.000Z',
    }
    localStorage.setItem('cap.planner.progress', JSON.stringify(progress))

    const data = getDashboardData()
    const portugues = data.disciplineProgress.find((d) => d.id === 'disc_portugues')
    expect(portugues).toBeDefined()
    expect(portugues?.studiedHours).toBe(1.5)
    expect(portugues?.percentCompleted).toBeGreaterThan(0)
    expect(portugues?.status).toBe('in_progress')
  })
})
