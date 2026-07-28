import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

export type Theme = 'light' | 'dark' | 'system'

export interface ThemeContextValue {
  theme: Theme
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const STORAGE_KEY = 'cap-theme'

export const ThemeContext = createContext<ThemeContextValue | null>(null)

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function resolveTheme(theme: Theme): 'light' | 'dark' {
  return theme === 'system' ? getSystemTheme() : theme
}

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'system'
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark' || stored === 'system') return stored
  return 'system'
}

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps): React.ReactElement {
  const [theme, setThemeState] = useState<Theme>(() => getInitialTheme())
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() =>
    resolveTheme(getInitialTheme())
  )

  const applyTheme = useCallback((nextTheme: Theme) => {
    const resolved = resolveTheme(nextTheme)
    setResolvedTheme(resolved)

    const root = document.documentElement
    if (resolved === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [])

  const setTheme = useCallback(
    (nextTheme: Theme) => {
      setThemeState(nextTheme)
      localStorage.setItem(STORAGE_KEY, nextTheme)
      applyTheme(nextTheme)
    },
    [applyTheme]
  )

  const toggleTheme = useCallback(() => {
    const next = resolvedTheme === 'light' ? 'dark' : 'light'
    setTheme(next)
  }, [resolvedTheme, setTheme])

  useEffect(() => {
    applyTheme(theme)
  }, [applyTheme, theme])

  useEffect(() => {
    if (theme !== 'system') return

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      applyTheme('system')
    }
    media.addEventListener('change', handler)
    return () => media.removeEventListener('change', handler)
  }, [applyTheme, theme])

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

/** Hook para acessar e controlar o tema da aplicação. */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)

  if (context === null) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return context
}
