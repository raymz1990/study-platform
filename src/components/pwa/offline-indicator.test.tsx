import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { OfflineIndicator } from './offline-indicator'
import { onOfflineChange } from '@/services/pwa-service'

vi.mock('@/services/pwa-service', () => ({
  onOfflineChange: vi.fn(),
}))

describe('OfflineIndicator', () => {
  let offlineHandlers: Array<(offline: boolean) => void> = []

  beforeEach(() => {
    offlineHandlers = []
    vi.mocked(onOfflineChange).mockImplementation((handler: (offline: boolean) => void) => {
      offlineHandlers.push(handler)
      // Notifica estado inicial (online)
      handler(false)
      return () => {
        offlineHandlers = offlineHandlers.filter((h) => h !== handler)
      }
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('não renderiza quando online', () => {
    render(<OfflineIndicator />)
    expect(screen.queryByText('Você está offline')).not.toBeInTheDocument()
  })

  it('renderiza quando fica offline', async () => {
    render(<OfflineIndicator />)
    // Simula mudança para offline
    await act(async () => {
      offlineHandlers.forEach((handler) => handler(true))
    })
    expect(screen.getByText('Você está offline')).toBeInTheDocument()
  })

  it('tem role status e aria-live', async () => {
    render(<OfflineIndicator />)
    await act(async () => {
      offlineHandlers.forEach((handler) => handler(true))
    })
    const indicator = screen.getByRole('status')
    expect(indicator).toHaveAttribute('aria-live', 'polite')
  })

  it('esconde quando volta online', async () => {
    render(<OfflineIndicator />)
    await act(async () => {
      offlineHandlers.forEach((handler) => handler(true))
    })
    expect(screen.getByText('Você está offline')).toBeInTheDocument()

    await act(async () => {
      offlineHandlers.forEach((handler) => handler(false))
    })
    expect(screen.queryByText('Você está offline')).not.toBeInTheDocument()
  })
})
