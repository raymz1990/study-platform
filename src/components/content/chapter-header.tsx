/**
 * ChapterHeader — cabeçalho da página de capítulo.
 *
 * Exibe metadados do documento: título, disciplina, tempo estimado,
 * nível de dificuldade, palavras-chave e versão.
 */

import { Clock, BarChart3, Tag, BookOpen } from 'lucide-react'
import { Badge } from '@/components/foundation/badge'
import type { ContentMetadata } from '@/types/content'

export interface ChapterHeaderProps {
  metadata: ContentMetadata
  disciplineName?: string | undefined
}

const LEVEL_LABELS: Record<string, string> = {
  beginner: 'Iniciante',
  intermediate: 'Intermediário',
  advanced: 'Avançado',
}

const LEVEL_VARIANTS: Record<string, 'default' | 'secondary' | 'info' | 'success' | 'warning' | 'danger'> = {
  beginner: 'success',
  intermediate: 'info',
  advanced: 'warning',
}

export function ChapterHeader({ metadata, disciplineName }: ChapterHeaderProps): React.ReactElement {
  return (
    <header className="mb-8 space-y-4">
      {/* Título */}
      <div>
        {disciplineName && (
          <div className="mb-2 flex items-center gap-1.5 text-sm text-muted-foreground">
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            <span>{disciplineName}</span>
            {metadata.chapter && (
              <>
                <span className="text-muted-foreground/50">·</span>
                <span>{metadata.chapter}</span>
              </>
            )}
          </div>
        )}
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {metadata.title ?? 'Capítulo'}
        </h1>
      </div>

      {/* Metadados */}
      <div className="flex flex-wrap items-center gap-2">
        {metadata.estimatedTime && (
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" aria-hidden="true" />
            {metadata.estimatedTime} min
          </Badge>
        )}

        {metadata.level && (
          <Badge variant={LEVEL_VARIANTS[metadata.level] ?? 'secondary'}>
            <BarChart3 className="mr-1 h-3 w-3" aria-hidden="true" />
            {LEVEL_LABELS[metadata.level] ?? metadata.level}
          </Badge>
        )}

        {metadata.version && (
          <Badge variant="outline">v{metadata.version}</Badge>
        )}
      </div>

      {/* Palavras-chave */}
      {metadata.keywords && metadata.keywords.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <Tag className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
          {metadata.keywords.map((kw) => (
            <span
              key={kw}
              className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
            >
              {kw}
            </span>
          ))}
        </div>
      )}
    </header>
  )
}

ChapterHeader.displayName = 'ChapterHeader'
