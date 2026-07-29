import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useBreadcrumbs } from './use-breadcrumbs'

function Wrapper({ children, path }: { children: ReactNode; path: string }): React.ReactElement {
  return <MemoryRouter initialEntries={[path]}>{children}</MemoryRouter>
}

describe('useBreadcrumbs', () => {
  it('should return only Dashboard for root path', () => {
    const { result } = renderHook(() => useBreadcrumbs(), {
      wrapper: ({ children }) => <Wrapper path="/">{children}</Wrapper>,
    })

    expect(result.current).toEqual([{ label: 'Dashboard', path: '/' }])
  })

  it('should build breadcrumbs for nested route', () => {
    const { result } = renderHook(() => useBreadcrumbs(), {
      wrapper: ({ children }) => <Wrapper path="/disciplinas/123">{children}</Wrapper>,
    })

    expect(result.current).toEqual([
      { label: 'Dashboard', path: '/' },
      { label: 'Disciplinas', path: '/disciplinas' },
      { label: '123' },
    ])
  })

  it('should build breadcrumbs for /questoes', () => {
    const { result } = renderHook(() => useBreadcrumbs(), {
      wrapper: ({ children }) => <Wrapper path="/questoes">{children}</Wrapper>,
    })

    expect(result.current).toEqual([
      { label: 'Dashboard', path: '/' },
      { label: 'Questões' },
    ])
  })
})
