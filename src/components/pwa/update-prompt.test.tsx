import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { UpdatePrompt } from './update-prompt'
import { onUpdateAvailable, applyUpdate } from '@/services/pwa-service'

vi.mock('@/services/pwa-service', () => ({
  onUpdateAvailable: vi.fn(),
  applyUpdate: vi.fn(),
}))

describe('UpdatePrompt', () => {
  let updateHandlers: Array<() => void> = []

  beforeEach(() => {
    updateHandlers = []
    vi.mocked(onUpdateAvailable).mockImplementation((handler: () => void) => {
      updateHandlers.push(handler)
      return () => {
        updateHandlers = updateHandlers.filter((h) => h !== handler)
      }
    })
    vi.mocked(applyUpdate).mockResolvedValue(undefined)
    // Mock window.location.reload
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { reload: vi.fn() },
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('não renderiza inicialmente', () => {
    render(<UpdatePrompt />)
    expect(screen.queryByText('Nova versão disponível')).not.toBeInTheDocument()
  })

  it('renderiza quando update está disponível', async () => {
    render(<UpdatePrompt />)
    await act(async () => {
      updateHandlers.forEach((handler) => handler())
    })
    expect(screen.getByText('Nova versão disponível')).toBeInTheDocument()
  })

  it('tem role alert e aria-live', async () => {
    render(<UpdatePrompt />)
    await act(async () => {
      updateHandlers.forEach((handler) => handler())
    })
    const alert = screen.getByRole('alert')
    expect(alert).toHaveAttribute('aria-live', 'polite')
  })

  it('dispensar esconde o prompt', async () => {
    render(<UpdatePrompt />)
    await act(async () => {
      updateHandlers.forEach((handler) => handler())
    })
    expect(screen.getByText('Nova versão disponível')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Depois'))
    expect(screen.queryByText('Nova versão disponível')).not.toBeInTheDocument()
  })

  it('botão fechar esconde o prompt', async () => {
    render(<UpdatePrompt />)
    await act(async () => {
      updateHandlers.forEach((handler) => handler())
    })

    const closeButton = screen.getByLabelText('Fechar notificação')
    fireEvent.click(closeButton)
    expect(screen.queryByText('Nova versão disponível')).not.toBeInTheDocument()
  })

  it('atualizar agora chama applyUpdate e reload', async () => {
    render(<UpdatePrompt />)
    await act(async () => {
      updateHandlers.forEach((handler) => handler())
    })

    fireEvent.click(screen.getByText('Atualizar agora'))

    await waitFor(() => {
      expect(applyUpdate).toHaveBeenCalled()
    })
    expect(window.location.reload).toHaveBeenCalled()
  })
})
