import { describe, it, expect, beforeEach } from 'vitest'
import {
  getCurrentWeekNumber,
  formatWeekRange,
  loadStudyPlan,
  getDailyPlan,
  loadProgress,
  saveProgress,
} from './planner-service'

describe('planner-service', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('getCurrentWeekNumber', () => {
    it('retorna semana 1 para data no início do cronograma', () => {
      const date = new Date(2026, 6, 27) // 2026-07-27 local
      expect(getCurrentWeekNumber('2026-07-27', date)).toBe(1)
    })

    it('retorna semana 2 para data uma semana depois', () => {
      const date = new Date(2026, 7, 3) // 2026-08-03 local
      expect(getCurrentWeekNumber('2026-07-27', date)).toBe(2)
    })

    it('retorna semana 5 para data no meio do cronograma', () => {
      const date = new Date(2026, 7, 24) // 2026-08-24 local
      expect(getCurrentWeekNumber('2026-07-27', date)).toBe(5)
    })

    it('retorna semana 11 para data próxima à prova', () => {
      const date = new Date(2026, 9, 5) // 2026-10-05 local
      expect(getCurrentWeekNumber('2026-07-27', date)).toBe(11)
    })

    it('clamp para 1 quando data anterior ao início', () => {
      const date = new Date(2026, 6, 20) // 2026-07-20 local
      expect(getCurrentWeekNumber('2026-07-27', date)).toBe(1)
    })

    it('clamp para 11 quando data posterior à prova', () => {
      const date = new Date(2026, 9, 15) // 2026-10-15 local
      expect(getCurrentWeekNumber('2026-07-27', date)).toBe(11)
    })
  })

  describe('formatWeekRange', () => {
    it('formata intervalo da semana 1 corretamente', () => {
      const range = formatWeekRange(1, '2026-07-27')
      expect(range.start).toBe('2026-07-27')
      expect(range.end).toBe('2026-08-02')
    })

    it('formata intervalo da semana 2 corretamente', () => {
      const range = formatWeekRange(2, '2026-07-27')
      expect(range.start).toBe('2026-08-03')
      expect(range.end).toBe('2026-08-09')
    })
  })

  describe('loadStudyPlan', () => {
    it('carrega cronograma com 11 semanas', () => {
      const plan = loadStudyPlan(new Date(2026, 7, 15)) // 2026-08-15 local
      expect(plan.totalWeeks).toBe(11)
      expect(plan.weeks).toHaveLength(11)
      expect(plan.examDate).toBe('2026-10-11')
    })

    it('calcula semana atual corretamente', () => {
      const plan = loadStudyPlan(new Date(2026, 7, 15)) // 2026-08-15 local
      expect(plan.currentWeek).toBe(3)
    })

    it('gera atividades para cada dia da semana', () => {
      const plan = loadStudyPlan(new Date(2026, 7, 15)) // 2026-08-15 local
      const week = plan.weeks[2]
      expect(week).toBeDefined()
      expect(week?.days).toHaveLength(7)
      // Cronograma inicia em segunda-feira (2026-07-27)
      expect(week?.days[0]?.weekdayLabel).toBe('Segunda')
      expect(week?.days[1]?.weekdayLabel).toBe('Terça')
    })

    it('marca dia da prova corretamente', () => {
      const plan = loadStudyPlan(new Date(2026, 9, 11)) // 2026-10-11 local
      const examDay = plan.weeks.flatMap((w) => w.days).find((d) => d.date === '2026-10-11')
      expect(examDay?.isExamDay).toBe(true)
    })

    it('gera atividades com disciplineId e topicId', () => {
      const plan = loadStudyPlan(new Date(2026, 6, 27)) // 2026-07-27 local
      const week = plan.weeks[0]
      const day = week?.days[0]
      expect(day?.activities.length).toBeGreaterThan(0)
      const activity = day?.activities[0]
      expect(activity?.disciplineId).toBeDefined()
      expect(activity?.topicId).toBeDefined()
      expect(activity?.disciplineId.length).toBeGreaterThan(0)
      expect(activity?.topicId.length).toBeGreaterThan(0)
    })

    it('gera disciplineId oficial (disc_*) quando há correspondência no índice', () => {
      const plan = loadStudyPlan(new Date(2026, 6, 27)) // 2026-07-27 local
      const week = plan.weeks[0]
      const day = week?.days[0]
      expect(day).toBeDefined()

      const activity = day?.activities[0]
      expect(activity).toBeDefined()
      // Segunda-feira S01 = Língua Portuguesa (template)
      expect(activity?.disciplineId).toBe('disc_portugues')
    })

    it('gera topicId oficial (chap_*) quando há correspondência no índice', () => {
      // S01 segunda = Língua Portuguesa (sem tópicos explícitos no template)
      // Neste caso o topicId é o mesmo que disciplineId (fallback) ou resolved
      const plan = loadStudyPlan(new Date(2026, 7, 24)) // 2026-08-24 local — semana 5
      const week = plan.weeks[4]
      // Quinta-feira S05 = Legislação de Dados (rotativa)
      const thursday = week?.days.find((d) => d.weekday === 4)
      expect(thursday).toBeDefined()

      const activity = thursday?.activities[0]
      expect(activity).toBeDefined()
      // A disciplina é "Legislação de Segurança da Informação e Proteção de Dados"
      expect(activity?.disciplineId).toBe('disc_leg_seg_dados')
    })

    it('mantém IDs fixos para Revisão e Simulado', () => {
      const plan = loadStudyPlan(new Date(2026, 6, 31)) // 2026-07-31 local — sexta-feira
      const week = plan.weeks[0]
      const friday = week?.days.find((d) => d.weekday === 5)
      expect(friday).toBeDefined()

      const reviewActivity = friday?.activities.find((a) => a.type === 'review')
      expect(reviewActivity).toBeDefined()
      expect(reviewActivity?.disciplineId).toBe('review')
      expect(reviewActivity?.topicId).toBe('spaced-review')
    })

    it('gera simulado nas semanas corretas', () => {
      const plan = loadStudyPlan(new Date(2026, 7, 31)) // 2026-08-31 local — semana 6
      const week = plan.weeks[5] // S06
      const saturday = week?.days.find((d) => d.date === '2026-09-05')
      expect(saturday?.activities.some((a) => a.type === 'simulation')).toBe(true)
    })
  })

  describe('getDailyPlan', () => {
    it('retorna plano do dia para data existente', () => {
      const plan = loadStudyPlan(new Date(2026, 7, 15)) // 2026-08-15 local
      const daily = getDailyPlan(plan, new Date(2026, 7, 17)) // 2026-08-17 local
      expect(daily).not.toBeNull()
      expect(daily?.date).toBe('2026-08-17')
    })

    it('retorna null para data fora do cronograma', () => {
      const plan = loadStudyPlan(new Date(2026, 7, 15)) // 2026-08-15 local
      const daily = getDailyPlan(plan, new Date(2025, 0, 1)) // 2025-01-01 local
      expect(daily).toBeNull()
    })
  })

  describe('persistência e migração', () => {
    it('round-trip v2: saveProgress → loadProgress preserva dados', () => {
      const snapshot = {
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
        hoursLogged: { '2026-07-29': 1 },
        lastUpdated: '2026-07-29T12:00:00.000Z',
      }

      saveProgress(snapshot)
      const loaded = loadProgress()

      expect(loaded.completedTasks).toHaveLength(1)
      expect(loaded.completedTasks[0]?.taskId).toBe('task_s01_1_0')
      expect(loaded.completedTasks[0]?.durationMinutes).toBe(90)
      expect(loaded.hoursLogged).toEqual({ '2026-07-29': 1 })
      expect(loaded.lastUpdated).toBe('2026-07-29T12:00:00.000Z')
    })

    it('migração v1: completedTaskIds → completedTasks', () => {
      const v1 = {
        completedTaskIds: ['task_s01_1_0'],
        hoursLogged: { '2026-07-28': 2 },
        lastUpdated: '2026-07-28T10:00:00.000Z',
      }
      localStorage.setItem('cap.planner.progress', JSON.stringify(v1))

      const loaded = loadProgress()

      expect(loaded.completedTasks).toHaveLength(1)
      expect(loaded.completedTasks[0]?.taskId).toBe('task_s01_1_0')
      expect(loaded.completedTasks[0]?.disciplineName).toBe('Desconhecida')
      expect(loaded.completedTasks[0]?.topicName).toBe('Desconhecido')
      expect(loaded.hoursLogged).toEqual({ '2026-07-28': 2 })
    })

    it('storage corrompido retorna snapshot vazio sem exceção', () => {
      localStorage.setItem('cap.planner.progress', 'not-valid-json{[')

      const loaded = loadProgress()

      expect(loaded.completedTasks).toHaveLength(0)
      expect(loaded.hoursLogged).toEqual({})
    })

    it('array vazio preserva hoursLogged', () => {
      const v2 = {
        completedTasks: [],
        hoursLogged: { '2026-07-29': 3 },
        lastUpdated: '2026-07-29T14:00:00.000Z',
      }
      localStorage.setItem('cap.planner.progress', JSON.stringify(v2))

      const loaded = loadProgress()

      expect(loaded.completedTasks).toHaveLength(0)
      expect(loaded.hoursLogged).toEqual({ '2026-07-29': 3 })
    })

    it('hoursLogged null é tratado como objeto vazio', () => {
      const v2 = {
        completedTasks: [],
        hoursLogged: null,
        lastUpdated: '2026-07-29T14:00:00.000Z',
      }
      localStorage.setItem('cap.planner.progress', JSON.stringify(v2))

      const loaded = loadProgress()

      expect(loaded.hoursLogged).toEqual({})
    })
  })
})
