import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ExamCountdown } from './exam-countdown'
import { ThemeProvider } from '@/contexts/theme-context'

function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

function Wrapper({ children }: { children: React.ReactNode }): React.ReactElement {
  return <ThemeProvider>{children}</ThemeProvider>
}

describe('ExamCountdown', () => {
  beforeEach(() => {
    mockMatchMedia(false)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renderiza contagem regressiva para 11/10/2026', () => {
    const now = new Date('2026-07-28T03:00:00Z')
    vi.useFakeTimers()
    vi.setSystemTime(now)

    render(<ExamCountdown examDate="2026-10-11" />, { wrapper: Wrapper })

    expect(screen.getByText('Contagem Regressiva')).toBeTruthy()
    expect(document.body.textContent).toContain('dias')
    expect(document.body.textContent).toContain('horas')
    expect(document.body.textContent).toContain('min')
  })

  it('exibe estado de loading corretamente', () => {
    render(<ExamCountdown examDate="2026-10-11" isLoading />, { wrapper: Wrapper })

    // Skeletons são renderizados com aria-hidden="true"
    expect(document.querySelectorAll('[aria-hidden="true"]').length).toBeGreaterThan(0)
  })

  it('mostra data formatada da prova', () => {
    const now = new Date('2026-07-28T03:00:00Z')
    vi.useFakeTimers()
    vi.setSystemTime(now)

    render(<ExamCountdown examDate="2026-10-11" />, { wrapper: Wrapper })

    expect(screen.getByText(/Prova em/)).toBeTruthy()
  })
})
