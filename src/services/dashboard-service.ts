/**
 * Dashboard Service — Concurso AI Platform.
 *
 * Responsabilidade: fornecer dados agregados para o Dashboard.
 * Apenas leitura dos modelos (DATA_MODEL.md §Dashboard).
 * Dados mockados genéricos para preservar reusabilidade da plataforma.
 */

import type {
  DashboardData,
  DailyPlan,
  DailyTask,
  ReviewItem,
  DisciplineProgress,
  Statistics,
  EvolutionPoint,
  StudyStreak,
  ExamConfig,
} from '@/types/dashboard'

// ---------------------------------------------------------------------------
// Configuração do concurso (carregada de config/exam.json no build)
// ---------------------------------------------------------------------------

import examConfigRaw from '../../config/exam.json'

export const examConfig: ExamConfig = examConfigRaw as ExamConfig

// ---------------------------------------------------------------------------
// Dados mockados genéricos (12 disciplinas — reutilizáveis para qualquer concurso)
// ---------------------------------------------------------------------------

const mockDisciplines: DisciplineProgress[] = [
  {
    id: 'disc_001',
    name: 'Língua Portuguesa',
    order: 1,
    weight: 1,
    priority: 3,
    estimatedHours: 20,
    studiedHours: 12,
    percentCompleted: 60,
    status: 'in_progress',
  },
  {
    id: 'disc_002',
    name: 'Matemática Financeira',
    order: 2,
    weight: 2,
    priority: 5,
    estimatedHours: 25,
    studiedHours: 18,
    percentCompleted: 72,
    status: 'in_progress',
  },
  {
    id: 'disc_003',
    name: 'Raciocínio Lógico',
    order: 3,
    weight: 1,
    priority: 4,
    estimatedHours: 15,
    studiedHours: 10,
    percentCompleted: 67,
    status: 'in_progress',
  },
  {
    id: 'disc_004',
    name: 'Direito Constitucional',
    order: 4,
    weight: 2,
    priority: 5,
    estimatedHours: 30,
    studiedHours: 8,
    percentCompleted: 27,
    status: 'in_progress',
  },
  {
    id: 'disc_005',
    name: 'Direito Administrativo',
    order: 5,
    weight: 2,
    priority: 5,
    estimatedHours: 28,
    studiedHours: 5,
    percentCompleted: 18,
    status: 'in_progress',
  },
  {
    id: 'disc_006',
    name: 'Economia',
    order: 6,
    weight: 3,
    priority: 5,
    estimatedHours: 35,
    studiedHours: 15,
    percentCompleted: 43,
    status: 'in_progress',
  },
  {
    id: 'disc_007',
    name: 'Administração Financeira',
    order: 7,
    weight: 3,
    priority: 5,
    estimatedHours: 32,
    studiedHours: 14,
    percentCompleted: 44,
    status: 'in_progress',
  },
  {
    id: 'disc_008',
    name: 'Contabilidade Geral',
    order: 8,
    weight: 3,
    priority: 5,
    estimatedHours: 40,
    studiedHours: 20,
    percentCompleted: 50,
    status: 'in_progress',
  },
  {
    id: 'disc_009',
    name: 'Contabilidade de Custos',
    order: 9,
    weight: 2,
    priority: 4,
    estimatedHours: 25,
    studiedHours: 6,
    percentCompleted: 24,
    status: 'in_progress',
  },
  {
    id: 'disc_010',
    name: 'Auditoria',
    order: 10,
    weight: 2,
    priority: 4,
    estimatedHours: 22,
    studiedHours: 3,
    percentCompleted: 14,
    status: 'in_progress',
  },
  {
    id: 'disc_011',
    name: 'LGPD e Ética',
    order: 11,
    weight: 1,
    priority: 3,
    estimatedHours: 12,
    studiedHours: 4,
    percentCompleted: 33,
    status: 'in_progress',
  },
  {
    id: 'disc_012',
    name: 'Estatística',
    order: 12,
    weight: 1,
    priority: 3,
    estimatedHours: 18,
    studiedHours: 7,
    percentCompleted: 39,
    status: 'in_progress',
  },
]

const mockDailyTasks: DailyTask[] = [
  {
    id: 'task_001',
    type: 'study',
    title: 'Estudar Matemática Financeira — Juros Compostos',
    description: 'Capítulo 3 do roadmap de Matemática Financeira',
    time: 90,
    priority: 'high',
    status: 'in_progress',
  },
  {
    id: 'task_002',
    type: 'questions',
    title: 'Resolver 10 questões de Raciocínio Lógico',
    description: 'Foco em proposições e inferências',
    time: 45,
    priority: 'medium',
    status: 'pending',
  },
  {
    id: 'task_003',
    type: 'review',
    title: 'Revisar Direito Constitucional — Direitos Fundamentais',
    description: 'Revisão de 7 dias',
    time: 30,
    priority: 'high',
    status: 'pending',
  },
  {
    id: 'task_004',
    type: 'flashcards',
    title: 'Flashcards de Economia — Macroeconomia',
    description: '20 flashcards do deck de Economia',
    time: 20,
    priority: 'low',
    status: 'pending',
  },
  {
    id: 'task_005',
    type: 'reading',
    title: 'Leitura de Administração Financeira — Análise de Demonstrações',
    description: 'Apostila capítulo 2',
    time: 60,
    priority: 'medium',
    status: 'pending',
  },
]

