/**
 * LearningPath — visualização do caminho de aprendizagem de uma disciplina.
 *
 * Requisitos:
 * - Exibe módulos como estágios de um caminho.
 * - Capítulos dentro de cada módulo.
 * - Cores semânticas de progresso.
 */

import { CheckCircle2, Circle, PlayCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Module, DisciplineStatus } from '@/types/discipline'
import { TopicCard } from './topic-card'

export interface LearningPathProps {
  modules: Module[]
  chapterStatuses: Record<string, DisciplineStatus>
  onChapterClick?: (id: string) => void
}

function ModuleStatusIcon({ status }: { status: DisciplineStatus }): React.ReactElement {
  if (status === 'completed') {
    return <CheckCircle2 className="h-5 w-5 text-green-500" aria-hidden="true" />
  }
  if (status === 'in_progress') {
    return <PlayCircle className="h-5 w-5 text-blue-500" aria-hidden="true" />
  }
  return <Circle className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
}

function deriveModuleStatus(chapters: { id: string; status: DisciplineStatus }[]): DisciplineStatus {
  const allCompleted = chapters.length > 0 && chapters.every((c) => c.status === 'completed')
  const anyStarted = chapters.some((c) => c.status === 'in_progress' || c.status === 'completed')

  if (allCompleted) return 'completed'
  if (anyStarted) return 'in_progress'
  return 'not_started'
}

export function LearningPath({ modules, chapterStatuses, onChapterClick }: LearningPathProps): React.ReactElement {
  return (
    <div className="space-y-8">
      {modules.map((module, moduleIndex) => {
        const chaptersWithStatus = module.chapters.map((c) => ({
          ...c,
          status: chapterStatuses[c.id] ?? 'not_started',
        }))
        const moduleStatus = deriveModuleStatus(chaptersWithStatus)

        return (
          <section
            key={module.id}
            className="relative"
            aria-labelledby={`module-heading-${module.id}`}
          >
            {/* Conector vertical (exceto no primeiro) */}
            {moduleIndex > 0 && (
              <div className="absolute -top-8 left-5 h-8 w-px bg-border" aria-hidden="true" />
            )}

            {/* Cabeçalho do módulo */}
            <div className="mb-4 flex items-center gap-3">
              <div
                className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border',
                  moduleStatus === 'completed' && 'border-green-500 bg-green-50 dark:bg-green-950',
                  moduleStatus === 'in_progress' && 'border-blue-500 bg-blue-50 dark:bg-blue-950',
                  moduleStatus === 'not_started' && 'border-muted bg-muted/50'
                )}
              >
                <ModuleStatusIcon status={moduleStatus} />
              </div>
              <div>
                <h3
                  id={`module-heading-${module.id}`}
                  className="text-sm font-semibold tracking-tight"
                >
                  {module.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {module.chapters.length} capítulo{module.chapters.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {/* Lista de capítulos */}
            <div className="ml-5 space-y-2 border-l border-border pl-6">
              {chaptersWithStatus.map((chapter) => (
                <TopicCard
                  key={chapter.id}
                  chapter={chapter}
                  status={chapter.status}
                  onClick={onChapterClick}
                />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}

LearningPath.displayName = 'LearningPath'
