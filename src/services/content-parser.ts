/**
 * Content Parser — Concurso AI Platform.
 *
 * Pipeline remark/rehype desacoplado do renderer.
 * Extensível via ContentParserConfig (plugins adicionais).
 *
 * Plugins ativos:
 * - remark-gfm: tabelas, listas de tarefas, tachado
 * - remark-frontmatter: extração de YAML frontmatter
 * - remark-callout: transforma blockquotes em callouts
 * - rehype-sanitize: sanitização de HTML bruto
 *
 * Plugins futuros (preparados, não implementados):
 * - remark-mermaid: diagramas
 * - remark-quiz: quizzes interativos
 * - remark-flashcard: flashcards inline
 */

import { z } from 'zod'
import type { PluggableList } from 'unified'
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import { remarkCallout } from '@/services/remark-callout'
import { slugify } from '@/utils/slugify'
import type {
  ContentParserConfig,
  ContentMetadata,
  HeadingItem,
  ParsedContent,
} from '@/types/content'

// ---------------------------------------------------------------------------
// Schema de sanitização customizado — permite classes e data attributes
// ---------------------------------------------------------------------------

const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...(defaultSchema.attributes ?? {}),
    div: [...(defaultSchema.attributes?.div ?? []), 'className', 'dataCalloutType'],
    span: [...(defaultSchema.attributes?.span ?? []), 'className'],
    blockquote: [...(defaultSchema.attributes?.blockquote ?? []), 'className'],
    h1: [...(defaultSchema.attributes?.h1 ?? []), 'className', 'id'],
    h2: [...(defaultSchema.attributes?.h2 ?? []), 'className', 'id'],
    h3: [...(defaultSchema.attributes?.h3 ?? []), 'className', 'id'],
    h4: [...(defaultSchema.attributes?.h4 ?? []), 'className', 'id'],
    h5: [...(defaultSchema.attributes?.h5 ?? []), 'className', 'id'],
    h6: [...(defaultSchema.attributes?.h6 ?? []), 'className', 'id'],
  },
}

// ---------------------------------------------------------------------------
// Schema Zod para validação de frontmatter
// ---------------------------------------------------------------------------

export const FrontmatterSchema = z.object({
  id: z.string().optional(),
  title: z.string().optional(),
  discipline: z.string().optional(),
  module: z.string().optional(),
  chapter: z.string().optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  estimated_time: z.coerce.number().int().positive().optional(),
  author: z.string().optional(),
  updated: z.string().optional(),
  topics: z.union([z.string(), z.array(z.string())]).optional(),
  keywords: z.union([z.string(), z.array(z.string())]).optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  estimatedTime: z.coerce.number().int().positive().optional(),
  version: z.string().optional(),
  updatedAt: z.string().optional(),
  sources: z.union([z.string(), z.array(z.string())]).optional(),
})

export type FrontmatterInput = z.input<typeof FrontmatterSchema>

// ---------------------------------------------------------------------------
// Extração e validação de frontmatter YAML
// ---------------------------------------------------------------------------

export class FrontmatterValidationError extends Error {
  readonly issues: z.ZodIssue[]

  constructor(message: string, issues: z.ZodIssue[]) {
    super(message)
    this.name = 'FrontmatterValidationError'
    this.issues = issues
  }
}

