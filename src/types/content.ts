/**
 * Tipos do Pipeline de Conteúdo — Concurso AI Platform.
 *
 * Arquitetura extensível: parser desacoplado do renderer.
 * Plugins futuros (Mermaid, quizzes, flashcards, podcasts, NotebookLM)
 * são suportados sem alterar a estrutura base.
 */

import type { ReactElement } from 'react'
import type { PluggableList } from 'unified'

// ---------------------------------------------------------------------------
// Metadados extraídos do frontmatter YAML
// ---------------------------------------------------------------------------

export interface ContentMetadata {
  id?: string
  title?: string
  discipline?: string
  chapter?: string
  topics?: string[]
  keywords?: string[]
  level?: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime?: number // minutos
  version?: string
  updatedAt?: string
  author?: string
  sources?: string[]
}

// ---------------------------------------------------------------------------
// Configuração do parser (remark/rehype pipeline)
// ---------------------------------------------------------------------------

export interface ContentParserConfig {
  /** Plugins remark adicionais (ex: remark-mermaid, remark-quiz). */
  remarkPlugins?: PluggableList
  /** Plugins rehype adicionais (ex: rehype-highlight). */
  rehypePlugins?: PluggableList
  /** Se deve sanitizar HTML bruto (recomendado: true). */
  sanitize?: boolean
  /** Se deve extrair metadados do frontmatter. */
  extractMetadata?: boolean
}

// ---------------------------------------------------------------------------
// Componente customizado para elementos markdown
// ---------------------------------------------------------------------------

export type ContentComponent = (props: Record<string, unknown>) => ReactElement | null

// ---------------------------------------------------------------------------
// Índice de headings (Table of Contents)
// ---------------------------------------------------------------------------

export interface HeadingItem {
  id: string
  text: string
  level: number
}

export interface TableOfContents {
  items: HeadingItem[]
}

// ---------------------------------------------------------------------------
// Resultado do parse
// ---------------------------------------------------------------------------

export interface ParsedContent {
  markdown: string
  metadata: ContentMetadata
  headings: HeadingItem[]
}

// ---------------------------------------------------------------------------
// Slot de plugin futuro (placeholder para extensibilidade)
// ---------------------------------------------------------------------------

export interface ContentPlugin {
  /** Nome identificador do plugin. */
  name: string
  /** Plugins remark a injetar no pipeline. */
  remarkPlugins?: PluggableList
  /** Plugins rehype a injetar no pipeline. */
  rehypePlugins?: PluggableList
}
