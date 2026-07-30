/**
 * Tipos do Study Planner — Concurso AI Platform.
 *
 * Fonte única: DATA_MODEL.md (Plano Diário, Tarefa, Revisão)
 * O Planner pertence à Camada 2 — decide, nunca gera conteúdo.
 */

// ---------------------------------------------------------------------------
// Tipos base de atividade
// ---------------------------------------------------------------------------

export type ActivityType =
  | 'study'
  | 'questions'
  | 'flashcards'
  | 'podcast'
  | 'review'
  | 'simulation'
  | 'reading'

export type ActivityStatus = 'pending' | 'in_progress' | 'completed' | 'skipped'

// ---------------------------------------------------------------------------
// Atividade individual do planner
// ---------------------------------------------------------------------------

export interface PlannerActivity {
  id: string
  type: ActivityType
  title: string
  description?: string
  duration: number
  discipline: string
  disciplineId: string
  topicId: string
  status: ActivityStatus
  priority: 'low' | 'medium' | 'high'
}

// ---------------------------------------------------------------------------
// Plano de um dia
// ---------------------------------------------------------------------------

export interface DayPlan {
  date: string
  weekday: number
  weekdayLabel: string
  activities: PlannerActivity[]
  isCurrentDay: boolean
  isExamDay: boolean
}

// ---------------------------------------------------------------------------
// Plano semanal
// ---------------------------------------------------------------------------

export interface WeekPlan {
  weekNumber: number
  range: { start: string; end: string }
  days: DayPlan[]
}

// ---------------------------------------------------------------------------
// Semana no cronograma oficial (JSON)
// ---------------------------------------------------------------------------

export interface StudyWeekRaw {
  number: number
  label: string
  startDate: string
  module2: {
    discipline: string
    topics: string[]
  }
  thursday: {
    discipline: string
    topics: string[]
  }
  milestones: string[]
  hasSimulation: boolean
}

// ---------------------------------------------------------------------------
// Cronograma completo
// ---------------------------------------------------------------------------

export interface StudyPlan {
  examDate: string
  startDate: string
  totalWeeks: number
  currentWeek: number
  weeks: WeekPlan[]
}

// ---------------------------------------------------------------------------
// Registro de tarefa concluída (persistido) — schema v2.2
// ---------------------------------------------------------------------------

export interface CompletedTaskRecord {
  taskId: string
  completedDate: string
  disciplineId: string
  disciplineName: string
  topicId: string
  topicName: string
  durationMinutes?: number
}

// ---------------------------------------------------------------------------
// Progresso persistido (schema v2)
// ---------------------------------------------------------------------------

export interface ProgressSnapshot {
  completedTasks: CompletedTaskRecord[]
  hoursLogged: Record<string, number>
  lastUpdated: string
}

// ---------------------------------------------------------------------------
// Tarefa concluída (entrada para revisões)
// ---------------------------------------------------------------------------

export interface CompletedTask {
  taskId: string
  topic: string
  discipline: string
  completedDate: string
}

// ---------------------------------------------------------------------------
// Template semanal (JSON)
// ---------------------------------------------------------------------------

export interface WeeklyTemplate {
  template: Record<string, {
    type: ActivityType
    discipline: string
    duration: number
  }>
}
