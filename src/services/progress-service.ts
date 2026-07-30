/**
 * Progress Service — Concurso AI Platform.
 *
 * Responsabilidade: agregar dados de progresso a partir das sessões de estudo.
 * Consome session-service e planner-service para produzir métricas unificadas.
 */

import type {
  ProgressData,
  StudySession,
  WeeklyGoal,
  SessionHistoryItem,
} from '@/types/progress'
import type { StudyStreak, EvolutionPoint } from '@/types/dashboard'
import {
  getSessions,
  getTotalMinutesForWeek,
  getRecentSessions,
} from '@/services/session-service'
import { toISODate, diffDays } from '@/utils/date'
import examConfig from '../../config/exam.json'

// ---------------------------------------------------------------------------
// Constantes
// ---------------------------------------------------------------------------

const WEEKLY_TARGET_MINUTES = (examConfig.weeklyHours as number) * 60 // 810

// ---------------------------------------------------------------------------
// Streak
// ---------------------------------------------------------------------------

export function calculateStreak(sessions: StudySession[]): StudyStreak {
  const completedDates = new Set(
    sessions
      .filter((s) => s.status === 'completed' && s.durationMinutes > 0)
      .map((s) => toISODate(new Date(s.startTime)))
  )

  const sortedDates = Array.from(completedDates).sort()
  if (sortedDates.length === 0) {
    return { current: 0, longest: 0, lastStudyDate: null }
  }

  const today = toISODate(new Date())
  const lastDate = sortedDates[sortedDates.length - 1]
  if (!lastDate) {
    return { current: 0, longest: 0, lastStudyDate: null }
  }

  // Se o último estudo não foi hoje nem ontem, streak quebrou
  const daysSinceLastStudy = diffDays(today, lastDate)
  const isActive = daysSinceLastStudy <= 1

  // Calcula streak atual (dias consecutivos até hoje/ontem)
  let current = 0
  if (isActive) {
    current = 1
    for (let i = sortedDates.length - 2; i >= 0; i--) {
      const curr = sortedDates[i]
      const next = sortedDates[i + 1]
      if (curr && next && diffDays(curr, next) === 1) {
        current++
      } else {
        break
      }
    }
  }

  // Calcula recorde (maior sequência consecutiva no histórico)
  let longest = 1
  let currentRun = 1
  for (let i = 1; i < sortedDates.length; i++) {
    const prev = sortedDates[i - 1]
    const curr = sortedDates[i]
    if (prev && curr && diffDays(prev, curr) === 1) {
      currentRun++
      longest = Math.max(longest, currentRun)
    } else {
      currentRun = 1
    }
  }

  return {
    current,
    longest,
    lastStudyDate: lastDate,
  }
}

// ---------------------------------------------------------------------------
// Meta Semanal
// ---------------------------------------------------------------------------

export function calculateWeeklyGoal(date: Date = new Date()): WeeklyGoal {
  // Domingo da semana atual
  const d = new Date(date)
  const day = d.getDay()
  d.setDate(d.getDate() - day)
  d.setHours(0, 0, 0, 0)

  const weekStart = toISODate(d)
  const completedMinutes = getTotalMinutesForWeek(date)

  return {
    weekStartDate: weekStart,
    targetMinutes: WEEKLY_TARGET_MINUTES,
    completedMinutes,
  }
}

// ---------------------------------------------------------------------------
// Evolution (dados para gráficos)
// ---------------------------------------------------------------------------

export function generateEvolution(sessions: StudySession[]): EvolutionPoint[] {
  // Agrupa sessões completadas por data
  const byDate = new Map<string, { hours: number; sessions: number }>()

  for (const session of sessions) {
    if (session.status !== 'completed') continue
    const date = toISODate(new Date(session.startTime))
    const existing = byDate.get(date) ?? { hours: 0, sessions: 0 }
    existing.hours += session.durationMinutes / 60
    existing.sessions++
    byDate.set(date, existing)
  }

  const dates = Array.from(byDate.keys()).sort()

  // Acumula percentual do edital a cada dia
  let cumulativePercent = 0
  const points: EvolutionPoint[] = []

  for (const date of dates) {
    const dayData = byDate.get(date)
    if (!dayData) continue
    cumulativePercent = Math.min(100, cumulativePercent + (dayData.sessions > 0 ? 2 : 0))

    points.push({
      date,
      hoursStudied: Math.round(dayData.hours * 10) / 10,
      correctRate: 0, // Sem dados reais de questões por sessão
      syllabusPercent: cumulativePercent,
    })
  }

  return points
}

// ---------------------------------------------------------------------------
// Histórico de Atividades
// ---------------------------------------------------------------------------

export function buildSessionHistory(sessions: StudySession[]): SessionHistoryItem[] {
  return sessions
    .filter((s) => s.status === 'completed')
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
    .map((s) => ({
      date: toISODate(new Date(s.startTime)),
      activity: s.objective || `${s.disciplineName} — ${s.topicName}`,
      disciplineName: s.disciplineName,
      durationMinutes: s.durationMinutes,
      result: s.status === 'completed' ? 'completed' : 'interrupted',
    }))
}

// ---------------------------------------------------------------------------
// API pública: ProgressData completo
// ---------------------------------------------------------------------------

export function getProgressData(): ProgressData {
  const sessions = getSessions()
  const recentSessions = getRecentSessions(10)
  const totalMinutes = sessions
    .filter((s) => s.status === 'completed')
    .reduce((sum, s) => sum + s.durationMinutes, 0)
  const completedSessions = sessions.filter((s) => s.status === 'completed')

  return {
    streak: calculateStreak(sessions),
    weeklyGoal: calculateWeeklyGoal(),
    totalMinutesStudied: totalMinutes,
    totalSessions: completedSessions.length,
    averageSessionMinutes:
      completedSessions.length > 0
        ? Math.round(totalMinutes / completedSessions.length)
        : 0,
    evolution: generateEvolution(sessions),
    recentSessions,
  }
}

// ---------------------------------------------------------------------------
// Estatísticas por Disciplina (tempo real estudado)
// ---------------------------------------------------------------------------

export function getStudyTimeByDiscipline(): Record<string, number> {
  const sessions = getSessions()
  const map: Record<string, number> = {}

  for (const session of sessions) {
    if (session.status !== 'completed') continue
    map[session.disciplineId] = (map[session.disciplineId] ?? 0) + session.durationMinutes
  }

  return map
}

// ---------------------------------------------------------------------------
// Verificação: meta semanal atingida?
// ---------------------------------------------------------------------------

export function isWeeklyGoalReached(date: Date = new Date()): boolean {
  const goal = calculateWeeklyGoal(date)
  return goal.completedMinutes >= goal.targetMinutes
}
