/**
 * ProgressoPage — página de controle de progresso.
 *
 * Seções:
 * - Métricas principais (StudyMetrics)
 * - Cronômetro de sessão (StudySessionComponent)
 * - Meta semanal (GoalTracker)
 * - Gráfico de evolução (ProgressChart)
 * - Streak (StudyStreakComponent)
 * - Histórico de sessões
 */

import { useState, useEffect, useCallback } from 'react'
import { BarChart3, Clock, Calendar, BookOpen } from 'lucide-react'
import { Card, CardContent } from '@/components/foundation/card'
import { Skeleton } from '@/components/foundation/skeleton'
import { StudyMetrics } from '@/components/learning/study-metrics'
import { StudySessionComponent } from '@/components/learning/study-session'
import { GoalTracker } from '@/components/learning/goal-tracker'
import { ProgressChart } from '@/components/dashboard/progress-chart'
import { StudyStreakComponent } from '@/components/dashboard/study-streak'
import { getProgressData, buildSessionHistory } from '@/services/progress-service'
import { getSessions } from '@/services/session-service'
import type { ProgressData } from '@/types/progress'

export function ProgressoPage(): React.ReactElement {
  const [data, setData] = useState<ProgressData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const load = useCallback(() => {
    try {
      setLoading(true)
      setError(null)
      const progress = getProgressData()
      setData(progress)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar progresso.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load, refreshKey])

  const handleSessionComplete = useCallback(() => {
    setRefreshKey((k) => k + 1)
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-2 h-4 w-64" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <BarChart3 className="h-10 w-10 text-destructive" aria-hidden="true" />
        <h2 className="mt-4 text-lg font-semibold">Erro ao carregar progresso</h2>
        <p className="text-muted-foreground mt-1 text-sm">{error}</p>
      </div>
    )
  }

  const sessions = getSessions()
  const history = buildSessionHistory(sessions)

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Progresso</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Acompanhe seu desempenho, sessões de estudo e evolução.
        </p>
      </div>

      {/* Métricas */}
      {data && <StudyMetrics data={data} />}

      {/* Sessão de estudo + Meta semanal */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <StudySessionComponent
            disciplineId="general"
            disciplineName="Estudo Geral"
            topicId="general"
            topicName="Sessão Livre"
            objective=""
            onSessionComplete={handleSessionComplete}
          />
        </div>
        <div>
          {data && <GoalTracker goal={data.weeklyGoal} />}
        </div>
      </div>

      {/* Gráfico + Streak */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {data && <ProgressChart data={data.evolution} />}
        </div>
        <div>
          {data && <StudyStreakComponent streak={data.streak} />}
        </div>
      </div>

      {/* Histórico de sessões */}
      <section aria-labelledby="history-heading">
        <h2 id="history-heading" className="mb-4 flex items-center gap-2 text-lg font-semibold tracking-tight">
          <Calendar className="h-5 w-5 text-primary" aria-hidden="true" />
          Histórico de Sessões
        </h2>

        {history.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Clock className="text-muted-foreground h-10 w-10" aria-hidden="true" />
              <p className="text-muted-foreground mt-2 text-sm">
                Nenhuma sessão registrada ainda. Inicie uma sessão de estudo acima.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <ul className="divide-y divide-border" role="list">
                {history.slice(0, 10).map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between px-4 py-3 hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <BookOpen className="text-muted-foreground h-4 w-4" aria-hidden="true" />
                      <div>
                        <p className="text-sm font-medium">{item.activity}</p>
                        <p className="text-muted-foreground text-xs">
                          {new Date(item.date).toLocaleDateString('pt-BR', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'short',
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium">
                        {Math.floor(item.durationMinutes / 60)}h{item.durationMinutes % 60 > 0 ? ` ${item.durationMinutes % 60}min` : ''}
                      </span>
                      <span
                        className={`ml-2 inline-block h-2 w-2 rounded-full ${
                          item.result === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
                        }`}
                        aria-label={item.result === 'completed' ? 'Concluída' : 'Interrompida'}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  )
}

ProgressoPage.displayName = 'ProgressoPage'
