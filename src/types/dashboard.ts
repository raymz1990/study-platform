/**
 * Tipos e interfaces do Dashboard — Concurso AI Platform.
 *
 * Fonte única da verdade: DATA_MODEL.md
 * O Dashboard utiliza apenas leitura dos modelos.
 */

// ---------------------------------------------------------------------------
// Plano Diário
// ---------------------------------------------------------------------------

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled'
export type TaskType =
  'study' | 'questions' | 'flashcards' | 'podcast' | 'review' | 'simulation' | 'reading'

export interface DailyTask {
  id: string
  type: TaskType
  title: string
  description: string
  time: number // minutos
  priority: 'low' | 'medium' | 'high'
  status: TaskStatus
}

export interface DailyPlan {
  id: string
  date: string // ISO 8601
  disciplines: string[]
  tasks: DailyTask[]
  estimatedTime: number // minutos
  completedTime: number // minutos
  status: 'pending' | 'in_progress' | 'completed'
}

// ---------------------------------------------------------------------------
// Revisão / Review Queue
// ---------------------------------------------------------------------------

export type ReviewType = '24h' | '7d' | '30d' | '60d' | '90d' | 'free'
export type ReviewUrgency = 'normal' | 'attention' | 'urgent'

export interface ReviewItem {
  id: string
  topic: string
  discipline: string
  type: ReviewType
  scheduledDate: string // ISO 8601
  urgency: ReviewUrgency
  completed: boolean
}

// ---------------------------------------------------------------------------
// Progresso por Disciplina
// ---------------------------------------------------------------------------

export type DisciplineStatus = 'not_started' | 'in_progress' | 'completed' | 'review'

export interface DisciplineProgress {
  id: string
  name: string
  order: number
  weight: number
  priority: number
  estimatedHours: number
  studiedHours: number
  percentCompleted: number
  status: DisciplineStatus
}

// ---------------------------------------------------------------------------
// Estatísticas
// ---------------------------------------------------------------------------

export interface Statistics {
  hoursStudied: number
  hoursPlanned: number
  correctAnswers: number
  wrongAnswers: number
  syllabusPercent: number
  disciplinePercent: number
  pendingReviews: number
  simulations: number
  averageScore: number
  averageTime: number // minutos
}

// ---------------------------------------------------------------------------
// Evolução Temporal (dados para gráficos)
// ---------------------------------------------------------------------------

export interface EvolutionPoint {
  date: string // ISO 8601
  hoursStudied: number
  correctRate: number // 0–100
  syllabusPercent: number // 0–100
}

// ---------------------------------------------------------------------------
// Streak de Estudos
// ---------------------------------------------------------------------------

export interface StudyStreak {
  current: number // dias consecutivos
  longest: number
  lastStudyDate: string | null // ISO 8601
}

// ---------------------------------------------------------------------------
// Dados Completos do Dashboard (agregado)
// ---------------------------------------------------------------------------

export interface DashboardData {
  examDate: string
  dailyPlan: DailyPlan
  reviewQueue: ReviewItem[]
  disciplineProgress: DisciplineProgress[]
  statistics: Statistics
  evolution: EvolutionPoint[]
  streak: StudyStreak
}

// ---------------------------------------------------------------------------
// Configuração do Concurso
// ---------------------------------------------------------------------------

export interface ExamConfig {
  examDate: string
  weeklyHours: number
  totalWeeks: number
  disciplinesCount: number
  institution: string
  profile: string
  board: string
}
