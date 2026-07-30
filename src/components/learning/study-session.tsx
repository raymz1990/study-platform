/**
 * StudySession — cronômetro de sessão de estudo com controles.
 *
 * Estados: idle → running → paused → completed/interrupted.
 */

import { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/foundation/card'
import { Button } from '@/components/foundation/button'
import {
  Play,
  Pause,
  Square,
  RotateCcw,
  CheckCircle2,
  Timer,
  BookOpen,
} from 'lucide-react'
import { useStudyTimer } from '@/hooks/use-study-timer'
import { cn } from '@/lib/utils'

function formatTime(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export interface StudySessionProps {
  disciplineId: string
  disciplineName: string
  topicId: string
  topicName: string
  objective?: string
  onSessionComplete?: () => void
}

export function StudySessionComponent({
  disciplineId,
  disciplineName,
  topicId,
  topicName,
  objective: initialObjective,
  onSessionComplete,
}: StudySessionProps): React.ReactElement {
  const { state, seconds, start, pause, resume, stop } = useStudyTimer()
  const [objective, setObjective] = useState(initialObjective || '')
  const [feedback, setFeedback] = useState<string | null>(null)

  const handleStart = useCallback(() => {
    const obj = objective.trim() || `${disciplineName} — ${topicName}`
    setObjective(obj)
    start(disciplineId, disciplineName, topicId, topicName, obj)
  }, [disciplineId, disciplineName, topicId, topicName, objective, start])

  const handleStop = useCallback(
    (status: 'completed' | 'interrupted') => {
      const result = stop(status)
      if (result) {
        const mins = result.durationMinutes
        setFeedback(
          status === 'completed'
            ? `Sessão registrada: ${mins} minutos de estudo.`
            : 'Sessão interrompida.'
        )
        onSessionComplete?.()
        setTimeout(() => setFeedback(null), 4000)
      }
    },
    [stop, onSessionComplete]
  )

  const isIdle = state === 'idle'
  const isRunning = state === 'running'
  const isPaused = state === 'paused'

  return (
    <Card className={cn('border-l-4', isRunning ? 'border-l-green-500' : 'border-l-muted')}>
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <Timer
          className={cn(
            'h-5 w-5',
            isRunning ? 'text-green-500' : isPaused ? 'text-yellow-500' : 'text-muted-foreground'
          )}
          aria-hidden="true"
        />
        <CardTitle className="text-sm font-medium">
          {isIdle ? 'Nova Sessão de Estudo' : isRunning ? 'Estudando...' : 'Pausado'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Objetivo */}
        {isIdle && (
          <div className="space-y-2">
            <label htmlFor="objective" className="text-muted-foreground text-sm">
              Objetivo da sessão
            </label>
            <input
              id="objective"
              type="text"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder={`${disciplineName} — ${topicName}`}
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        )}

        {!isIdle && (
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            <span className="truncate">{objective || `${disciplineName} — ${topicName}`}</span>
          </div>
        )}

        {/* Cronômetro */}
        <div className="flex items-center justify-center py-4">
          <div
            className={cn(
              'font-mono text-5xl font-bold tracking-wider tabular-nums',
              isRunning ? 'text-green-600 dark:text-green-400' : 'text-foreground'
            )}
            aria-live="polite"
            aria-atomic="true"
          >
            {formatTime(seconds)}
          </div>
        </div>

        {/* Controles */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {isIdle && (
            <Button onClick={handleStart} className="gap-2">
              <Play className="h-4 w-4" aria-hidden="true" />
              Iniciar
            </Button>
          )}

          {isRunning && (
            <>
              <Button variant="outline" onClick={pause} className="gap-2">
                <Pause className="h-4 w-4" aria-hidden="true" />
                Pausar
              </Button>
              <Button variant="primary" onClick={() => handleStop('completed')} className="gap-2 bg-green-600 hover:bg-green-700">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                Finalizar
              </Button>
              <Button variant="danger" onClick={() => handleStop('interrupted')} className="gap-2">
                <Square className="h-4 w-4" aria-hidden="true" />
                Interromper
              </Button>
            </>
          )}

          {isPaused && (
            <>
              <Button onClick={resume} className="gap-2">
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Retomar
              </Button>
              <Button variant="primary" onClick={() => handleStop('completed')} className="gap-2 bg-green-600 hover:bg-green-700">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                Finalizar
              </Button>
              <Button variant="danger" onClick={() => handleStop('interrupted')} className="gap-2">
                <Square className="h-4 w-4" aria-hidden="true" />
                Interromper
              </Button>
            </>
          )}
        </div>

        {/* Feedback */}
        {feedback && (
          <div
            className={cn(
              'rounded-md px-4 py-2 text-center text-sm font-medium',
              feedback.includes('registrada')
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
            )}
            role="status"
            aria-live="polite"
          >
            {feedback}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

StudySessionComponent.displayName = 'StudySessionComponent'
