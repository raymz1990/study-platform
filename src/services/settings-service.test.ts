/**
 * Tests — settings-service.ts
 *
 * Cobertura: carregar, salvar, validar, restaurar padrões.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  loadSettings,
  saveSettings,
  resetToDefaults,
  validateSettings,
  getExamDate,
  getWeeklyTargetMinutes,
  DEFAULT_SETTINGS,
} from '@/services/settings-service'

const STORAGE_KEY = 'cap.settings'

function mockLocalStorage() {
  const store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value }),
    removeItem: vi.fn((key: string) => { Reflect.deleteProperty(store, key) }),
  }
}

beforeEach(() => {
  const ls = mockLocalStorage()
  Object.defineProperty(global, 'localStorage', { value: ls, writable: true })
})

describe('settings-service', () => {
  describe('loadSettings', () => {
    it('retorna defaults quando não há nada salvo', () => {
      const settings = loadSettings()
      expect(settings.examDate).toBe(DEFAULT_SETTINGS.examDate)
      expect(settings.weeklyTargetMinutes).toBe(DEFAULT_SETTINGS.weeklyTargetMinutes)
    })

    it('carrega configurações salvas', () => {
      const custom = { ...DEFAULT_SETTINGS, weeklyTargetMinutes: 600 }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(custom))

      const settings = loadSettings()
      expect(settings.weeklyTargetMinutes).toBe(600)
    })

    it('ignora storage corrompido e retorna defaults', () => {
      localStorage.setItem(STORAGE_KEY, 'not-json')
      const settings = loadSettings()
      expect(settings.examDate).toBe(DEFAULT_SETTINGS.examDate)
    })
  })

  describe('saveSettings', () => {
    it('salva configurações válidas', () => {
      const errors = saveSettings({ weeklyTargetMinutes: 600 })
      expect(errors).toHaveLength(0)

      const stored = loadSettings()
      expect(stored.weeklyTargetMinutes).toBe(600)
    })

    it('rejeita meta semanal inválida', () => {
      const errors = saveSettings({ weeklyTargetMinutes: 30 })
      expect(errors.length).toBeGreaterThan(0)
      expect(errors[0]?.field).toBe('weeklyTargetMinutes')
    })

    it('rejeita data da prova no passado', () => {
      const errors = saveSettings({ examDate: '2020-01-01' })
      expect(errors.length).toBeGreaterThan(0)
      expect(errors[0]?.field).toBe('examDate')
    })

    it('rejeita data da prova inválida', () => {
      const errors = saveSettings({ examDate: 'invalid' })
      expect(errors.length).toBeGreaterThan(0)
      expect(errors[0]?.field).toBe('examDate')
    })

    it('emite evento settings-changed ao salvar', () => {
      const listener = vi.fn()
      window.addEventListener('settings-changed', listener)

      saveSettings({ studyGoal: 'Novo objetivo' })

      expect(listener).toHaveBeenCalled()
      window.removeEventListener('settings-changed', listener)
    })
  })

  describe('resetToDefaults', () => {
    it('restaura valores oficiais', () => {
      saveSettings({ weeklyTargetMinutes: 600 })
      resetToDefaults()

      const settings = loadSettings()
      expect(settings.weeklyTargetMinutes).toBe(DEFAULT_SETTINGS.weeklyTargetMinutes)
    })
  })

  describe('validateSettings', () => {
    it('aceita valores válidos', () => {
      const errors = validateSettings({ weeklyTargetMinutes: 480 })
      expect(errors).toHaveLength(0)
    })

    it('detecta múltiplos erros', () => {
      const errors = validateSettings({
        weeklyTargetMinutes: 30,
        examDate: '2020-01-01',
      })
      expect(errors.length).toBe(2)
    })
  })

  describe('getters', () => {
    it('getExamDate retorna data salva', () => {
      expect(getExamDate()).toBe(DEFAULT_SETTINGS.examDate)
    })

    it('getWeeklyTargetMinutes retorna meta salva', () => {
      expect(getWeeklyTargetMinutes()).toBe(DEFAULT_SETTINGS.weeklyTargetMinutes)
    })
  })
})
