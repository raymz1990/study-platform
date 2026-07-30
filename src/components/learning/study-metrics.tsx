/**
 * StudyMetrics — grid de métricas principais de progresso.
 */

import { Clock, BookOpen, TrendingUp, Target } from 'lucide-react'
import { ProgressCard } from './progress-card'
import type { ProgressData } from '@/types/progress'

export interface StudyMetricsProps {
  data: ProgressData
  isLoading?: boolean
}

export function StudyMetrics({ data, isLoading = false }: StudyMetricsProps): React.ReactElement {
  const hours = Math.floor(data.totalMinutesStudied / 60)
  const minutes = data.totalMinutesStudied % 60
  const hoursStr = hours > 0 ? `${hours}h` : ''
  const minutesStr = minutes > 0 ? `${minutes}min` : ''
  const timeDisplay = `${hoursStr} ${minutesStr}`.trim() || '0min'

  const avgHours = Math.floor(data.averageSessionMinutes / 60)
  const avgMinutes = data.averageSessionMinutes % 60
  const avgStr = avgHours > 0 ? `${avgHours}h ${avgMinutes}min` : `${avgMinutes}min`

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <ProgressCard
        title="Tempo Total"
        value={timeDisplay}
        description={`${data.totalSessions} sessões concluídas`}
        icon={Clock}
        isLoading={isLoading}
      />
      <ProgressCard
        title="Média por Sessão"
        value={avgStr}
        description="Tempo médio de estudo"
        icon={TrendingUp}
        isLoading={isLoading}
      />
      <ProgressCard
        title="Meta Semanal"
        value={`${Math.round((data.weeklyGoal.completedMinutes / data.weeklyGoal.targetMinutes) * 100)}%`}
        description={`${Math.floor(data.weeklyGoal.completedMinutes / 60)}h / ${Math.floor(data.weeklyGoal.targetMinutes / 60)}h`}
        icon={Target}
        iconColor={data.weeklyGoal.completedMinutes >= data.weeklyGoal.targetMinutes ? 'text-green-500' : 'text-blue-500'}
        isLoading={isLoading}
      />
      <ProgressCard
        title="Streak"
        value={data.streak.current}
        description={data.streak.current > 0 ? `${data.streak.longest} dias de recorde` : 'Comece hoje!'}
        icon={BookOpen}
        iconColor={data.streak.current > 0 ? 'text-orange-500' : 'text-muted-foreground'}
        isLoading={isLoading}
      />
    </div>
  )
}

StudyMetrics.displayName = 'StudyMetrics'
