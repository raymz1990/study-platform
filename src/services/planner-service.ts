/**
 * Planner Service — Concurso AI Platform.
 *
 * Responsabilidade: gerar plano de estudo a partir do cronograma oficial.
 * Camada 2 — apenas decide, nunca gera conteúdo.
 */

import roadmap from '@/data/planner/roadmap-s01-s11.json'
import weeklyTemplate from '@/data/planner/weekly-template.json'
import { slugify } from '@/utils/slugify'
import {
  toISODate,
  addDays,
  fromISODate,
  weekdayLabel,
  weekdayKey,
} from '@/utils/date'
import { getDisciplineIdByName, getChapterIdByTitle } from '@/services/discipline-service'
import type {
  StudyPlan,
  WeekPlan,
  DayPlan,
  PlannerActivity,
  ProgressSnapshot,
  StudyWeekRaw,
  WeeklyTemplate,
  CompletedTaskRecord,
  CompletedTask,
} from '@/types/planner'

// ---------------------------------------------------------------------------
// Constantes
// ---------------------------------------------------------------------------

const MS_PER_DAY = 1000 * 60 * 60 * 24
const PROGRESS_KEY = 'cap.planner.progress'

// ---------------------------------------------------------------------------
// Cálculo de semana
// ---------------------------------------------------------------------------