const mockDailyPlan: DailyPlan = {
  id: 'plan_001',
  date: new Date().toISOString().split('T')[0] as string,
  disciplines: ['Matemática Financeira', 'Raciocínio Lógico', 'Direito Constitucional'],
  tasks: mockDailyTasks,
  estimatedTime: 245,
  completedTime: 45,
  status: 'in_progress',
}

const mockReviewQueue: ReviewItem[] = [
  {
    id: 'rev_001',
    topic: 'Direitos Fundamentais — CF/88',
    discipline: 'Direito Constitucional',
    type: '7d',
    scheduledDate: '2026-07-26',
    urgency: 'urgent',
    completed: false,
  },
  {
    id: 'rev_002',
    topic: 'Juros Simples e Compostos',
    discipline: 'Matemática Financeira',
    type: '24h',
    scheduledDate: '2026-07-27',
    urgency: 'urgent',
    completed: false,
  },
  {
    id: 'rev_003',
    topic: 'Proposições Lógicas',
    discipline: 'Raciocínio Lógico',
    type: '7d',
    scheduledDate: '2026-07-28',
    urgency: 'attention',
    completed: false,
  },
  {
    id: 'rev_004',
    topic: 'Teoria da Produção',
    discipline: 'Economia',
    type: '30d',
    scheduledDate: '2026-07-25',
    urgency: 'normal',
    completed: false,
  },
  {
    id: 'rev_005',
    topic: 'Balancete de Verificação',
    discipline: 'Contabilidade Geral',
    type: '7d',
    scheduledDate: '2026-07-29',
    urgency: 'attention',
    completed: false,
  },
]

const mockEvolution: EvolutionPoint[] = [
  { date: '2026-07-01', hoursStudied: 8, correctRate: 62, syllabusPercent: 15 },
  { date: '2026-07-05', hoursStudied: 10, correctRate: 65, syllabusPercent: 18 },
  { date: '2026-07-10', hoursStudied: 12, correctRate: 68, syllabusPercent: 22 },
  { date: '2026-07-15', hoursStudied: 9, correctRate: 64, syllabusPercent: 25 },
  { date: '2026-07-20', hoursStudied: 14, correctRate: 70, syllabusPercent: 30 },
  { date: '2026-07-25', hoursStudied: 11, correctRate: 72, syllabusPercent: 34 },
  { date: '2026-07-28', hoursStudied: 13, correctRate: 75, syllabusPercent: 38 },
]

const mockStreak: StudyStreak = {
  current: 5,
  longest: 12,
  lastStudyDate: '2026-07-28',
}

// ---------------------------------------------------------------------------
// Funções de cálculo (regras simples, sem lógica de negócio complexa)
// ---------------------------------------------------------------------------

function calculateStatistics(disciplines: DisciplineProgress[]): Statistics {
  const totalStudied = disciplines.reduce((sum, d) => sum + d.studiedHours, 0)
  const totalPlanned = disciplines.reduce((sum, d) => sum + d.estimatedHours, 0)
  const syllabusPercent = Math.round(
    disciplines.reduce((sum, d) => sum + d.percentCompleted, 0) / disciplines.length
  )

  // Taxa de acerto simulada (evolui conforme progresso)
  const correctRate = Math.min(85, 55 + Math.round(syllabusPercent * 0.4))
  const totalQuestions = Math.round(totalStudied * 3)
  const correctAnswers = Math.round(totalQuestions * (correctRate / 100))
  const wrongAnswers = totalQuestions - correctAnswers

  return {
    hoursStudied: totalStudied,
    hoursPlanned: totalPlanned,
    correctAnswers,
    wrongAnswers,
    syllabusPercent,
    disciplinePercent: Math.round(
      (disciplines.filter((d) => d.percentCompleted > 0).length / disciplines.length) * 100
    ),
    pendingReviews: mockReviewQueue.filter((r) => !r.completed).length,
    simulations: 3,
    averageScore: correctRate,
    averageTime: Math.round(
      totalStudied / Math.max(1, disciplines.filter((d) => d.studiedHours > 0).length)
    ),
  }
}

// ---------------------------------------------------------------------------
// API pública do serviço
// ---------------------------------------------------------------------------

export function getDashboardData(): DashboardData {
  return {
    examDate: examConfig.examDate,
    dailyPlan: mockDailyPlan,
    reviewQueue: mockReviewQueue,
    disciplineProgress: mockDisciplines,
    statistics: calculateStatistics(mockDisciplines),
    evolution: mockEvolution,
    streak: mockStreak,
  }
}

export function getExamConfig(): ExamConfig {
  return examConfig
}
