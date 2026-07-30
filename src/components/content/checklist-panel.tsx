/**
 * ChecklistPanel — checklist final interativo do capítulo.
 *
 * Persistência: localStorage (schema v2.2 do planner-service).
 * Cada item é uma tarefa concluída com taskId estável.
 */

import { useCallback, useState, useEffect } from 'react'
import { CheckSquare, Square } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/foundation/card'
import { loadProgress, saveProgress } from '@/services/planner-service'
import { toISODate } from '@/utils/date'
import type { ProgressSnapshot } from '@/types/planner'

export interface ChecklistPanelProps {
  /** ID da disciplina (ex: disc_portugues). */
  disciplineId: string
  /** ID do capítulo (ex: chap_morfologia). */
  chapterId: string
  /** Nome legível da disciplina. */
  disciplineName: string
  /** Nome legível do capítulo. */
  chapterName: string
  /** Itens do checklist (vindo do markdown ou padrão). */
  items: string[]
}

function buildChecklistStorageKey(disciplineId: string, chapterId: string): string {
  return `cap.checklist.${disciplineId}.${chapterId}`
}

export function ChecklistPanel({
  disciplineId,
  chapterId,
  disciplineName,
  chapterName,
  items,
}: ChecklistPanelProps): React.ReactElement {
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set())

  // Carrega estado persistido
  useEffect(() => {
    const key = buildChecklistStorageKey(disciplineId, chapterId)
    try {
      const raw = localStorage.getItem(key)
      if (raw) {
        const parsed = JSON.parse(raw) as string[]
        setCheckedIds(new Set(parsed))
      }
    } catch {
      // Ignora corrupção silenciosamente
    }
  }, [disciplineId, chapterId])

  const toggle = useCallback(
    (itemId: string) => {
      setCheckedIds((prev) => {
        const next = new Set(prev)
        const isChecking = !next.has(itemId)

        if (isChecking) {
          next.add(itemId)
        } else {
          next.delete(itemId)
        }

        // Persiste no localStorage específico do checklist
        const key = buildChecklistStorageKey(disciplineId, chapterId)
        localStorage.setItem(key, JSON.stringify([...next]))

        // Também registra no progresso geral como tarefa concluída (schema v2)
        const progress: ProgressSnapshot = loadProgress()
        const taskId = `checklist_${disciplineId}_${chapterId}_${itemId}`

        if (isChecking) {
          const already = progress.completedTasks.some((t) => t.taskId === taskId)
          if (!already) {
            progress.completedTasks.push({
              taskId,
              completedDate: toISODate(new Date()),
              disciplineId,
              disciplineName,
              topicId: chapterId,
              topicName: chapterName,
            })
            saveProgress(progress)
          }
        } else {
          progress.completedTasks = progress.completedTasks.filter((t) => t.taskId !== taskId)
          saveProgress(progress)
        }

        return next
      })
    },
    [disciplineId, chapterId, disciplineName, chapterName]
  )

  return (
    <Card className="my-8">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <CheckSquare className="h-4 w-4 text-primary" aria-hidden="true" />
          Checklist de Revisão
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2" role="list">
          {items.map((item) => {
            const itemId = `item_${btoa(unescape(encodeURIComponent(item))).slice(0, 8)}`
            const isChecked = checkedIds.has(itemId)
            return (
              <li key={itemId}>
                <button
                  type="button"
                  onClick={() => toggle(itemId)}
                  className="flex w-full items-start gap-3 rounded-md p-2 text-left transition-colors hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-checked={isChecked}
                  role="checkbox"
                >
                  {isChecked ? (
                    <CheckSquare className="mt-0.5 h-5 w-5 shrink-0 text-green-500" aria-hidden="true" />
                  ) : (
                    <Square className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
                  )}
                  <span className={isChecked ? 'text-muted-foreground line-through' : 'text-foreground'}>
                    {item}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}

ChecklistPanel.displayName = 'ChecklistPanel'
