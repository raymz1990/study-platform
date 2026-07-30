/**
 * Settings Service — Concurso AI Platform.
 *
 * Responsabilidade: CRUD de configurações do usuário com persistência em localStorage.
 * Validação rigorosa. Emite evento `settings-changed` para sincronização entre componentes.
 */

import type { UserSettings, SettingsValidationError, WeekdayKey } from '@/types/settings'
import defaultSettingsRaw from '../../config/defaults.json'

const STORAGE_KEY = 'cap.settings'

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------

const DEFAULT_SETTINGS: UserSettings = defaultSettingsRaw as UserSettings

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isValidISODate(date: string): boolean {
  const d = new Date(date)
  return !isNaN(d.getTime()) && /^\d{4}-\d{2}-\d{2}$/.test(date)
}

function isFutureDate(date: string): boolean {
  const d = new Date(date)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return d.getTime() >= now.getTime()
}

// ---------------------------------------------------------------------------
// Validação
// ---------------------------------------------------------------------------

export function validateSettings(settings: Partial<UserSettings>): SettingsValidationError[] {
  const errors: SettingsValidationError[] = []

  if (settings.weeklyTargetMinutes !== undefined) {
    if (settings.weeklyTargetMinutes < 60 || settings.weeklyTargetMinutes > 16 * 60) {
      errors.push({
        field: 'weeklyTargetMinutes',
        message: 'Horas semanais devem estar entre 1h e 16h.',
      })
    }
  }

  if (settings.examDate !== undefined) {
    if (!isValidISODate(settings.examDate)) {
      errors.push({ field: 'examDate', message: 'Data da prova inválida.' })
    } else if (!isFutureDate(settings.examDate)) {
      errors.push({ field: 'examDate', message: 'A data da prova deve ser futura.' })
    }
  }

  if (settings.dailyStudyMinutes !== undefined) {
    const days: WeekdayKey[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    for (const day of days) {
      const minutes = settings.dailyStudyMinutes[day]
      if (typeof minutes !== 'number' || minutes < 0 || minutes > 16 * 60) {
        errors.push({
          field: `dailyStudyMinutes.${day}`,
          message: `Tempo de estudo em ${day} deve estar entre 0 e 16 horas.`,
        })
      }
    }
  }

  if (settings.studyGoal !== undefined && settings.studyGoal.trim().length > 500) {
    errors.push({ field: 'studyGoal', message: 'Objetivo deve ter no máximo 500 caracteres.' })
  }

  return errors
}

// ---------------------------------------------------------------------------
// Persistência
// ---------------------------------------------------------------------------

function emitSettingsChanged(): void {
  window.dispatchEvent(new CustomEvent('settings-changed'))
}

export function loadSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_SETTINGS }

    const parsed = JSON.parse(raw) as Partial<UserSettings>

    // Merge com defaults para garantir campos completos
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      dailyStudyMinutes: {
        ...DEFAULT_SETTINGS.dailyStudyMinutes,
        ...parsed.dailyStudyMinutes,
      },
    }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

export function saveSettings(settings: Partial<UserSettings>): SettingsValidationError[] {
  const errors = validateSettings(settings)
  if (errors.length > 0) return errors

  const current = loadSettings()
  const merged: UserSettings = {
    ...current,
    ...settings,
    dailyStudyMinutes: {
      ...current.dailyStudyMinutes,
      ...settings.dailyStudyMinutes,
    },
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
  emitSettingsChanged()
  return []
}

export function resetToDefaults(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS))
  emitSettingsChanged()
}

// ---------------------------------------------------------------------------
// Getters individuais (conveniência)
// ---------------------------------------------------------------------------

export function getExamDate(): string {
  return loadSettings().examDate
}

export function getWeeklyTargetMinutes(): number {
  return loadSettings().weeklyTargetMinutes
}

export function getDailyStudyMinutes(day: WeekdayKey): number {
  return loadSettings().dailyStudyMinutes[day]
}

export function getStudyGoal(): string {
  return loadSettings().studyGoal
}

// ---------------------------------------------------------------------------
// Export defaults para testes
// ---------------------------------------------------------------------------

export { DEFAULT_SETTINGS }