export function getCurrentWeekNumber(
  startDate: string,
  currentDate: Date = new Date()
): number {
  const start = fromISODate(startDate)
  const now = fromISODate(toISODate(currentDate))

  const diffMs = now.getTime() - start.getTime()
  const diffDays = Math.floor(diffMs / MS_PER_DAY)
  const weekNumber = Math.floor(diffDays / 7) + 1

  return clamp(weekNumber, 1, 11)
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

// ---------------------------------------------------------------------------
// Formatação de intervalo
// ---------------------------------------------------------------------------

export function formatWeekRange(
  weekNumber: number,
  startDate: string
): { start: string; end: string } {
  const start = fromISODate(startDate)
  start.setDate(start.getDate() + (weekNumber - 1) * 7)

  const end = addDays(start, 6)

  return {
    start: toISODate(start),
    end: toISODate(end),
  }
}

// ---------------------------------------------------------------------------
// Geração de IDs estáveis
// ---------------------------------------------------------------------------

function generateActivityId(weekNumber: number, dayIndex: number, slot: number): string {
  return `task_s${String(weekNumber).padStart(2, '0')}_${dayIndex}_${slot}`
}

// ---------------------------------------------------------------------------
// Geração de atividades do dia
// ---------------------------------------------------------------------------

function generateActivitiesForDay(
  date: Date,
  weekData: StudyWeekRaw,
  template: WeeklyTemplate
): PlannerActivity[] {
  const key = weekdayKey(date)
  if (!key) return []

  const slot = template.template[key]
  if (!slot) return []

  const activities: PlannerActivity[] = []
  let discipline = slot.discipline
  let topics: string[] = []

  if (slot.discipline === '{{module2}}') {
    discipline = weekData.module2.discipline
    topics = weekData.module2.topics
  } else if (slot.discipline === '{{rotative}}') {
    discipline = weekData.thursday.discipline
    topics = weekData.thursday.topics
  }

  const dayIndex = date.getDay()
  const resolvedDisciplineId = getDisciplineIdByName(discipline)
  const disciplineId = resolvedDisciplineId ?? slugify(discipline)

  if (slot.type === 'review') {
    activities.push({
      id: generateActivityId(weekData.number, dayIndex, 0),
      type: 'review',
      title: 'Revisão Espaçada',
      description: 'Flashcards da semana + revisão de 30 dias',
      duration: slot.duration,
      discipline: 'Revisão',
      disciplineId: 'review',
      topicId: 'spaced-review',
      status: 'pending',
      priority: 'high',
    })
  } else if (topics.length === 0) {
    // Disciplina fixa do template sem tópicos explícitos (ex: Língua Portuguesa)
    const resolvedTopicId = getChapterIdByTitle(disciplineId, discipline)
    activities.push({
      id: generateActivityId(weekData.number, dayIndex, 0),
      type: slot.type as PlannerActivity['type'],
      title: discipline,
      duration: slot.duration,
      discipline,
      disciplineId,
      topicId: resolvedTopicId ?? disciplineId,
      status: 'pending',
      priority: 'high',
    })
  } else {
    topics.forEach((topic, index) => {
      const resolvedTopicId = getChapterIdByTitle(disciplineId, topic)
      activities.push({
        id: generateActivityId(weekData.number, dayIndex, index),
        type: slot.type as PlannerActivity['type'],
        title: `${discipline} — ${topic}`,
        duration: Math.round(slot.duration / Math.max(topics.length, 1)),
        discipline,
        disciplineId,
        topicId: resolvedTopicId ?? slugify(topic),
        status: 'pending',
        priority: 'high',
      })
    })
  }

  return activities
}

// ---------------------------------------------------------------------------
// Geração de atividade de simulado
// ---------------------------------------------------------------------------

function generateSimulationActivity(weekData: StudyWeekRaw, dayIndex: number): PlannerActivity {
  return {
    id: generateActivityId(weekData.number, dayIndex, 99),
    type: 'simulation',
    title: 'Simulado Oficial',
    description: `Simulado da semana ${weekData.label} — ${weekData.milestones.join(', ') || 'Avaliação de progresso'}`,
    duration: 120,
    discipline: 'Simulado',
    disciplineId: 'simulation',
    topicId: `simulation-s${String(weekData.number).padStart(2, '0')}`,
    status: 'pending',
    priority: 'high',
  }
}

// ---------------------------------------------------------------------------
// Aplicação de progresso
// ---------------------------------------------------------------------------

function applyProgress(
  activities: PlannerActivity[],
  progress: ProgressSnapshot
): PlannerActivity[] {
  const completed = new Set(progress.completedTasks.map((t) => t.taskId))
  return activities.map((activity) => ({
    ...activity,
    status: completed.has(activity.id) ? 'completed' : activity.status,
  }))
}

// ---------------------------------------------------------------------------
// Geração de WeekPlan
// ---------------------------------------------------------------------------

function generateWeekPlan(
  weekData: StudyWeekRaw,
  template: WeeklyTemplate,
  progress: ProgressSnapshot,
  currentDate: Date
): WeekPlan {
  const range = formatWeekRange(weekData.number, roadmap.startDate)
  const start = fromISODate(weekData.startDate)
  const days: DayPlan[] = []

  for (let i = 0; i < 7; i++) {
    const date = addDays(start, i)
    const dateStr = toISODate(date)
    let activities = generateActivitiesForDay(date, weekData, template)

    // Adicionar simulado no sábado (dayIndex=6) quando hasSimulation=true
    if (weekData.hasSimulation && date.getDay() === 6) {
      activities = [...activities, generateSimulationActivity(weekData, 6)]
    }

    days.push({
      date: dateStr,
      weekday: date.getDay(),
      weekdayLabel: weekdayLabel(date),
      activities: applyProgress(activities, progress),
      isCurrentDay: dateStr === toISODate(currentDate),
      isExamDay: dateStr === roadmap.examDate,
    })
  }

  return {
    weekNumber: weekData.number,
    range,
    days,
  }
}

// ---------------------------------------------------------------------------
// API pública
// ---------------------------------------------------------------------------

export function loadStudyPlan(currentDate: Date = new Date()): StudyPlan {
  const rawWeeks = roadmap.weeks as StudyWeekRaw[]
  const template = weeklyTemplate as WeeklyTemplate
  const currentWeek = getCurrentWeekNumber(roadmap.startDate, currentDate)

  const progress = loadProgress()

  const weeks = rawWeeks.map((week) =>
    generateWeekPlan(week, template, progress, currentDate)
  )

  return {
    examDate: roadmap.examDate,
    startDate: roadmap.startDate,
    totalWeeks: roadmap.totalWeeks,
    currentWeek,
    weeks,
  }
}

export function getDailyPlan(studyPlan: StudyPlan, date: Date = new Date()): DayPlan | null {
  const dateStr = toISODate(date)

  for (const week of studyPlan.weeks) {
    const day = week.days.find((d) => d.date === dateStr)
    if (day) return day
  }

  return null
}

// ---------------------------------------------------------------------------
// Transformação: ProgressSnapshot → CompletedTask[] (compartilhado)
// ---------------------------------------------------------------------------

export function getCompletedTasksForReview(progress: ProgressSnapshot): CompletedTask[] {
  return progress.completedTasks.map((record) => ({
    taskId: record.taskId,
    topic: record.topicName || record.topicId,
    discipline: record.disciplineName || record.disciplineId,
    completedDate: record.completedDate,
  }))
}

// ---------------------------------------------------------------------------
// Persistência (schema v2)
// ---------------------------------------------------------------------------

function migrateFromV1(parsed: Record<string, unknown>): ProgressSnapshot {
  // Migração: completedTaskIds (string[]) → completedTasks (CompletedTaskRecord[])
  const oldIds = parsed.completedTaskIds
  if (Array.isArray(oldIds) && oldIds.length > 0 && typeof oldIds[0] === 'string') {
    const today = toISODate(new Date())
    const migratedTasks: CompletedTaskRecord[] = oldIds.map((taskId: string) => ({
      taskId,
      completedDate: today,
      disciplineId: 'unknown',
      disciplineName: 'Desconhecida',
      topicId: 'unknown',
      topicName: 'Desconhecido',
    }))
    return {
      completedTasks: migratedTasks,
      hoursLogged: typeof parsed.hoursLogged === 'object' && parsed.hoursLogged !== null
        ? (parsed.hoursLogged as Record<string, number>)
        : {},
      lastUpdated: parsed.lastUpdated as string ?? new Date().toISOString(),
    }
  }
  return {
    completedTasks: [],
    hoursLogged: {},
    lastUpdated: new Date().toISOString(),
  }
}

function isValidV2Record(item: unknown): item is CompletedTaskRecord {
  return (
    typeof item === 'object' &&
    item !== null &&
    'taskId' in (item as Record<string, unknown>) &&
    'completedDate' in (item as Record<string, unknown>)
  )
}

export function loadProgress(): ProgressSnapshot {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY)
    if (!raw) {
      return { completedTasks: [], hoursLogged: {}, lastUpdated: new Date().toISOString() }
    }
    const parsed = JSON.parse(raw) as Record<string, unknown>

    // Schema v2: completedTasks existe e é array (pode ser vazio)
    if (
      Array.isArray(parsed.completedTasks) &&
      (parsed.completedTasks.length === 0 || isValidV2Record(parsed.completedTasks[0]))
    ) {
      const hoursLogged = parsed.hoursLogged
      return {
        completedTasks: parsed.completedTasks as CompletedTaskRecord[],
        hoursLogged:
          typeof hoursLogged === 'object' && hoursLogged !== null
            ? (hoursLogged as Record<string, number>)
            : {},
        lastUpdated: (parsed.lastUpdated as string) ?? new Date().toISOString(),
      }
    }

    // Schema v1 ou corrompido: migra
    return migrateFromV1(parsed)
  } catch {
    return { completedTasks: [], hoursLogged: {}, lastUpdated: new Date().toISOString() }
  }
}

export function saveProgress(progress: ProgressSnapshot): void {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
  } catch {
    // localStorage pode estar cheio ou desabilitado — ignora silenciosamente
  }
}
