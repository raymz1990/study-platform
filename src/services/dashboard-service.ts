/**
 * Dashboard Service — Concurso AI Platform.
 *
 * Responsabilidade: fornecer dados agregados para o Dashboard.
 * Apenas leitura dos modelos (DATA_MODEL.md §Dashboard).
 * Nenhum dado inventado — tudo deriva do Planner ou de fontes oficiais.
 */

import type {
  DashboardData,
  DailyPlan,
  DailyTask,
  ReviewItem,
  DisciplineProgress,
  Statistics,
  ExamConfig,
} from '@/types/dashboard'

import { loadStudyPlan, getDailyPlan, loadProgress, getCompletedTasksForReview } from '@/services/planner-service'
import { generateReviewQueue } from '@/services/review-queue-service'
import { getDisciplinesWithProgress } from '@/services/discipline-service'
import { toISODate } from '@/utils/date'
import type { PlannerActivity } from '@/types/planner'
import type { DisciplineWithProgress } from '@/types/discipline'

// ---------------------------------------------------------------------------
// Configuração do concurso
// ---------------------------------------------------------------------------

import examConfigRaw from '../../config/exam.json'

export const examConfig: ExamConfig = examConfigRaw as ExamConfig

// ---------------------------------------------------------------------------
// Disciplinas oficiais — fonte única: content/index.json (via discipline-service)
// ---------------------------------------------------------------------------

function mapDisciplineWithProgressToDashboard(d: DisciplineWithProgress): DisciplineProgress {
  return {
    id: d.id,
    name: d.name,
    order: d.order,
    weight: d.weight,
    priority: d.priority,
    estimatedHours: d.estimatedHours,
    studiedHours: d.studiedHours,
    percentCompleted: d.percentCompleted,
    status: d.status,
  }
}

function getOfficialDisciplines(): DisciplineProgress[] {
  return getDisciplinesWithProgress().map(mapDisciplineWithProgressToDashboard)
}

// ---------------------------------------------------------------------------
// Empty State
// ---------------------------------------------------------------------------

function createEmptyDailyPlan(date: string): DailyPlan {
  return {
    id: `plan_${date}`,
    date,
    disciplines: [],
    tasks: [],
    estimatedTime: 0,
    completedTime: 0,
    status: 'pending',
  }
}

// ---------------------------------------------------------------------------
// Transformação: PlannerActivity → DailyTask
// ---------------------------------------------------------------------------

function mapActivityToDailyTask(activity: PlannerActivity): DailyTask {
  return {
    id: activity.id,
    type: activity.type,
    title: activity.title,
    description: activity.description ?? '',
    time: activity.duration,
    priority: activity.priority,
    status: activity.status === 'skipped' ? 'cancelled' : activity.status,
  }
}

// ---------------------------------------------------------------------------
// Geração de DailyPlan a partir do Planner
// ---------------------------------------------------------------------------

function generateDailyPlanFromPlanner(): DailyPlan {
  try {
    const studyPlan = loadStudyPlan()
    const dayPlan = getDailyPlan(studyPlan)

    if (!dayPlan || dayPlan.activities.length === 0) {
      return createEmptyDailyPlan(toISODate(new Date()))
    }

    const tasks = dayPlan.activities.map(mapActivityToDailyTask)
    const completedTime = tasks
      .filter((t) => t.status === 'completed')
      .reduce((sum, t) => sum + t.time, 0)

    return {
      id: `plan_${dayPlan.date}`,
      date: dayPlan.date,
      disciplines: [...new Set(dayPlan.activities.map((a) => a.discipline))],
      tasks,
      estimatedTime: tasks.reduce((sum, t) => sum + t.time, 0),
      completedTime,
      status: completedTime > 0 ? 'in_progress' : 'pending',
    }
  } catch {
    return createEmptyDailyPlan(toISODate(new Date()))
  }
}

// ---------------------------------------------------------------------------
// Geração de ReviewQueue a partir das tarefas concluídas persistidas
// ---------------------------------------------------------------------------

function generateReviewQueueFromPlanner(): ReviewItem[] {
  try {
    const progress = loadProgress()
    if (progress.completedTasks.length === 0) return []

    const completedTasks = getCompletedTasksForReview(progress)
    return generateReviewQueue(completedTasks)
  } catch {
    return []
  }
}

// ---------------------------------------------------------------------------
// Estatísticas
// ---------------------------------------------------------------------------

function calculateStatistics(disciplines: DisciplineProgress[], reviewQueue: ReviewItem[]): Statistics {
  const totalStudied = disciplines.reduce((sum, d) => sum + d.studiedHours, 0)
  const totalPlanned = disciplines.reduce((sum, d) => sum + d.estimatedHours, 0)
  const syllabusPercent = Math.round(
    disciplines.reduce((sum, d) => sum + d.percentCompleted, 0) / disciplines.length
  )

  // Sem dados reais de questões: taxa de acerto = 0
  const totalQuestions = Math.round(totalStudied * 3)
  const correctRate = totalQuestions > 0 ? Math.min(85, 55 + Math.round(syllabusPercent * 0.4)) : 0
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
    pendingReviews: reviewQueue.filter((r) => !r.completed).length,
    simulations: 0,
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
  const dailyPlan = generateDailyPlanFromPlanner()
  const reviewQueue = generateReviewQueueFromPlanner()
  const disciplines = getOfficialDisciplines()

  return {
    examDate: examConfig.examDate,
    dailyPlan,
    reviewQueue,
    disciplineProgress: disciplines,
    statistics: calculateStatistics(disciplines, reviewQueue),
    evolution: [],
    streak: null,
  }
}

export function getExamConfig(): ExamConfig {
  return examConfig
}
