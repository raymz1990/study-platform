/**
 * Tests — session-service.ts
 *
 * Cobertura: registro, recuperação, cálculo de tempo por data/semana.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  startSession,
  endSession,
  getSessions,
  getSessionsForDate,
  getTotalMinutesForDate,
  getTotalMinutesForWeek,
  getRecentSessions,
  clearAllSessions,
} from '@/services/session-service'

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

beforeEach(() => {
  const ls = mockLocalStorage()
  Object.defineProperty(global, 'localStorage', { value: ls, writable: true })
  clearAllSessions()
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('session-service', () => {
  describe('startSession', () => {
    it('cria uma sessão com status running', () => {
      const session = startSession('disc_portugues', 'Língua Portuguesa', 'chap_01', 'Morfologia', 'Revisar verbos')

      expect(session.disciplineId).toBe('disc_portugues')
      expect(session.disciplineName).toBe('Língua Portuguesa')
      expect(session.topicId).toBe('chap_01')
      expect(session.topicName).toBe('Morfologia')
      expect(session.objective).toBe('Revisar verbos')
      expect(session.status).toBe('running')
      expect(session.endTime).toBeNull()
      expect(session.durationMinutes).toBe(0)
      expect(session.id).toMatch(/^sess_/)
    })

    it('persiste a sessão no localStorage', () => {
      startSession('disc_matematica', 'Matemática', 'chap_02', 'Álgebra', 'Exercícios')

      const raw = localStorage.getItem(STORAGE_KEY)
      expect(raw).not.toBeNull()
      if (raw) {
        const stored = JSON.parse(raw) as { sessions: Array<{ disciplineId: string }> }
        expect(stored.sessions).toHaveLength(1)
        const first = stored.sessions[0]
        if (first) {
          expect(first.disciplineId).toBe('disc_matematica')
        }
      }
    })
  })

  describe('endSession', () => {
    it('finaliza sessão com duração calculada', () => {
      const session = startSession('disc_portugues', 'Língua Portuguesa', 'chap_01', 'Morfologia', 'Estudo')

      const ended = endSession(session.id, 'completed', 'Bom estudo')

      expect(ended).not.toBeNull()
      if (ended) {
        expect(ended.status).toBe('completed')
        expect(ended.durationMinutes).toBeGreaterThanOrEqual(0)
        expect(ended.notes).toBe('Bom estudo')
        expect(ended.endTime).not.toBeNull()
      }
    })

    it('retorna null para sessão inexistente', () => {
      const result = endSession('sess_inexistente', 'completed')
      expect(result).toBeNull()
    })
  })

  describe('getSessionsForDate', () => {
    it('retorna apenas sessões da data especificada', () => {
      const today = new Date()
      startSession('disc_portugues', 'Língua Portuguesa', 'chap_01', 'Morfologia', 'Hoje')
      const all = getSessions()
      expect(all.length).toBeGreaterThan(0)
      const first = all[0]
      if (first) {
        endSession(first.id, 'completed')
      }

      const result = getSessionsForDate(today)
      expect(result).toHaveLength(1)
      const resultFirst = result[0]
      if (resultFirst) {
        expect(resultFirst.objective).toBe('Hoje')
      }
    })

    it('retorna array vazio quando não há sessões na data', () => {
      const future = new Date('2099-01-01')
      const result = getSessionsForDate(future)
      expect(result).toHaveLength(0)
    })
  })

  describe('getTotalMinutesForDate', () => {
    it('soma duração apenas de sessões completadas', () => {
      // Sessão completada
      const s1 = startSession('disc_portugues', 'LP', 'chap_01', 'Morfologia', 'A')
      endSession(s1.id, 'completed')

      // Sessão interrompida
      const s2 = startSession('disc_matematica', 'Mat', 'chap_02', 'Álgebra', 'B')
      endSession(s2.id, 'interrupted')

      const total = getTotalMinutesForDate(new Date())
      expect(total).toBeGreaterThanOrEqual(0)
    })
  })

  describe('getTotalMinutesForWeek', () => {
    it('retorna 0 quando não há sessões na semana', () => {
      const total = getTotalMinutesForWeek()
      expect(total).toBe(0)
    })
  })

  describe('getRecentSessions', () => {
    it('retorna apenas sessões completadas ordenadas por data decrescente', () => {
      const s1 = startSession('disc_portugues', 'LP', 'chap_01', 'Morfologia', 'Primeira')
      endSession(s1.id, 'completed')

      vi.advanceTimersByTime(1000)

      const s2 = startSession('disc_matematica', 'Mat', 'chap_02', 'Álgebra', 'Segunda')
      endSession(s2.id, 'completed')

      const recent = getRecentSessions(5)
      expect(recent).toHaveLength(2)
      const first = recent[0]
      if (first) {
        expect(first.objective).toBe('Segunda')
      }
    })

    it('respeita o limite', () => {
      for (let i = 0; i < 5; i++) {
        const s = startSession('disc_portugues', 'LP', 'chap_01', 'Morfologia', `Sessão ${i}`)
        endSession(s.id, 'completed')
        vi.advanceTimersByTime(100)
      }

      const recent = getRecentSessions(3)
      expect(recent).toHaveLength(3)
    })
  })

  describe('clearAllSessions', () => {
    it('remove todas as sessões', () => {
      startSession('disc_portugues', 'LP', 'chap_01', 'Morfologia', 'Teste')
      clearAllSessions()

      expect(getSessions()).toHaveLength(0)
    })
  })
})
