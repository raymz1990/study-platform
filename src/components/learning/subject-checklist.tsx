/**
 * SubjectChecklist — checklist de tópicos de uma disciplina.
 *
 * Requisitos:
 * - Lista todos os capítulos de todos os módulos.
 * - Checkbox interativo (marca/desmarca).
 * - Persistência via callback (o pai decide como persistir).
 * - Acessibilidade: labels associados aos checkboxes.
 */

import { useCallback } from 'react'
import { Check, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Module } from '@/types/discipline'

export interface SubjectChecklistProps {
  modules: Module[]
  checkedIds: Set<string>
  onToggle: (chapterId: string, checked: boolean) => void
}

function CheckItem({
  chapterId,
  title,
  checked,
  onToggle,
}: {
  chapterId: string
  title: string
  checked: boolean
  onToggle: (id: string, checked: boolean) => void
}): React.ReactElement {
  const handleClick = useCallback(() => {
    onToggle(chapterId, !checked)
  }, [chapterId, checked, onToggle])

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors',
        checked
          ? 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/50'
          : 'border-border bg-card hover:bg-accent/50'
      )}
      aria-pressed={checked}
    >
      <span
        className={cn(
          'flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors',
          checked
            ? 'border-green-500 bg-green-500 text-white'
            : 'border-muted-foreground/30 bg-background'
        )}
        aria-hidden="true"
      >
        {checked ? <Check className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5 text-muted-foreground" />}
      </span>
      <span className={cn('text-sm', checked && 'line-through text-muted-foreground')}>{title}</span>
    </button>
  )
}

export function SubjectChecklist({ modules, checkedIds, onToggle }: SubjectChecklistProps): React.ReactElement {
  return (
    <div className="space-y-6">
      {modules.map((module) => (
        <section key={module.id} aria-labelledby={`checklist-module-${module.id}`}>
          <h4
            id={`checklist-module-${module.id}`}
            className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            {module.name}
          </h4>
          <div className="space-y-2">
            {module.chapters.map((chapter) => (
              <CheckItem
                key={chapter.id}
                chapterId={chapter.id}
                title={chapter.title}
                checked={checkedIds.has(chapter.id)}
                onToggle={onToggle}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

SubjectChecklist.displayName = 'SubjectChecklist'
