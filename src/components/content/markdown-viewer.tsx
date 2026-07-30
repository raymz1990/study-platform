/**
 * MarkdownViewer — renderizador oficial de conteúdo Markdown.
 *
 * Arquitetura extensível:
 *   - Parser: pipeline remark/rehype configurável via ContentParserConfig
 *   - Renderer: mapa de componentes React customizados
 *
 * Plugins futuros (estrutura preparada, não implementados):
 *   - remark-mermaid → MermaidDiagram component
 *   - remark-quiz → Quiz component
 *   - remark-flashcard → FlashcardInline component
 *   - rehype-highlight → syntax highlighting avançado
 *   - export-notebooklm → conversão para formato NotebookLM
 */

import { useMemo, useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'
import { Callout } from '@/components/content/callout'
import { CodeBlock } from '@/components/content/code-block'
import {
  TableRenderer,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableCell,
} from '@/components/content/table-renderer'
import { HeadingAnchor } from '@/components/content/heading-anchor'
import { createParser } from '@/services/content-parser'
import type {
  ContentParserConfig,
  ParsedContent,
  HeadingItem,
} from '@/types/content'
import { isValidCalloutVariant } from '@/utils/callout-registry'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Componentes padrão do renderer
// ---------------------------------------------------------------------------

function createDefaultComponents(): Components {
  return {
    h1: ({ children, id }) => (
      <HeadingAnchor level={1} id={id}>
        {children}
      </HeadingAnchor>
    ),
    h2: ({ children, id }) => (
      <HeadingAnchor level={2} id={id}>
        {children}
      </HeadingAnchor>
    ),
    h3: ({ children, id }) => (
      <HeadingAnchor level={3} id={id}>
        {children}
      </HeadingAnchor>
    ),
    h4: ({ children, id }) => (
      <HeadingAnchor level={4} id={id}>
        {children}
      </HeadingAnchor>
    ),
    h5: ({ children, id }) => (
      <HeadingAnchor level={5} id={id}>
        {children}
      </HeadingAnchor>
    ),
    h6: ({ children, id }) => (
      <HeadingAnchor level={6} id={id}>
        {children}
      </HeadingAnchor>
    ),

    p: ({ children }) => (
      <p className="my-4 leading-relaxed text-foreground">
        {children}
      </p>
    ),

    ul: ({ children, ...props }) => (
      <ul className="my-4 list-disc space-y-1 pl-6 text-foreground" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol className="my-4 list-decimal space-y-1 pl-6 text-foreground" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => (
      <li className="leading-relaxed" {...props}>
        {children}
      </li>
    ),

    table: ({ children, ...props }) => (
      <TableRenderer {...props}>{children}</TableRenderer>
    ),
    thead: ({ children, ...props }) => (
      <TableHead {...props}>{children}</TableHead>
    ),
    tr: ({ children, ...props }) => (
      <TableRow {...props}>{children}</TableRow>
    ),
    th: ({ children, ...props }) => (
      <TableHeaderCell {...props}>{children}</TableHeaderCell>
    ),
    td: ({ children, ...props }) => (
      <TableCell {...props}>{children}</TableCell>
    ),

    pre: ({ children }) => <>{children}</>,
    code: ({ children, className }) => {
      const isInline = !className
      const language = className?.replace('language-', '')
      const code = String(children).replace(/\n$/, '')

      if (isInline) {
        return (
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm text-foreground">
            {children}
          </code>
        )
      }

      return <CodeBlock code={code} {...(language ? { language } : {})} />
    },

    a: ({ children, href, ...props }) => (
      <a
        href={href}
        className="text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
        {...props}
      >
        {children}
      </a>
    ),

    strong: ({ children, ...props }) => (
      <strong className="font-semibold text-foreground" {...props}>
        {children}
      </strong>
    ),
    em: ({ children, ...props }) => (
      <em className="italic text-foreground" {...props}>
        {children}
      </em>
    ),

    hr: (props) => <hr className="my-8 border-border" {...props} />,
  }
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface MarkdownViewerProps {
  source: string
  parserConfig?: ContentParserConfig
  customComponents?: Partial<Components>
  showToc?: boolean
  className?: string
}

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

export function MarkdownViewer({
  source,
  parserConfig,
  customComponents,
  showToc = false,
  className,
}: MarkdownViewerProps): React.ReactElement {
  const parser = useMemo(() => createParser(parserConfig), [parserConfig])
  const parsed = useMemo<ParsedContent>(() => parser.parse(source), [parser, source])

  const components = useMemo<Components>(() => {
    const base = createDefaultComponents()

    const merged = customComponents
      ? { ...base, ...customComponents }
      : base

    merged.blockquote = ({ children, className }) => {
      // Detect callout via className from remark-callout plugin
      const classString = Array.isArray(className) ? className.join(' ') : (className ?? '')
      const calloutMatch = classString.match(/callout-(attention|trap|memorization|important|legislation)/)
      const calloutType = calloutMatch ? calloutMatch[1] : undefined

      if (calloutType && isValidCalloutVariant(calloutType)) {
        return (
          <Callout type={calloutType}>
            {children}
          </Callout>
        )
      }

      return (
        <blockquote className={cn('my-6 border-l-4 border-primary/30 bg-muted/50 py-3 pl-4 pr-3 italic', className)}>
          {children}
        </blockquote>
      )
    }

    return merged
  }, [customComponents])

  return (
    <div className={cn('flex gap-8', className)}>
      <article className="min-w-0 flex-1">
        {parsed.metadata.title && (
          <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              {parsed.metadata.title}
            </h1>
            {parsed.metadata.discipline && (
              <p className="mt-2 text-sm text-muted-foreground">
                {parsed.metadata.discipline}
                {parsed.metadata.chapter ? ` · ${parsed.metadata.chapter}` : ''}
              </p>
            )}
            {parsed.metadata.estimatedTime && (
              <p className="mt-1 text-xs text-muted-foreground">
                Tempo estimado: {parsed.metadata.estimatedTime} min
              </p>
            )}
          </header>
        )}

        <ReactMarkdown
          remarkPlugins={parser.getRemarkPlugins()}
          rehypePlugins={parser.getRehypePlugins()}
          components={components}
        >
          {parsed.markdown}
        </ReactMarkdown>
      </article>

      {showToc && parsed.headings.length > 0 && (
        <TableOfContents headings={parsed.headings} />
      )}
    </div>
  )
}

MarkdownViewer.displayName = 'MarkdownViewer'

// ---------------------------------------------------------------------------
// Table of Contents
// ---------------------------------------------------------------------------

function TableOfContents({
  headings,
}: {
  headings: HeadingItem[]
}): React.ReactElement {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px' }
    )

    for (const heading of headings) {
      const el = document.getElementById(heading.id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [headings])

  return (
    <aside className="hidden w-56 shrink-0 xl:block">
      <nav
        className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto rounded-lg border bg-card p-4"
        aria-label="Índice do documento"
      >
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Índice
        </p>
        <ul className="space-y-1" role="list">
          {headings.map((heading) => (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                className={cn(
                  'block truncate rounded px-2 py-1 text-sm transition-colors',
                  heading.level === 1 && 'font-medium',
                  heading.level >= 3 && 'pl-4 text-xs',
                  activeId === heading.id
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                )}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
