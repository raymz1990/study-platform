/**
 * Tests — useStudyTimer.ts
 *
 * Cobertura: iniciar, pausar, retomar, finalizar.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useStudyTimer } from '@/hooks/use-study-timer'
import type { StudySession } from '@/types/progress'

function mockLocalStorage() {
  const store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value }),
    removeItem: vi.fn((key: string) => { Reflect.deleteProperty(store, key) }),
    clear: vi.fn(() => { Object.keys(store).forEach((k) => Reflect.deleteProperty(store, k)) }),
  }
}

beforeEach(() => {
  const ls = mockLocalStorage()
  Object.defineProperty(global, 'localStorage', { value: ls, writable: true })
  vi.useFakeTimers({ shouldAdvanceTime: true })
})

afterEach(() => {
  vi.useRealTimers()
})

describe('useStudyTimer', () => {
  it('inicia em estado idle', () => {
    const { result } = renderHook(() => useStudyTimer())
    expect(result.current.state).toBe('idle')
    expect(result.current.seconds).toBe(0)
    expect(result.current.session).toBeNull()
  })

  it('inicia cronômetro e conta segundos', async () => {
    const { result } = renderHook(() => useStudyTimer())

    act(() => {
      result.current.start('disc_portugues', 'LP', 'chap_01', 'Morfologia', 'Estudo')
    })

    expect(result.current.state).toBe('running')
    expect(result.current.session).not.toBeNull()

    act(() => {
      vi.advanceTimersByTime(3000)
    })

    await waitFor(() => {
      expect(result.current.seconds).toBeGreaterThanOrEqual(3)
    })
  })

  it('pausa e retoma o cronômetro', async () => {
    const { result } = renderHook(() => useStudyTimer())

    act(() => {
      result.current.start('disc_portugues', 'LP', 'chap_01', 'Morfologia', 'Estudo')
    })

    act(() => {
      vi.advanceTimersByTime(5000)
    })

    await waitFor(() => {
      expect(result.current.seconds).toBeGreaterThanOrEqual(5)
    })

    act(() => {
      result.current.pause()
    })

    expect(result.current.state).toBe('paused')

    const pausedSeconds = result.current.seconds

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    // Não deve incrementar enquanto pausado
    expect(result.current.seconds).toBe(pausedSeconds)

    act(() => {
      result.current.resume()
    })

    expect(result.current.state).toBe('running')

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    await waitFor(() => {
      expect(result.current.seconds).toBeGreaterThan(pausedSeconds)
    })
  })

  it('finaliza sessão com status completed', () => {
    const { result } = renderHook(() => useStudyTimer())

    act(() => {
      result.current.start('disc_portugues', 'LP', 'chap_01', 'Morfologia', 'Estudo')
    })

    const ref = { session: null as StudySession | null }
    act(() => {
      ref.session = result.current.stop('completed', 'Bom estudo')
    })

    expect(result.current.state).toBe('idle')
    expect(result.current.session).toBeNull()
    if (ref.session) {
      expect(ref.session.status).toBe('completed')
      expect(ref.session.notes).toBe('Bom estudo')
    }
  })

  it('interrompe sessão com status interrupted', () => {
    const { result } = renderHook(() => useStudyTimer())

    act(() => {
      result.current.start('disc_portugues', 'LP', 'chap_01', 'Morfologia', 'Estudo')
    })

    const ref = { session: null as StudySession | null }
    act(() => {
      ref.session = result.current.stop('interrupted')
    })

    expect(result.current.state).toBe('idle')
    if (ref.session) {
      expect(ref.session.status).toBe('interrupted')
    }
  })

  it('não inicia nova sessão sem chamar start', () => {
    const { result } = renderHook(() => useStudyTimer())

    const ref = { session: null as StudySession | null }
    act(() => {
      ref.session = result.current.stop('completed')
    })

    expect(ref.session).toBeNull()
  })
})
