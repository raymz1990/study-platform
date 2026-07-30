/**
 * MermaidDiagram — placeholder para renderização de diagramas Mermaid.
 *
 * Escopo da Task 009: apenas a estrutura/extensibilidade.
 * A implementação real do Mermaid é P2/futura (Task 014+).
 *
 * Recebe código Mermaid em formato texto e exibe um placeholder
 * indicando que o diagrama será renderizado no futuro.
 */

import { GitBranch } from 'lucide-react'
import { Card, CardContent } from '@/components/foundation/card'

export interface MermaidDiagramProps {
  /** Código-fonte do diagrama em sintaxe Mermaid. */
  code: string
  /** Título opcional do diagrama. */
  title?: string | undefined
}

export function MermaidDiagram({ code, title }: MermaidDiagramProps): React.ReactElement {
  const lines = code.split('\n').filter(Boolean)

  return (
    <Card className="my-6 overflow-hidden border-dashed">
      <CardContent className="p-0">
        <div className="flex items-center gap-2 border-b bg-muted/50 px-4 py-2">
          <GitBranch className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <span className="text-xs font-medium text-muted-foreground">
            {title ?? 'Mapa Mental / Diagrama'}
          </span>
        </div>
        <div className="space-y-1 p-4">
          <p className="text-sm text-muted-foreground">
            Diagrama Mermaid será renderizado em breve.
          </p>
          <pre className="mt-2 max-h-32 overflow-auto rounded bg-muted p-2 text-xs text-muted-foreground">
            <code>{lines.slice(0, 6).join('\n')}{lines.length > 6 ? '\n...' : ''}</code>
          </pre>
        </div>
      </CardContent>
    </Card>
  )
}

MermaidDiagram.displayName = 'MermaidDiagram'
