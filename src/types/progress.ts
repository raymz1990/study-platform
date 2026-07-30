/**
 * Tipos do Progress Tracker — Concurso AI Platform.
 *
 * Fonte única da verdade: DATA_MODEL.md (Progresso, Histórico, Estatísticas)
 */

import type { StudyStreak, EvolutionPoint } from '@/types/dashboard'

// ---------------------------------------------------------------------------
// Sessão de Estudo
// ---------------------------------------------------------------------------

export type SessionStatus = 'running' | 'paused' | 'completed' | 'interrupted'

export interface StudySession {
  id: string
  disciplineId: string
  disciplineName: string
  topicId: string
  topicName: string
  objective: string
  startTime: string // ISO 8601
  endTime: string | null // ISO 8601
  durationMinutes: number // tempo efetivo (descontando pausas)
  status: SessionStatus
  notes?: string
}

// ---------------------------------------------------------------------------
// Meta Semanal
// ---------------------------------------------------------------------------

export interface WeeklyGoal {
  weekStartDate: string // ISO 8601 (domingo)
  targetMinutes: number // ex: 810 = 13.5h
  completedMinutes: number
}

// ---------------------------------------------------------------------------
// Histórico de Atividades
// ---------------------------------------------------------------------------

export interface SessionHistoryItem {
  date: string // ISO 8601
  activity: string
  disciplineName: string
  durationMinutes: number
  result: 'completed' | 'interrupted' | 'paused'
}

// ---------------------------------------------------------------------------
// Snapshot de Persistência (schema v1)
// ---------------------------------------------------------------------------

export interface SessionSnapshot {
  version: number
  sessions: StudySession[]
  lastUpdated: string // ISO 8601
}

// ---------------------------------------------------------------------------
// Dados Agregados de Progresso
// ---------------------------------------------------------------------------

export interface ProgressData {
  streak: StudyStreak
  weeklyGoal: WeeklyGoal
  totalMinutesStudied: number
  totalSessions: number
  averageSessionMinutes: number
  evolution: EvolutionPoint[]
  recentSessions: StudySession[]
}

// ---------------------------------------------------------------------------
// Configuração de Sessão
// ---------------------------------------------------------------------------

export interface SessionConfig {
  defaultDurationMinutes: number
  weeklyTargetMinutes: number
}