function parseYamlValue(value: string): unknown {
  const trimmed = value.trim()
  if (trimmed === 'true') return true
  if (trimmed === 'false') return false
  if (/^-?\d+$/.test(trimmed)) return Number.parseInt(trimmed, 10)
  if (/^-?\d+\.\d+$/.test(trimmed)) return Number.parseFloat(trimmed)
  if (/^\[.*\]$/.test(trimmed)) {
    return trimmed
      .slice(1, -1)
      .split(',')
      .map((s) => s.trim().replace(/^["']|["']$/g, ''))
      .filter(Boolean)
  }
  return trimmed.replace(/^["']|["']$/g, '')
}

function extractRawFrontmatter(markdown: string): {
  raw: Record<string, unknown> | null
  body: string
} {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n?/
  const match = markdown.match(frontmatterRegex)

  if (!match || match[1] === undefined) {
    return { raw: null, body: markdown }
  }

  const yamlText = match[1]
  const body = markdown.slice(match[0].length)
  const raw: Record<string, unknown> = {}

  for (const line of yamlText.split('\n')) {
    const colonIdx = line.indexOf(':')
    if (colonIdx === -1) continue

    const key = line.slice(0, colonIdx).trim()
    const rawValue = line.slice(colonIdx + 1).trim()
    raw[key] = parseYamlValue(rawValue)
  }

  return { raw, body }
}

function normalizeFrontmatter(
  validated: z.infer<typeof FrontmatterSchema>
): ContentMetadata {
  const raw = {
    id: validated.id,
    title: validated.title,
    discipline: validated.discipline,
    chapter: validated.chapter ?? validated.module,
    level: validated.difficulty ?? validated.level,
    estimatedTime: validated.estimated_time ?? validated.estimatedTime,
    version: validated.version,
    updatedAt: validated.updated ?? validated.updatedAt,
    author: validated.author,
    topics: Array.isArray(validated.topics)
      ? validated.topics
      : typeof validated.topics === 'string'
        ? validated.topics.split(',').map((t) => t.trim())
        : undefined,
    keywords: Array.isArray(validated.keywords)
      ? validated.keywords
      : typeof validated.keywords === 'string'
        ? validated.keywords.split(',').map((k) => k.trim())
        : undefined,
    sources: Array.isArray(validated.sources)
      ? validated.sources
      : typeof validated.sources === 'string'
        ? validated.sources.split(',').map((s) => s.trim())
        : undefined,
  }

  return Object.fromEntries(
    Object.entries(raw).filter(([, v]) => v !== undefined)
  ) as ContentMetadata
}

function extractFrontmatter(markdown: string): {
  metadata: ContentMetadata
  body: string
} {
  const { raw, body } = extractRawFrontmatter(markdown)

  if (!raw) {
    return { metadata: {}, body }
  }

  const result = FrontmatterSchema.safeParse(raw)

  if (!result.success) {
    const issues = result.error.issues
    const paths = issues.map((i) => i.path.join('.')).join(', ')
    throw new FrontmatterValidationError(
      `Frontmatter inválido: ${paths}`,
      issues
    )
  }

  return { metadata: normalizeFrontmatter(result.data), body }
}

// ---------------------------------------------------------------------------
// Extração de headings para índice (TOC)
// ---------------------------------------------------------------------------

function extractHeadings(markdown: string): HeadingItem[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm
  const headings: HeadingItem[] = []
  let match: RegExpExecArray | null

  while ((match = headingRegex.exec(markdown)) !== null) {
    if (match[1] === undefined || match[2] === undefined) continue
    const level = match[1].length
    const text = match[2].trim()
    const id = slugify(text)

    headings.push({ id, text, level })
  }

  return headings
}

// ---------------------------------------------------------------------------
// Factory do pipeline
// ---------------------------------------------------------------------------

export function createParser(config: ContentParserConfig = {}) {
  const {
    remarkPlugins = [],
    rehypePlugins = [],
    sanitize = true,
    extractMetadata: shouldExtractMetadata = true,
  } = config

  return {
    parse(markdown: string): ParsedContent {
      let body = markdown
      let metadata: ContentMetadata = {}

      if (shouldExtractMetadata) {
        const extracted = extractFrontmatter(markdown)
        metadata = extracted.metadata
        body = extracted.body
      }

      const headings = extractHeadings(body)

      return {
        markdown: body,
        metadata,
        headings,
      }
    },

    getRemarkPlugins(): PluggableList {
      return [remarkGfm, remarkFrontmatter, remarkCallout, ...remarkPlugins]
    },

    getRehypePlugins(): PluggableList {
      const base: PluggableList = [
        ...(sanitize ? ([[rehypeSanitize, sanitizeSchema]] as PluggableList) : []),
      ]
      return [...base, ...rehypePlugins]
    },
  }
}

export const defaultParser = createParser()
