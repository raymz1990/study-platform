import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { SidebarProvider, useSidebar } from '@/contexts/sidebar-context'

const STORAGE_KEY = 'cap-sidebar'

/** Mock window.matchMedia for jsdom. */
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

describe('useSidebar', () => {
  beforeEach(() => {
    localStorage.clear()
    mockMatchMedia(true)
  })

  afterEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('should default to open', () => {
    const { result } = renderHook(() => useSidebar(), {
      wrapper: SidebarProvider,
    })
    expect(result.current.isOpen).toBe(true)
    expect(result.current.width).toBe('16rem')
  })

  it('should toggle sidebar state', () => {
    const { result } = renderHook(() => useSidebar(), {
      wrapper: SidebarProvider,
    })

    act(() => {
      result.current.toggle()
    })

    expect(result.current.isOpen).toBe(false)
    expect(result.current.width).toBe('4rem')
    expect(localStorage.getItem(STORAGE_KEY)).toBe('false')

    act(() => {
      result.current.toggle()
    })

    expect(result.current.isOpen).toBe(true)
    expect(result.current.width).toBe('16rem')
    expect(localStorage.getItem(STORAGE_KEY)).toBe('true')
  })

  it('should restore state from localStorage', () => {
    localStorage.setItem(STORAGE_KEY, 'false')

    const { result } = renderHook(() => useSidebar(), {
      wrapper: SidebarProvider,
    })
    expect(result.current.isOpen).toBe(false)
  })

  it('should toggle mobile drawer', () => {
    const { result } = renderHook(() => useSidebar(), {
      wrapper: SidebarProvider,
    })

    expect(result.current.isMobileOpen).toBe(false)

    act(() => {
      result.current.toggleMobile()
    })

    expect(result.current.isMobileOpen).toBe(true)

    act(() => {
      result.current.closeMobile()
    })

    expect(result.current.isMobileOpen).toBe(false)
  })
})
