/**
 * ExamSettings — Configuração da data da prova e objetivo.
 */

import { Calendar, Target } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ExamSettingsProps {
  examDate: string
  studyGoal: string
  onExamDateChange: (date: string) => void
  onStudyGoalChange: (goal: string) => void
  errors?: Record<string, string>
}

export function ExamSettings({
  examDate,
  studyGoal,
  onExamDateChange,
  onStudyGoalChange,
  errors,
}: ExamSettingsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <h3 className="text-sm font-medium">Prova e Objetivo</h3>
      </div>

      {/* Data da prova */}
      <div className="space-y-1">
        <label htmlFor="exam-date" className="block text-sm font-medium">
          Data da prova
        </label>
        <input
          id="exam-date"
          type="date"
          value={examDate}
          onChange={(e) => onExamDateChange(e.target.value)}
          className={cn(
            'h-9 rounded-md border bg-background px-3 text-sm',
            'focus:outline-none focus:ring-2 focus:ring-primary',
            errors?.examDate && 'border-destructive'
          )}
          aria-invalid={errors?.examDate ? 'true' : 'false'}
        />
        {errors?.examDate && <p className="text-xs text-destructive">{errors.examDate}</p>}
      </div>

      {/* Objetivo */}
      <div className="space-y-1">
        <label htmlFor="study-goal" className="block text-sm font-medium">
          Objetivo de estudo
        </label>
        <div className="relative">
          <Target
            className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground"
            aria-hidden="true"
          />
          <textarea
            id="study-goal"
            rows={3}
            maxLength={500}
            value={studyGoal}
            onChange={(e) => onStudyGoalChange(e.target.value)}
            placeholder="Descreva seu objetivo..."
            className={cn(
              'w-full rounded-md border bg-background py-2.5 pl-9 pr-3 text-sm',
              'focus:outline-none focus:ring-2 focus:ring-primary',
              errors?.studyGoal && 'border-destructive'
            )}
          />
        </div>
        <div className="flex justify-between">
          {errors?.studyGoal && <p className="text-xs text-destructive">{errors.studyGoal}</p>}
          <p className="ml-auto text-xs text-muted-foreground">{studyGoal.length}/500</p>
        </div>
      </div>
    </div>
  )
}
