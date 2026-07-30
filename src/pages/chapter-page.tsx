/**
 * ChapterPage — página de capítulo/tópico.
 *
 * Renderiza conteúdo Markdown completo com:
 * - índice lateral (TOC)
 * - metadados do documento
 * - checklist final interativo
 * - navegação sequencial
 * - estados: loading, erro, vazio
 *
 * Rota: /disciplinas/:disciplineId/capitulos/:chapterId
 */

import { useMemo, useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AlertCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/foundation/button'
import { Skeleton } from '@/components/foundation/skeleton'
import { MarkdownViewer } from '@/components/content/markdown-viewer'
import { ChapterHeader } from '@/components/content/chapter-header'
import { ChecklistPanel } from '@/components/content/checklist-panel'
import { NextChapterLink } from '@/components/content/next-chapter-link'
import { MermaidDiagram } from '@/components/content/mermaid-diagram'
import { loadChapterContent } from '@/services/content-service'
import { getDisciplineById } from '@/services/discipline-service'
import type { ContentLoadResult } from '@/types/chapter'

// ---------------------------------------------------------------------------
// Itens de checklist padrão quando não há no markdown
// ---------------------------------------------------------------------------

const DEFAULT_CHECKLIST_ITEMS = [
  'Dominei os conceitos principais deste capítulo',
  'Consigo explicar o assunto com minhas próprias palavras',
  'Revisei os pontos de atenção e pegadinhas',
  'Resolvi as questões propostas',
]

// ---------------------------------------------------------------------------
// Extração de itens de checklist do markdown
// ---------------------------------------------------------------------------

function extractChecklistItems(markdown: string): string[] | null {
  const checklistRegex = /##\s*\d*\s*Checklist[\s\S]*?(?=##\s*\d*|$)/i
  const match = markdown.match(checklistRegex)
  if (!match) return null

  const itemRegex = /(?:-|\*)\s*\[\s*[ xX]?\s*\]\s*(.+)/g
  const items: string[] = []
  let m: RegExpExecArray | null
  while ((m = itemRegex.exec(match[0])) !== null) {
    if (m[1]) items.push(m[1].trim())
  }
  return items.length > 0 ? items : null
}

// ---------------------------------------------------------------------------
// Extração de blocos Mermaid do markdown
// ---------------------------------------------------------------------------

interface MermaidBlock {
  code: string
}

function extractMermaidBlocks(markdown: string): MermaidBlock[] {
  const blocks: MermaidBlock[] = []
  const regex = /```mermaid\n([\s\S]*?)```/g
  let m: RegExpExecArray | null
  while ((m = regex.exec(markdown)) !== null) {
    if (m[1]) blocks.push({ code: m[1].trim() })
  }
  return blocks
}

// ---------------------------------------------------------------------------
// Página
// ---------------------------------------------------------------------------

export function ChapterPage(): React.ReactElement {
  const { disciplineId, chapterId } = useParams<{
    disciplineId: string
    chapterId: string
  }>()
  const navigate = useNavigate()

  const [result, setResult] = useState<ContentLoadResult | null>(null)
  const [loading, setLoading] = useState(true)

  const discipline = useMemo(() => {
    if (!disciplineId) return undefined
    return getDisciplineById(disciplineId)
  }, [disciplineId])

  // Carrega conteúdo
  useEffect(() => {
    if (!disciplineId || !chapterId) {
      setResult({ status: 'not_found' })
      setLoading(false)
      return
    }

    let cancelled = false

    async function loadContent(dId: string, cId: string) {
      const loaded = await loadChapterContent(dId, cId)
      if (!cancelled) {
        setResult(loaded)
        setLoading(false)
      }
    }

    void loadContent(disciplineId, chapterId)

    return () => { cancelled = true }
  }, [disciplineId, chapterId])

  const handleNavigate = useCallback(
    (dId: string, cId: string) => {
      navigate(`/disciplinas/${dId}/capitulos/${cId}`)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [navigate]
  )

  // --- Estados ---

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    )
  }

  if (!result || result.status === 'not_found') {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <AlertCircle className="h-10 w-10 text-destructive" aria-hidden="true" />
        <h2 className="mt-4 text-lg font-semibold">Capítulo não encontrado</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          O conteúdo deste capítulo ainda não foi disponibilizado.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() =>
            disciplineId
              ? navigate(`/disciplinas/${disciplineId}`)
              : navigate('/disciplinas')
          }
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para a disciplina
        </Button>
      </div>
    )
  }

  if (result.status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <AlertCircle className="h-10 w-10 text-destructive" aria-hidden="true" />
        <h2 className="mt-4 text-lg font-semibold">Erro ao carregar conteúdo</h2>
        <p className="mt-1 text-sm text-muted-foreground">{result.message}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Tentar novamente
        </Button>
      </div>
    )
  }

  // --- Sucesso ---

  const { content, navigation } = result
  const { parsed } = content
  const checklistItems =
    extractChecklistItems(parsed.markdown) ?? DEFAULT_CHECKLIST_ITEMS
  const mermaidBlocks = extractMermaidBlocks(parsed.markdown)

  // Remove blocos mermaid do markdown para não exibir código cru
  const cleanMarkdown = parsed.markdown.replace(/```mermaid\n[\s\S]*?```/g, '')

  // Atualiza o parsed com markdown limpo
  const cleanParsed = { ...parsed, markdown: cleanMarkdown }

  return (
    <div className="mx-auto flex max-w-5xl gap-8">
      {/* Conteúdo principal */}
      <div className="min-w-0 flex-1">
        {/* Cabeçalho com metadados */}
        <ChapterHeader
          metadata={cleanParsed.metadata}
          disciplineName={discipline?.name}
        />

        {/* Conteúdo Markdown com TOC lateral */}
        <MarkdownViewer
          source={cleanParsed.markdown}
          showToc={true}
          className="mt-6"
        />

        {/* Diagramas Mermaid (placeholder) */}
        {mermaidBlocks.length > 0 && (
          <section aria-labelledby="mermaid-heading">
            <h2
              id="mermaid-heading"
              className="mb-4 mt-8 text-lg font-semibold tracking-tight"
            >
              Mapa Mental
            </h2>
            {mermaidBlocks.map((block, i) => (
              <MermaidDiagram key={i} code={block.code} />
            ))}
          </section>
        )}

        {/* Checklist final */}
        {disciplineId && chapterId && discipline && (
          <ChecklistPanel
            disciplineId={disciplineId}
            chapterId={chapterId}
            disciplineName={discipline.name}
            chapterName={
              cleanParsed.metadata.title ??
              discipline.modules
                .flatMap((m) => m.chapters)
                .find((c) => c.id === chapterId)?.title ??
              chapterId
            }
            items={checklistItems}
          />
        )}

        {/* Navegação */}
        <NextChapterLink navigation={navigation} onNavigate={handleNavigate} />
      </div>
    </div>
  )
}

ChapterPage.displayName = 'ChapterPage'
