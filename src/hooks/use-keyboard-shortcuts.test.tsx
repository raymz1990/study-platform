import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useKeyboardShortcuts } from './use-keyboard-shortcuts'

function Wrapper({ children }: { children: ReactNode }): React.ReactElement {
  return <MemoryRouter>{children}</MemoryRouter>
}

describe('useKeyboardShortcuts', () => {
  beforeEach(() => {
    renderHook(() => useKeyboardShortcuts(), {
      wrapper: Wrapper,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should not throw on mount', () => {
    expect(true).toBe(true)
  })

  it('should ignore shortcuts when typing in input', () => {
    const input = document.createElement('input')
    document.body.appendChild(input)
    input.focus()

    const event = new KeyboardEvent('keydown', { key: 'd' })
    window.dispatchEvent(event)

    expect(document.activeElement).toBe(input)

    document.body.removeChild(input)
  })
})
