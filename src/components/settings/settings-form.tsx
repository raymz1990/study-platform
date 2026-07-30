/**
 * SettingsForm — Formulário principal de configurações.
 *
 * Orquestra ThemeSettings, StudySettings e ExamSettings.
 * Persistência via settings-service. Feedback visual em salvamento.
 */

import { useState, useCallback, useEffect } from 'react'
import { Save, RotateCcw, CheckCircle } from 'lucide-react'
import { Button } from '@/components/foundation/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/foundation/card'
import { ThemeSettings } from './theme-settings'
import { StudySettings } from './study-settings'
import { ExamSettings } from './exam-settings'
import { useTheme } from '@/hooks/use-theme'
import {
  loadSettings,
  saveSettings,
  resetToDefaults,
} from '@/services/settings-service'
import type { UserSettings, ThemePreference, WeekdayKey } from '@/types/settings'

export function SettingsForm(): React.ReactElement {
  const { theme, setTheme } = useTheme()

  const [settings, setSettings] = useState<UserSettings>(() => loadSettings())
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saved, setSaved] = useState(false)
  const [isResetting, setIsResetting] = useState(false)

  // Sincroniza tema do form com o tema global quando o form é carregado
  useEffect(() => {
    setSettings((prev) => ({ ...prev, theme }))
  }, [theme])

  const handleThemeChange = useCallback(
    (nextTheme: ThemePreference) => {
      setTheme(nextTheme)
      setSettings((prev) => ({ ...prev, theme: nextTheme }))
    },
    [setTheme]
  )

  const handleScheduleChange = useCallback((day: WeekdayKey, minutes: number) => {
    setSettings((prev) => ({
      ...prev,
      dailyStudyMinutes: { ...prev.dailyStudyMinutes, [day]: minutes },
    }))
  }, [])

  const handleWeeklyTargetChange = useCallback((minutes: number) => {
    setSettings((prev) => ({ ...prev, weeklyTargetMinutes: minutes }))
  }, [])

  const handleExamDateChange = useCallback((date: string) => {
    setSettings((prev) => ({ ...prev, examDate: date }))
  }, [])

  const handleStudyGoalChange = useCallback((goal: string) => {
    setSettings((prev) => ({ ...prev, studyGoal: goal }))
  }, [])

  const handleSave = useCallback(() => {
    const validationErrors = saveSettings({
      theme: settings.theme,
      dailyStudyMinutes: settings.dailyStudyMinutes,
      weeklyTargetMinutes: settings.weeklyTargetMinutes,
      studyGoal: settings.studyGoal,
      examDate: settings.examDate,
      notificationsEnabled: settings.notificationsEnabled,
    })

    if (validationErrors.length > 0) {
      const map: Record<string, string> = {}
      for (const e of validationErrors) {
        map[e.field] = e.message
      }
      setErrors(map)
      setSaved(false)
      return
    }

    setErrors({})
    setSaved(true)
    const timer = setTimeout(() => setSaved(false), 3000)
    return () => clearTimeout(timer)
  }, [settings])

  const handleReset = useCallback(() => {
    setIsResetting(true)
    resetToDefaults()
    const fresh = loadSettings()
    setSettings(fresh)
    setTheme(fresh.theme)
    setErrors({})
    setSaved(true)
    const timer = setTimeout(() => {
      setSaved(false)
      setIsResetting(false)
    }, 3000)
    return () => clearTimeout(timer)
  }, [setTheme])

  return (
    <div className="space-y-6">
      {/* Feedback de salvamento */}
      {saved && (
        <div className="flex items-center gap-2 rounded-lg bg-green-100 px-4 py-3 text-sm text-green-800 dark:bg-green-900/30 dark:text-green-300">
          <CheckCircle className="h-4 w-4" aria-hidden="true" />
          Configurações salvas com sucesso.
        </div>
      )}

      {/* Tema */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Aparência</CardTitle>
        </CardHeader>
        <CardContent>
          <ThemeSettings value={settings.theme} onChange={handleThemeChange} />
        </CardContent>
      </Card>

      {/* Estudo */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Rotina de Estudo</CardTitle>
        </CardHeader>
        <CardContent>
          <StudySettings
            schedule={settings.dailyStudyMinutes}
            weeklyTarget={settings.weeklyTargetMinutes}
            onScheduleChange={handleScheduleChange}
            onWeeklyTargetChange={handleWeeklyTargetChange}
            errors={errors}
          />
        </CardContent>
      </Card>

      {/* Prova e Objetivo */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Prova e Objetivo</CardTitle>
        </CardHeader>
        <CardContent>
          <ExamSettings
            examDate={settings.examDate}
            studyGoal={settings.studyGoal}
            onExamDateChange={handleExamDateChange}
            onStudyGoalChange={handleStudyGoalChange}
            errors={errors}
          />
        </CardContent>
      </Card>

      {/* Ações */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="outline" onClick={handleReset} disabled={isResetting} className="gap-2">
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Restaurar padrões
        </Button>

        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" aria-hidden="true" />
          Salvar configurações
        </Button>
      </div>
    </div>
  )
}
