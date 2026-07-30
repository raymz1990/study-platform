/**
 * ExamCountdown — contagem regressiva para a data da prova.
 *
 * Exibe dias, horas e minutos restantes.
 * Atualiza a cada minuto.
 */

import { useEffect, useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/foundation/card'
import { Skeleton } from '@/components/foundation/skeleton'
import { CalendarClock } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ExamCountdownProps {
  examDate: string
  isLoading?: boolean
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
}

function calculateTimeLeft(targetDate: string): TimeLeft {
  const difference = new Date(targetDate).getTime() - Date.now()
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0 }
  }
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
  }
}

function TimeUnit({
  value,
  label,
  isUrgent,
}: {
  value: number
  label: string
  isUrgent: boolean
}): React.ReactElement {
  return (
    <div className="flex flex-col items-center">
      <div
        className={cn(
          'flex h-14 w-14 items-center justify-center rounded-lg text-2xl font-bold',
          isUrgent ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'
        )}
        aria-label={`${value} ${label}`}
      >
        {String(value).padStart(2, '0')}
      </div>
      <span className="text-muted-foreground mt-1 text-xs">{label}</span>
    </div>
  )
}

export function ExamCountdown({
  examDate,
  isLoading = false,
}: ExamCountdownProps): React.ReactElement {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(examDate))

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(examDate))
    }, 60000)
    return () => clearInterval(timer)
  }, [examDate])

  const isUrgent = useMemo(() => timeLeft.days <= 30, [timeLeft.days])
  const formattedDate = useMemo(() => {
    const d = new Date(examDate)
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }, [examDate])

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Skeleton className="h-14 w-14" />
            <Skeleton className="h-14 w-14" />
            <Skeleton className="h-14 w-14" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('border-l-4', isUrgent ? 'border-l-destructive' : 'border-l-primary')}>
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <CalendarClock className="text-muted-foreground h-5 w-5" aria-hidden="true" />
        <CardTitle className="text-sm font-medium">Contagem Regressiva</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center gap-4">
          <TimeUnit value={timeLeft.days} label="dias" isUrgent={isUrgent} />
          <span className="text-muted-foreground text-2xl font-bold">:</span>
          <TimeUnit value={timeLeft.hours} label="horas" isUrgent={isUrgent} />
          <span className="text-muted-foreground text-2xl font-bold">:</span>
          <TimeUnit value={timeLeft.minutes} label="min" isUrgent={isUrgent} />
        </div>
        <p className="text-muted-foreground mt-4 text-center text-xs">
          Prova em <strong className="text-foreground">{formattedDate}</strong>
        </p>
      </CardContent>
    </Card>
  )
}

ExamCountdown.displayName = 'ExamCountdown'
