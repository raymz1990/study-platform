/**
 * useStudyTimer — hook de cronômetro de estudo.
 *
 * Responsabilidade: gerenciar estado do cronômetro e registrar sessão ao finalizar.
 * Não contém regra de negócio — apenas orquestração de estado + session-service.
 */

import { useState, useRef, useCallback, useEffect } from 'react'
import { startSession, endSession } from '@/services/session-service'
import type { StudySession } from '@/types/progress'

export type TimerState = 'idle' | 'running' | 'paused'

export interface UseStudyTimerReturn {
  state: TimerState
  seconds: number
  session: StudySession | null
  start: (disciplineId: string, disciplineName: string, topicId: string, topicName: string, objective: string) => void
  pause: () => void
  resume: () => void
  stop: (status: 'completed' | 'interrupted', notes?: string) => StudySession | null
}

export function useStudyTimer(): UseStudyTimerReturn {
  const [state, setState] = useState<TimerState>('idle')
  const [seconds, setSeconds] = useState(0)
  const [session, setSession] = useState<StudySession | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const pausedAtRef = useRef<number>(0)

  // Limpa o intervalo ao desmontar
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const startTimer = useCallback(() => {
    clearTimer()
    intervalRef.current = setInterval(() => {
      setSeconds((prev) => prev + 1)
    }, 1000)
  }, [clearTimer])

  const start = useCallback(
    (
      disciplineId: string,
      disciplineName: string,
      topicId: string,
      topicName: string,
      objective: string
    ) => {
      const newSession = startSession(disciplineId, disciplineName, topicId, topicName, objective)
      setSession(newSession)
      setSeconds(0)
      setState('running')
      startTimer()
    },
    [startTimer]
  )

  const pause = useCallback(() => {
    if (state !== 'running') return
    clearTimer()
    pausedAtRef.current = seconds
    setState('paused')
  }, [state, seconds, clearTimer])

  const resume = useCallback(() => {
    if (state !== 'paused') return
    setState('running')
    startTimer()
  }, [state, startTimer])

  const stop = useCallback(
    (status: 'completed' | 'interrupted', notes?: string) => {
      clearTimer()
      setState('idle')

      if (!session) return null

      const ended = endSession(session.id, status, notes)
      if (ended) {
        setSession(null)
        setSeconds(0)
      }
      return ended
    },
    [session, clearTimer]
  )

  return {
    state,
    seconds,
    session,
    start,
    pause,
    resume,
    stop,
  }
}
