/**
 * ThemeSettings — Seleção de tema claro/escuro/sistema.
 */

import { Sun, Moon, Monitor } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ThemePreference } from '@/types/settings'

const OPTIONS: { value: ThemePreference; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Claro', icon: Sun },
  { value: 'dark', label: 'Escuro', icon: Moon },
  { value: 'system', label: 'Sistema', icon: Monitor },
]

interface ThemeSettingsProps {
  value: ThemePreference
  onChange: (theme: ThemePreference) => void
}

export function ThemeSettings({ value, onChange }: ThemeSettingsProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Tema</h3>
      <div className="flex gap-2">
        {OPTIONS.map((option) => {
          const Icon = option.icon
          const isActive = value === option.value

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={cn(
                'flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                isActive
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-background hover:bg-accent hover:text-accent-foreground'
              )}
              aria-pressed={isActive}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
