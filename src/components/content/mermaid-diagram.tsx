/**
 * MermaidDiagram — fallback informativo para diagramas Mermaid.
 *
 * DECISÃO v1.0: renderização real do Mermaid é P2/futura (Task 014+).
 * O edital DATAPREV Perfil 10 não exige diagramas. O conteúdo de Mermaid
 * nos capítulos é didático/secundário. Manter fallback informativo como
 * solução definitiva para a v1.0, com upgrade planejado para v2.0+.
 *
 * Recebe código Mermaid em formato texto e exibe um card elegante
 * indicando que o diagrama será renderizado em versão futura.
 */

import { GitBranch, Info } from 'lucide-react'
import { Card, CardContent } from '@/components/foundation/card'

export interface MermaidDiagramProps {
  /** Código-fonte do diagrama em sintaxe Mermaid. */
  code: string
  /** Título opcional do diagrama. */
  title?: string | undefined
}

export function MermaidDiagram({ code, title }: MermaidDiagramProps): React.ReactElement {
  const lines = code.split('\n').filter(Boolean)
  const previewLines = lines.slice(0, 8)
  const hasMore = lines.length > 8

  return (
    <Card className="my-6 overflow-hidden border-dashed">
      <CardContent className="p-0">
        {/* Cabeçalho */}
        <div className="flex items-center gap-2 border-b bg-muted/50 px-4 py-2">
          <GitBranch className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <span className="text-xs font-medium text-muted-foreground">
            {title ?? 'Mapa Mental / Diagrama'}
          </span>
        </div>

        {/* Corpo */}
        <div className="space-y-3 p-4">
          {/* Aviso */}
          <div className="flex items-start gap-2 rounded-md bg-amber-50 p-3 dark:bg-amber-950/30">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                Visualização em desenvolvimento
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-400">
                O diagrama abaixo será renderizado automaticamente em uma versão futura.
                Por enquanto, use o código-fonte como referência para estudar a estrutura.
              </p>
            </div>
          </div>

          {/* Código-fonte */}
          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">
              Código-fonte Mermaid
            </p>
            <pre className="max-h-48 overflow-auto rounded-md bg-muted p-3 text-xs leading-relaxed text-muted-foreground">
              <code>
                {previewLines.join('\n')}
                {hasMore && (
                  <span className="italic opacity-70">{'\n'}... (+{lines.length - 8} linhas)</span>
                )}
              </code>
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

MermaidDiagram.displayName = 'MermaidDiagram'
