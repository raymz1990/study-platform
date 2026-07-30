/**
 * DashboardPage — tela principal da plataforma (cockpit de estudos).
 *
 * Hierarquia visual (UI_UX_GUIDELINES.md):
 *   plano do dia → revisões → progresso → estatísticas → complementar
 *
 * Dados: leitura via dashboard-service.ts (somente leitura, DATA_MODEL.md).
 * Estados: loading (skeleton), erro, vazio, sucesso.
 */

import { useEffect, useState } from 'react'
import { getDashboardData } from '@/services/dashboard-service'
import {
  calculateDaysUntilExam,
  calculateRemainingHours,
  calculateWeeksUntilExam,
  calculateRecommendedWeeklyHours,
} from '@/services/statistics-service'
import { KpiCard } from '@/components/dashboard/kpi-card'
import { ExamCountdown } from '@/components/dashboard/exam-countdown'
import { DailyPlanCard } from '@/components/dashboard/daily-plan-card'
import { ReviewQueueCard } from '@/components/dashboard/review-queue-card'
import { ProgressChart } from '@/components/dashboard/progress-chart'
import { DisciplineProgressList } from '@/components/dashboard/discipline-progress-list'
import { StudyStreakComponent } from '@/components/dashboard/study-streak'
import { Clock, Target, TrendingUp, BookOpen, AlertTriangle, Calendar, Zap } from 'lucide-react'
import type { DashboardData } from '@/types/dashboard'

export function DashboardPage(): React.ReactElement {
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Simula carregamento assíncrono para demonstrar estados skeleton
    const timer = setTimeout(() => {
      try {
        const dashboardData = getDashboardData()
        setData(dashboardData)
        setIsLoading(false)
      } catch {
        setError('Não foi possível carregar os dados do dashboard.')
        setIsLoading(false)
      }
    }, 600)

    return () => clearTimeout(timer)
  }, [])

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-20">
        <AlertTriangle className="text-destructive h-12 w-12" aria-hidden="true" />
        <h2 className="text-xl font-semibold">Erro ao carregar dashboard</h2>
        <p className="text-muted-foreground">{error}</p>
      </div>
    )
  }

  const stats = data?.statistics
  const daysLeft = data ? calculateDaysUntilExam(data.examDate) : 0
  const weeksLeft = data ? calculateWeeksUntilExam(data.examDate) : 0
  const remainingHours = stats ? calculateRemainingHours(stats.hoursStudied, stats.hoursPlanned) : 0
  const recommendedWeekly = calculateRecommendedWeeklyHours(remainingHours, weeksLeft)

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Acompanhe seu progresso e organize seus estudos
        </p>
      </div>

      {/* KPIs — linha superior */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Horas Estudadas"
          value={stats ? `${stats.hoursStudied}h` : '—'}
          icon={<Clock className="h-4 w-4" />}
          isLoading={isLoading}
          variant="info"
          {...(stats && { description: `de ${stats.hoursPlanned}h previstas` })}
        />
        <KpiCard
          title="Taxa de Acerto"
          value={stats ? `${stats.averageScore}%` : '—'}
          icon={<Target className="h-4 w-4" />}
          isLoading={isLoading}
          variant={stats && stats.averageScore >= 70 ? 'success' : 'warning'}
          {...(stats && {
            description: `${stats.correctAnswers} acertos / ${stats.wrongAnswers} erros`,
          })}
        />
        <KpiCard
          title="Percentual do Edital"
          value={stats ? `${stats.syllabusPercent}%` : '—'}
          icon={<TrendingUp className="h-4 w-4" />}
          isLoading={isLoading}
          variant={stats && stats.syllabusPercent >= 50 ? 'success' : 'info'}
          {...(stats && { description: `${stats.disciplinePercent}% das disciplinas iniciadas` })}
        />
        <KpiCard
          title="Revisões Pendentes"
          value={stats ? String(stats.pendingReviews) : '—'}
          icon={<BookOpen className="h-4 w-4" />}
          isLoading={isLoading}
          variant={
            stats && stats.pendingReviews > 3
              ? 'danger'
              : stats && stats.pendingReviews > 0
                ? 'warning'
                : 'success'
          }
          {...(stats && stats.pendingReviews > 0
            ? { description: 'Itens aguardando revisão' }
            : stats
              ? { description: 'Tudo em dia!' }
              : {})}
        />
      </section>

      {/* Hierarquia visual: plano do dia + countdown + streak */}
      <section className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DailyPlanCard plan={data?.dailyPlan ?? null} isLoading={isLoading} />
        </div>
        <div className="space-y-4">
          <ExamCountdown examDate={data?.examDate ?? '2026-10-11'} isLoading={isLoading} />
          <StudyStreakComponent streak={data?.streak ?? null} isLoading={isLoading} />
        </div>
      </section>

      {/* Revisões pendentes */}
      <section>
        <ReviewQueueCard reviews={data?.reviewQueue ?? []} isLoading={isLoading} />
      </section>

      {/* Progresso: gráfico + lista de disciplinas */}
      <section className="grid gap-4 lg:grid-cols-2">
        <ProgressChart data={data?.evolution ?? []} isLoading={isLoading} />
        <DisciplineProgressList
          disciplines={data?.disciplineProgress ?? []}
          isLoading={isLoading}
        />
      </section>

      {/* Estatísticas complementares */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard
          title="Dias até a Prova"
          value={isLoading ? '—' : `${daysLeft}`}
          icon={<Calendar className="h-4 w-4" />}
          isLoading={isLoading}
          variant={daysLeft <= 30 ? 'danger' : daysLeft <= 60 ? 'warning' : 'info'}
          {...(!isLoading && { description: `${weeksLeft} semanas restantes` })}
        />
        <KpiCard
          title="Horas Restantes"
          value={isLoading ? '—' : `${remainingHours}h`}
          icon={<Clock className="h-4 w-4" />}
          isLoading={isLoading}
          variant={remainingHours > 100 ? 'warning' : 'info'}
          {...(!isLoading && { description: `Meta: ${recommendedWeekly}h/semana` })}
        />
        <KpiCard
          title="Simulados Realizados"
          value={stats ? String(stats.simulations) : '—'}
          description="Média geral de desempenho"
          icon={<Zap className="h-4 w-4" />}
          isLoading={isLoading}
          variant={stats && stats.simulations >= 5 ? 'success' : 'info'}
        />
      </section>
    </div>
  )
}

DashboardPage.displayName = 'DashboardPage'
