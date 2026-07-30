/**
 * StudySettings — Configuração de horas de estudo diárias e semanais.
 */

import { Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { DailyStudySchedule, WeekdayKey } from '@/types/settings'

const WEEKDAYS: { key: WeekdayKey; label: string }[] = [
  { key: 'monday', label: 'Segunda' },
  { key: 'tuesday', label: 'Terça' },
  { key: 'wednesday', label: 'Quarta' },
  { key: 'thursday', label: 'Quinta' },
  { key: 'friday', label: 'Sexta' },
  { key: 'saturday', label: 'Sábado' },
  { key: 'sunday', label: 'Domingo' },
]

function minutesToHours(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (m === 0) return `${h}h`
  return `${h}h${String(m).padStart(2, '0')}`
}

interface StudySettingsProps {
  schedule: DailyStudySchedule
  weeklyTarget: number
  onScheduleChange: (day: WeekdayKey, minutes: number) => void
  onWeeklyTargetChange: (minutes: number) => void
  errors?: Record<string, string>
}

export function StudySettings({
  schedule,
  weeklyTarget,
  onScheduleChange,
  onWeeklyTargetChange,
  errors,
}: StudySettingsProps) {
  const totalDaily = (Object.values(schedule) as number[]).reduce((sum, m) => sum + m, 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <h3 className="text-sm font-medium">Rotina de Estudo</h3>
      </div>

      {/* Dias da semana */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {WEEKDAYS.map((day) => {
          const hasError = errors?.[`dailyStudyMinutes.${day.key}`]

          return (
            <div key={day.key} className="space-y-1">
              <label
                htmlFor={`study-${day.key}`}
                className="block text-xs font-medium text-muted-foreground"
              >
                {day.label}
              </label>
              <input
                id={`study-${day.key}`}
                type="number"
                min={0}
                max={960}
                step={15}
                value={schedule[day.key]}
                onChange={(e) => onScheduleChange(day.key, Number(e.target.value))}
                className={cn(
                  'h-9 w-full rounded-md border bg-background px-2 text-sm',
                  'focus:outline-none focus:ring-2 focus:ring-primary',
                  hasError && 'border-destructive'
                )}
                aria-invalid={hasError ? 'true' : 'false'}
              />
              <p className="text-[10px] text-muted-foreground">{minutesToHours(schedule[day.key])}</p>
              {hasError && <p className="text-[10px] text-destructive">{hasError}</p>}
            </div>
          )
        })}
      </div>

      {/* Resumo */}
      <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2 text-sm">
        <span className="text-muted-foreground">Total semanal (soma dos dias):</span>
        <span className={cn('font-semibold', totalDaily !== weeklyTarget && 'text-warning')}>
          {minutesToHours(totalDaily)}
        </span>
      </div>

      {/* Meta semanal */}
      <div className="space-y-1">
        <label htmlFor="weekly-target" className="block text-sm font-medium">
          Meta semanal (minutos)
        </label>
        <input
          id="weekly-target"
          type="number"
          min={60}
          max={960}
          step={15}
          value={weeklyTarget}
          onChange={(e) => onWeeklyTargetChange(Number(e.target.value))}
          className={cn(
            'h-9 w-full rounded-md border bg-background px-3 text-sm sm:w-48',
            'focus:outline-none focus:ring-2 focus:ring-primary',
            errors?.weeklyTargetMinutes && 'border-destructive'
          )}
          aria-invalid={errors?.weeklyTargetMinutes ? 'true' : 'false'}
        />
        {errors?.weeklyTargetMinutes && (
          <p className="text-xs text-destructive">{errors.weeklyTargetMinutes}</p>
        )}
      </div>
    </div>
  )
}
