/**
 * Tipos de Configurações — Concurso AI Platform.
 *
 * Fonte única da verdade: DATA_MODEL.md (Configuração)
 */

export type ThemePreference = 'light' | 'dark' | 'system'

export type WeekdayKey = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

export interface DailyStudySchedule {
  monday: number
  tuesday: number
  wednesday: number
  thursday: number
  friday: number
  saturday: number
  sunday: number
}

export interface UserSettings {
  theme: ThemePreference
  dailyStudyMinutes: DailyStudySchedule
  weeklyTargetMinutes: number
  studyGoal: string
  examDate: string // ISO 8601
  notificationsEnabled: boolean
  version: number
}

export interface SettingsValidationError {
  field: string
  message: string
}
