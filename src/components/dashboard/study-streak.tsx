/**
 * StudyStreak — indicador de dias consecutivos de estudo.
 *
 * Exibe streak atual, recorde e última data de estudo.
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/foundation/card'
import { Skeleton } from '@/components/foundation/skeleton'
import { Flame, Trophy, Calendar } from 'lucide-react'
import type { StudyStreak } from '@/types/dashboard'
import { cn } from '@/lib/utils'

export interface StudyStreakProps {
  streak: StudyStreak | null
  isLoading?: boolean
}

export function StudyStreakComponent({
  streak,
  isLoading = false,
}: StudyStreakProps): React.ReactElement {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-24" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16" />
          <Skeleton className="mt-2 h-3 w-32" />
        </CardContent>
      </Card>
    )
  }

  if (!streak) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>Streak de Estudos</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm">
          Comece a estudar hoje para iniciar sua streak!
        </CardContent>
      </Card>
    )
  }

  const isActive = streak.current > 0

  return (
    <Card className={cn('border-l-4', isActive ? 'border-l-orange-500' : 'border-l-muted')}>
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <Flame
          className={cn('h-5 w-5', isActive ? 'text-orange-500' : 'text-muted-foreground')}
          aria-hidden="true"
        />
        <CardTitle className="text-sm font-medium">Streak de Estudos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold">{streak.current}</span>
          <span className="text-muted-foreground mb-1 text-sm">
            dia{streak.current !== 1 ? 's' : ''} consecutivo{streak.current !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="mt-3 space-y-2">
          <div className="text-muted-foreground flex items-center gap-2 text-xs">
            <Trophy className="h-3.5 w-3.5 text-yellow-500" aria-hidden="true" />
            Recorde: <strong className="text-foreground">{streak.longest}</strong> dias
          </div>
          {streak.lastStudyDate && (
            <div className="text-muted-foreground flex items-center gap-2 text-xs">
              <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
              Último estudo:{' '}
              <strong className="text-foreground">
                {new Date(streak.lastStudyDate).toLocaleDateString('pt-BR')}
              </strong>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

StudyStreakComponent.displayName = 'StudyStreak'
