/**
 * Session Service — Concurso AI Platform.
 *
 * Responsabilidade: registrar e recuperar sessões de estudo.
 * Persistência: localStorage (`cap.study.sessions`).
 * Schema versionado com migração segura.
 */

import type { StudySession, SessionSnapshot, SessionStatus } from '@/types/progress'
import { toISODate } from '@/utils/date'

// ---------------------------------------------------------------------------
// Constantes
// ---------------------------------------------------------------------------

const SESSIONS_KEY = 'cap.study.sessions'
const SCHEMA_VERSION = 1

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function generateSessionId(): string {
  return `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

function nowISO(): string {
  return new Date().toISOString()
}

function getStartOfWeek(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  d.setDate(d.getDate() - day)
  d.setHours(0, 0, 0, 0)
  return d
}

// ---------------------------------------------------------------------------
// Persistência
// ---------------------------------------------------------------------------

function loadSnapshot(): SessionSnapshot {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY)
    if (!raw) {
      return { version: SCHEMA_VERSION, sessions: [], lastUpdated: nowISO() }
    }
    const parsed = JSON.parse(raw) as unknown
    if (!isValidSnapshot(parsed)) {
      return { version: SCHEMA_VERSION, sessions: [], lastUpdated: nowISO() }
    }
    return parsed
  } catch {
    return { version: SCHEMA_VERSION, sessions: [], lastUpdated: nowISO() }
  }
}

function isValidSnapshot(value: unknown): value is SessionSnapshot {
  if (typeof value !== 'object' || value === null) return false
  const obj = value as Record<string, unknown>
  return (
    typeof obj.version === 'number' &&
    Array.isArray(obj.sessions) &&
    typeof obj.lastUpdated === 'string'
  )
}

function saveSnapshot(snapshot: SessionSnapshot): void {
  try {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify({ ...snapshot, lastUpdated: nowISO() }))
  } catch {
    // localStorage pode estar cheio ou desabilitado — ignora silenciosamente
  }
}

// ---------------------------------------------------------------------------
// API pública
// ---------------------------------------------------------------------------

export function startSession(
  disciplineId: string,
  disciplineName: string,
  topicId: string,
  topicName: string,
  objective: string
): StudySession {
  const session: StudySession = {
    id: generateSessionId(),
    disciplineId,
    disciplineName,
    topicId,
    topicName,
    objective,
    startTime: nowISO(),
    endTime: null,
    durationMinutes: 0,
    status: 'running',
  }

  const snapshot = loadSnapshot()
  snapshot.sessions.push(session)
  saveSnapshot(snapshot)

  return session
}

export function endSession(
  sessionId: string,
  status: Extract<SessionStatus, 'completed' | 'interrupted'>,
  notes?: string
): StudySession | null {
  const snapshot = loadSnapshot()
  const session = snapshot.sessions.find((s) => s.id === sessionId)
  if (!session) return null

  session.endTime = nowISO()
  session.status = status
  if (notes) session.notes = notes

  // Calcula duração efetiva em minutos
  const start = new Date(session.startTime).getTime()
  const end = new Date(session.endTime).getTime()
  session.durationMinutes = Math.max(0, Math.round((end - start) / (1000 * 60)))

  saveSnapshot(snapshot)
  return session
}

export function getSessions(): StudySession[] {
  return loadSnapshot().sessions
}

export function getSessionsForDate(date: Date = new Date()): StudySession[] {
  const dateStr = toISODate(date)
  return loadSnapshot().sessions.filter((s) =>
    toISODate(new Date(s.startTime)) === dateStr
  )
}

export function getSessionsForWeek(date: Date = new Date()): StudySession[] {
  const weekStart = getStartOfWeek(date)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekEnd.getDate() + 7)

  return loadSnapshot().sessions.filter((s) => {
    const start = new Date(s.startTime)
    return start >= weekStart && start < weekEnd
  })
}

export function getTotalMinutesForDate(date: Date = new Date()): number {
  return getSessionsForDate(date)
    .filter((s) => s.status === 'completed')
    .reduce((sum, s) => sum + s.durationMinutes, 0)
}

export function getTotalMinutesForWeek(date: Date = new Date()): number {
  return getSessionsForWeek(date)
    .filter((s) => s.status === 'completed')
    .reduce((sum, s) => sum + s.durationMinutes, 0)
}

export function getRecentSessions(limit: number = 10): StudySession[] {
  return loadSnapshot()
    .sessions
    .filter((s) => s.status === 'completed')
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
    .slice(0, limit)
}

export function clearAllSessions(): void {
  saveSnapshot({ version: SCHEMA_VERSION, sessions: [], lastUpdated: nowISO() })
}
