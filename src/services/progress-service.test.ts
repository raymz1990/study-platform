/**
 * Tests — progress-service.ts
 *
 * Cobertura: streak, metas semanais, evolution, histórico, agregação.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  calculateStreak,
  calculateWeeklyGoal,
  generateEvolution,
  buildSessionHistory,
  getProgressData,
  getStudyTimeByDiscipline,
  isWeeklyGoalReached,
} from '@/services/progress-service'
import type { StudySession } from '@/types/progress'

const STORAGE_KEY = 'cap.study.sessions'

function mockLocalStorage() {
  const store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value }),
    removeItem: vi.fn((key: string) => { Reflect.deleteProperty(store, key) }),
    clear: vi.fn(() => { Object.keys(store).forEach((k) => Reflect.deleteProperty(store, k)) }),
  }
}

function createSession(overrides: Partial<StudySession> = {}): StudySession {
  return {
    id: `sess_${Date.now()}_${Math.random()}`,
    disciplineId: 'disc_portugues',
    disciplineName: 'Língua Portuguesa',
    topicId: 'chap_01',
    topicName: 'Morfologia',
    objective: 'Estudo',
    startTime: new Date().toISOString(),
    endTime: new Date().toISOString(),
    durationMinutes: 30,
    status: 'completed',
    ...overrides,
  }
}

beforeEach(() => {
  const ls = mockLocalStorage()
  Object.defineProperty(global, 'localStorage', { value: ls, writable: true })
})

describe('progress-service', () => {
  describe('calculateStreak', () => {
    it('retorna zero quando não há sessões', () => {
      const streak = calculateStreak([])
      expect(streak.current).toBe(0)
      expect(streak.longest).toBe(0)
      expect(streak.lastStudyDate).toBeNull()
    })

    it('calcula streak de 1 dia', () => {
      const today = new Date().toISOString().split('T')[0]
      const sessions = [createSession({ startTime: `${today}T10:00:00Z`, durationMinutes: 30 })]
      const streak = calculateStreak(sessions)
      expect(streak.current).toBe(1)
      expect(streak.longest).toBe(1)
      expect(streak.lastStudyDate).toBe(today)
    })

    it('calcula streak de dias consecutivos', () => {
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

      const sessions = [
        createSession({ startTime: today.toISOString(), durationMinutes: 30 }),
        createSession({ startTime: yesterday.toISOString(), durationMinutes: 45 }),
      ]
      const streak = calculateStreak(sessions)
      expect(streak.current).toBe(2)
      expect(streak.longest).toBe(2)
    })

    it('quebra streak quando há gap maior que 1 dia', () => {
      const today = new Date()
      const threeDaysAgo = new Date(today)
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)

      const sessions = [
        createSession({ startTime: today.toISOString() }),
        createSession({ startTime: threeDaysAgo.toISOString() }),
      ]
      const streak = calculateStreak(sessions)
      expect(streak.current).toBe(1) // Quebrou, conta apenas hoje
      expect(streak.longest).toBe(1)
    })

    it('não conta sessões com duração zero', () => {
      const today = new Date().toISOString().split('T')[0]
      const sessions = [createSession({ startTime: `${today}T10:00:00Z`, durationMinutes: 0 })]
      const streak = calculateStreak(sessions)
      expect(streak.current).toBe(0)
    })

    it('calcula recorde histórico correto', () => {
      const today = new Date()
      const sessions: StudySession[] = []

      // Cria 3 dias consecutivos há uma semana
      for (let i = 3; i >= 1; i--) {
        const d = new Date(today)
        d.setDate(d.getDate() - (7 + i))
        sessions.push(createSession({ startTime: d.toISOString() }))
      }

      // Hoje
      sessions.push(createSession({ startTime: today.toISOString() }))

      const streak = calculateStreak(sessions)
      expect(streak.longest).toBe(3)
      expect(streak.current).toBe(1)
    })
  })

  describe('calculateWeeklyGoal', () => {
    it('retorna meta com target de 810 minutos (13.5h)', () => {
      const goal = calculateWeeklyGoal()
      expect(goal.targetMinutes).toBe(810)
      expect(goal.completedMinutes).toBe(0)
    })

    it('calcula minutos completados da semana atual', () => {
      const today = new Date()
      const session = createSession({ startTime: today.toISOString(), durationMinutes: 60 })

      const snapshot = { version: 1, sessions: [session], lastUpdated: new Date().toISOString() }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot))

      const goal = calculateWeeklyGoal(today)
      expect(goal.completedMinutes).toBe(60)
    })
  })

  describe('generateEvolution', () => {
    it('retorna array vazio sem sessões', () => {
      const evolution = generateEvolution([])
      expect(evolution).toHaveLength(0)
    })

    it('agraga sessões por data', () => {
      const today = new Date().toISOString().split('T')[0]
      const sessions = [
        createSession({ startTime: `${today}T10:00:00Z`, durationMinutes: 60 }),
        createSession({ startTime: `${today}T14:00:00Z`, durationMinutes: 30 }),
      ]
      const evolution = generateEvolution(sessions)
      expect(evolution).toHaveLength(1)
      const first = evolution[0]
      if (first) {
        expect(first.hoursStudied).toBe(1.5)
      }
    })

    it('ignora sessões não completadas', () => {
      const today = new Date().toISOString().split('T')[0]
      const sessions = [
        createSession({ startTime: `${today}T10:00:00Z`, status: 'interrupted', durationMinutes: 0 }),
      ]
      const evolution = generateEvolution(sessions)
      expect(evolution).toHaveLength(0)
    })
  })

  describe('buildSessionHistory', () => {
    it('retorna histórico ordenado por data decrescente', () => {
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

      const sessions = [
        createSession({ startTime: yesterday.toISOString(), objective: 'Ontem' }),
        createSession({ startTime: today.toISOString(), objective: 'Hoje' }),
      ]
      const history = buildSessionHistory(sessions)
      expect(history).toHaveLength(2)
      const first = history[0]
      const second = history[1]
      if (first && second) {
        expect(first.activity).toBe('Hoje')
        expect(second.activity).toBe('Ontem')
      }
    })

    it('ignora sessões não completadas', () => {
      const sessions = [
        createSession({ status: 'interrupted', durationMinutes: 0 }),
      ]
      const history = buildSessionHistory(sessions)
      expect(history).toHaveLength(0)
    })
  })

  describe('getProgressData', () => {
    it('retorna dados iniciais quando não há sessões', () => {
      const data = getProgressData()
      expect(data.totalSessions).toBe(0)
      expect(data.totalMinutesStudied).toBe(0)
      expect(data.averageSessionMinutes).toBe(0)
      expect(data.streak.current).toBe(0)
      expect(data.evolution).toHaveLength(0)
    })

    it('agrega dados corretamente com sessões', () => {
      const today = new Date()
      const snapshot = {
        version: 1,
        sessions: [
          createSession({ startTime: today.toISOString(), durationMinutes: 60 }),
          createSession({ startTime: today.toISOString(), durationMinutes: 30 }),
        ],
        lastUpdated: today.toISOString(),
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot))

      const data = getProgressData()
      expect(data.totalSessions).toBe(2)
      expect(data.totalMinutesStudied).toBe(90)
      expect(data.averageSessionMinutes).toBe(45)
      expect(data.streak.current).toBeGreaterThanOrEqual(1)
    })
  })

  describe('getStudyTimeByDiscipline', () => {
    it('agrupa tempo por disciplina', () => {
      const today = new Date()
      const snapshot = {
        version: 1,
        sessions: [
          createSession({ disciplineId: 'disc_portugues', durationMinutes: 60 }),
          createSession({ disciplineId: 'disc_portugues', durationMinutes: 30 }),
          createSession({ disciplineId: 'disc_matematica', durationMinutes: 45 }),
        ],
        lastUpdated: today.toISOString(),
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot))

      const byDiscipline = getStudyTimeByDiscipline()
      expect(byDiscipline['disc_portugues']).toBe(90)
      expect(byDiscipline['disc_matematica']).toBe(45)
    })

    it('retorna objeto vazio sem sessões', () => {
      const result = getStudyTimeByDiscipline()
      expect(Object.keys(result)).toHaveLength(0)
    })
  })

  describe('isWeeklyGoalReached', () => {
    it('retorna false quando meta não foi atingida', () => {
      expect(isWeeklyGoalReached()).toBe(false)
    })

    it('retorna true quando meta foi atingida', () => {
      const today = new Date()
      const snapshot = {
        version: 1,
        sessions: [
          createSession({ startTime: today.toISOString(), durationMinutes: 900 }),
        ],
        lastUpdated: today.toISOString(),
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot))

      expect(isWeeklyGoalReached(today)).toBe(true)
    })
  })
})
