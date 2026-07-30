/**
 * NextChapterLink — navegação sequencial entre capítulos.
 *
 * Exibe link para o capítulo anterior e/ou próximo,
 * respeitando a ordem do roadmap da disciplina.
 */

import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@/components/foundation/button'
import type { ChapterNavigation } from '@/types/chapter'

export interface NextChapterLinkProps {
  navigation: ChapterNavigation
  onNavigate: (disciplineId: string, chapterId: string) => void
}

export function NextChapterLink({ navigation, onNavigate }: NextChapterLinkProps): React.ReactElement {
  const prev = navigation.previous
  const next = navigation.next

  return (
    <nav
      className="mt-8 flex items-center justify-between border-t pt-6"
      aria-label="Navegação entre capítulos"
    >
      {prev ? (
        <Button
          variant="ghost"
          className="h-auto px-2 py-2 text-left"
          onClick={() => onNavigate(prev.disciplineId, prev.id)}
        >
          <ArrowLeft className="mr-2 h-4 w-4 shrink-0" aria-hidden="true" />
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Anterior</span>
            <span className="text-sm font-medium">{prev.title}</span>
          </div>
        </Button>
      ) : (
        <div />
      )}

      {next ? (
        <Button
          variant="ghost"
          className="h-auto px-2 py-2 text-right"
          onClick={() => onNavigate(next.disciplineId, next.id)}
        >
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Próximo</span>
            <span className="text-sm font-medium">{next.title}</span>
          </div>
          <ArrowRight className="ml-2 h-4 w-4 shrink-0" aria-hidden="true" />
        </Button>
      ) : (
        <div />
      )}
    </nav>
  )
}

NextChapterLink.displayName = 'NextChapterLink'
